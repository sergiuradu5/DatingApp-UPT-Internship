using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController: ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper,
         UserManager<User> userManager, SignInManager<User> signInManager)
        {
            

            _repo =repo;
            _config=config;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register (UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
            if (await _repo.UserExists(userForRegisterDTO.Username))
                return BadRequest("Username already exists");

            var userToCreate = _mapper.Map<User>(userForRegisterDTO);
            var createdUser = await _repo.Register(userToCreate, userForRegisterDTO.Password);
            var userToReturn = _mapper.Map<UserForDetailedDTO>(createdUser);
            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id}, userToReturn );
            /* CreatedAtRoute returns an "address" where we could find the newly created object in the future */
            
            /* "GetUser" is the name of the HTTPGET request, the next is the controller that contains that methon,
                and the last is the object in itself, but we do not want to send the user with the password all together */
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDTO.Username);
            if(user == null)
            {
                return Unauthorized();
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user,
            userForLoginDTO.Password, false);
           
            if (result.Succeeded)
            {
                 var appUser =  _mapper.Map<UserForListDTO>(user);
                 return Ok(new {
                token= GenerateJwtToken(user),
                user = appUser
            });
            }
            return Unauthorized();
        }

        private string GenerateJwtToken(User user)
        {
             var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = System.DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}