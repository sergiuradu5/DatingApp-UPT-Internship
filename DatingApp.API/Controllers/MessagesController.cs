using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route ("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo,
        IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int userId, [FromQuery]MessageParams messageParams)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, 
            messagesFromRepo.PageSize, messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDTO messageForCreationDTO)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                 return Unauthorized(); //This method is checking if the ID of the user requesting this HttpPost is
                                        //..is the same as userId (if they are different that means that somebody can pose / send messages as different users)
            
            messageForCreationDTO.SenderId = userId;

            var recipient = await _repo.GetUser(messageForCreationDTO.RecipientId);

            if(recipient == null)
                return BadRequest("Could not find user");
            
        var message = _mapper.Map<Message>(messageForCreationDTO);

        

        _repo.Add(message);

        var messageToReturn = _mapper.Map<MessageForCreationDTO>(message);
        if (await _repo.SaveAll())
            return CreatedAtRoute("GetMessage", new {id = message.Id}, messageToReturn);
        
        throw new Exception("Creating the message failed on save");

        }
    }
}