using Microsoft.AspNetCore.Mvc;
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
    [Route("api/excerpts")]
    // [Authorize]
    public class ExcerptController : ControllerBase 
    {
        private readonly ExcerptRepository _excerptRepository;
        public ExcerptController(ExcerptRepository excerptRepo)
        {
            _excerptRepository = excerptRepo;
        }

        [HttpGet]
        public IActionResult GetAllExcerpts()
        {
            var result = _excerptRepository.GetAll();
            return Ok(result);
        }


        [HttpGet("{excerptID}")]
        public IActionResult GetExcerptByID(Guid excerptID)
        {
            var result = _excerptRepository.GetExcerptByID(excerptID);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Excerpt with ID ${excerptID} not found.");
        }

        [HttpGet("composition/{compositionID}")]
        public IActionResult GetExcerptsByCompositionID(Guid compositionID)
        {
            var result = _excerptRepository.GetExcerptsByCompositionID(compositionID);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddExcerpt(Excerpt excerptObj)
        {
            var result = _excerptRepository.AddExcerpt(excerptObj);
            if (!result.Equals(Guid.Empty))
            {
                return Ok(result);
            }
            else return BadRequest("Excerpt not added");
        }

        [HttpPut("{excerptID}")]
        public IActionResult UpdateExcerpt(Guid excerptID, Excerpt excerptObj)
        {
            var result = _excerptRepository.UpdateExcerpt(excerptID, excerptObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Excerpt with ID ${excerptID} not updated.");
        }
        
        [HttpPatch()]
        public IActionResult UpdateExcerptWithPatch(Excerpt excerptObj)
        {
            var result = _excerptRepository.UpdateExcerptWithPatch(excerptObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Excerpt with ID ${excerptObj.ID} not updated.");
        }


        [HttpDelete("{excerptID}")]
        public IActionResult DeleteExcerpt(Guid excerptID)
        {
            var result = _excerptRepository.DeleteExcerpt(excerptID);
            if (!result.Equals(Guid.Empty))
            {
                return Ok($"Excerpt with ID ${excerptID} was deleted.");
            }
            else return BadRequest($"Excerpt with ID ${excerptID} not found or not deleted.");
        }
    }
}
