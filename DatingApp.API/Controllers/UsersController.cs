using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DatingApp.API.Helpers;
using System;
using DatingApp.API.Models;

namespace DatingApp.API.Controllers {
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController (IDatingRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers ([FromQuery]UsersParams usersParams) {
            
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);

            usersParams.UserId = currentUserId;
            if(string.IsNullOrEmpty(usersParams.Gender))
            {
                if(userFromRepo.Gender == "male")
                usersParams.Gender = "female";

                if(userFromRepo.Gender == "female")
                usersParams.Gender = "male";

                if(userFromRepo.Gender == "other")
                usersParams.Gender = "other";
            }

            var users = await _repo.GetUsers (usersParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalPages);

            return Ok (usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser (int id) {
            var user = await _repo.GetUser (id);
            var userToReturn = _mapper.Map<UserForDetailedDTO>(user);
            return Ok (userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);

            if(await _repo.SaveAll())
            return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
                return BadRequest("You already like this user");

            if (await _repo.GetUser(recipientId) == null)
                return NotFound();

            like = new Like     //If the like doesn't exist already, this part creates a new like
            {
                LikerId = id,
                LikeeId = recipientId

            };
            _repo.Add<Like>(like); //Adding the newly created like to our repo

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest( "Failed to like user");
        }


    }
}