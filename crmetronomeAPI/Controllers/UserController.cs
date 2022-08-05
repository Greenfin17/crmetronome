using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using crmetronomeAPI.DataAccess;
using crmetronomeAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace crmetronomeAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    // [Authorize]

    public class UserController : ControllerBase

    {
        private UserRepository _userRepository;
        public UserController(UserRepository userRepo)
        {
            _userRepository = userRepo;
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var result = _userRepository.GetAll();
            if (result.Count() >= 0)
            {
                return Ok(result);
            }
            else return NotFound("No users");
        }

        [HttpGet("{userId}")]
        public IActionResult GetUserById(Guid userId)
        {
            var result = _userRepository.GetUserById(userId);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"User with id ${userId} not found.");
        }
        [HttpGet("uid/{uid}")]
        public IActionResult GetUserByFirebaseUId(string uid)
        {
            var result = _userRepository.GetUserByFirebaseUID(uid);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"User with id ${uid} not found.");
        }

        [HttpPost]
        public IActionResult AddUser(User userObj)
        {
            var result = _userRepository.AddUser(userObj);
            if (!result.Equals(Guid.Empty))
            {
                return Created($"/api/users/${result}", result);
            }

            else return BadRequest($"User ${userObj.FirstName} ${userObj.LastName} not added.");
        }

        [HttpPut("{userId}")]
        public IActionResult UpdateUser(Guid userId, User userObj)
        {
            var result = _userRepository.UpdateUser(userId, userObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"User with id ${userId} not updated.");
        }
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(Guid userId)
        {
            var result = _userRepository.DeleteUser(userId);
            if (result)
            {
                return Ok($"User with Id ${userId} was deleted.");
            }
            else return BadRequest($"User with Id ${userId} not deleted");
        }
    }
}

