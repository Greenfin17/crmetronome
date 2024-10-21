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
    [Route("api/composers")]
    // [Authorize]

    public class ComposerController : ControllerBase

    {
        private readonly ComposerRepository _composerRepository;
        public ComposerController(ComposerRepository composerRepo)
        {
            _composerRepository = composerRepo;
        }

        [HttpGet]
        public IActionResult GetAllComposers()
        {
            var result = _composerRepository.GetAll();
            return Ok(result);
        }

        [HttpGet("{composerId}")]
        public IActionResult GetComposerById(Guid composerId)
        {
            var result = _composerRepository.GetComposerById(composerId);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Composer with id ${composerId} not found.");
        }

        [HttpGet("last/{last}")]
        public IActionResult GetComposerByLast(string last)
        {
            var result = _composerRepository.GetComposerByLast(last);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Composer(s) with lastname ${last} not found.");
        }

        [HttpPost]
        public IActionResult AddComposer(Composer composerObj)
        {
            var result = _composerRepository.AddComposer(composerObj);
            if (!result.Equals(Guid.Empty))
            {
                return Created($"/api/composers/${result}", result);
            }

            else return BadRequest($"Composer ${composerObj.First} ${composerObj.Last} not added.");
        }

        [HttpPut("{composerId}")]
        public IActionResult UpdateComposer(Guid composerId, Composer composerObj)
        {
            var result = _composerRepository.UpdateComposer(composerId, composerObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Composer with id ${composerId} not updated.");
        }

        [HttpPatch()]
        public IActionResult UpdateComposerWithPatch(Composer composerObj)
        {
            var result = _composerRepository.UpdateComposerWithPatch(composerObj);
            if (result != null)
            {
                return Ok(result);
            }
            else return BadRequest($"Composer with id ${composerObj.ID} not updated.");
        }

        [HttpDelete("{composerId}")]
        public IActionResult DeleteComposer(Guid composerId)
        {
            var result = _composerRepository.DeleteComposer(composerId);
            if (result)
            {
                return Ok($"Composer with Id ${composerId} was deleted.");
            }
            else return BadRequest($"Composer with Id ${composerId} not deleted");
        }
    }
}


