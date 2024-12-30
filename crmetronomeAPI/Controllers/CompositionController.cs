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
    [Route("api/compositions")]
    // [Authorize]
    public class CompositionController : ControllerBase
    {
        private CompositionRepository _compositionRepository;
        public CompositionController(CompositionRepository compositionRepo)
        {
            _compositionRepository = compositionRepo;
        }

        [HttpGet]
        public IActionResult GetAllCompositions()
        {
            var result = _compositionRepository.GetAll();
            return Ok(result);
        }

        [HttpGet("{compositionID}")]
        public IActionResult GetCompositionByID(Guid compositionID)
        {
            var result = _compositionRepository.GetCompositionByID(compositionID);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Composer with id ${compositionID} not found.");
        }

        [HttpGet("composer/{composerID}")]
        public IActionResult GetCompositionsByComposerID(Guid composerID)
        {
            var result = _compositionRepository.GetCompositionsByComposerID(composerID);
            // no results is OK
            return Ok(result);
        }


        [HttpGet("title/{title}")]
        public IActionResult GetCompositionByTitle(string title)
        {
            var result = _compositionRepository.GetCompositionByTitle(title);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Composition(s) with title ${title} not found.");
        }

        [HttpPost]
        public IActionResult AddComposition(Composition compositionObj)
        {
            var result = _compositionRepository.AddComposition(compositionObj);
            if (!result.Equals(Guid.Empty))
            {
                return Created($"/api/compositions/${result}", result);
            }

            else return BadRequest($"Composition ${compositionObj.Title} added.");
        }

        [HttpPut("{compositionId}")]
        public IActionResult UpdateComposition(Guid compositionId, Composition compositionObj)
        {
            var result = _compositionRepository.UpdateComposition(compositionId, compositionObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Composition with ID ${compositionId} not updated.");
        }

        [HttpPatch()]
        public IActionResult UpdateCompositionWithPatch(Composition compositionObj)
        {
            Composition result = _compositionRepository.UpdateCompositionWithPatch(compositionObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Composition with ID ${compositionObj.ID} not updated");
        }


        [HttpDelete("{compositionId}")]
        public IActionResult DeleteComposition(Guid compositionId)
        {
            var result = _compositionRepository.DeleteComposition(compositionId);
            if (result)
            {
                return Ok($"Composition with Id ${compositionId} was deleted.");
            }
            else return BadRequest($"Composition with Id ${compositionId} not deleted");
        }
    }
}



