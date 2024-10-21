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
    [Route("api/patterns")]
    // [Authorize]

    public class PatternController : ControllerBase
    {
        private readonly PatternRepository _patternRepository;
        public PatternController(PatternRepository patternRepo)
        {
            _patternRepository = patternRepo;
        }

        [HttpGet]
        public IActionResult GetAllPatterns()
        {
            var result = _patternRepository.GetAll();
            return Ok(result);
        }

        [HttpGet("{patternID}")]
        public IActionResult GetPatternByID(Guid patternID)
        {
            var result = _patternRepository.GetPatternByID(patternID);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Pattern with ID ${patternID} not found.");
        }

        [HttpPost]
        public IActionResult AddPattern(Pattern patternObj)
        {
            var result = _patternRepository.AddPattern(patternObj);
            if (!result.Equals(Guid.Empty))
            {
                return Ok(result);
            }
            else return BadRequest("Pattern not added");
        }

        [HttpPut("{patternID}")]
        public IActionResult UpdatePattern(Guid patternID, Pattern patternObj)
        {
            var result = _patternRepository.UpdatePattern(patternID, patternObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Pattern with ID ${patternID} not updated.");
        }

        [HttpDelete("{patternID}")]
        public IActionResult DeletePattern(Guid patternID)
        {
            var result = _patternRepository.DeletePattern(patternID);
            if (!result.Equals(Guid.Empty))
            {
                return Ok($"Pattern with ID ${patternID} was deleted.");
            }
            else return BadRequest($"Pattern with ID ${patternID} not found or not deleted.");
        }
    }
}
