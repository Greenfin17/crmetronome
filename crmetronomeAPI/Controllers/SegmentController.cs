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
    [Route("api/segments")]
    // [Authorize]

    public class SegmentController : ControllerBase
    {
        private SegmentRepository _segmentRepository;
        public SegmentController(SegmentRepository segmentRepo)
        {
            _segmentRepository = segmentRepo;
        }

        [HttpGet]
        public IActionResult GetAllSegments()
        {
            var result = _segmentRepository.GetAll();
            return Ok(result);
        }

        [HttpGet("{segmentID}")]
        public IActionResult GetSegmentByID(Guid patternID)
        {
            var result = _segmentRepository.GetSegmentByID(patternID);
            if (result != null)
            {
                return Ok(result);
            }
            else return NotFound($"Pattern with ID ${patternID} not found.");
        }

        [HttpGet("excerpt/{excerptID}")]
        public IActionResult GetSegmentsByExcerptID(Guid excerptID)
        {
            var result = _segmentRepository.GetSegmentsByExcerptID(excerptID);
            return Ok(result);
        }


        [HttpPost]
        public IActionResult AddSegment(Segment segmentObj)
        {
            var result = _segmentRepository.AddSegment(segmentObj);
            if (!result.Equals(Guid.Empty))
            {
                return Ok(result);
            }
            else return BadRequest("Segment not added");
        }

        [HttpPut("{segmentID}")]
        public IActionResult UpdateSegment(Guid segmentID, Segment segmentObj)
        {
            var result = _segmentRepository.UpdateSegment(segmentID, segmentObj);
            if (result != null)
            {
                return Ok(result);
            }

            else return BadRequest($"Segment with ID ${segmentID} not updated.");
        }

        [HttpDelete("{segmentID}")]
        public IActionResult DeleteSegment(Guid segmentID)
        {
            var result = _segmentRepository.DeleteSegment(segmentID);
            if (!result.Equals(Guid.Empty))
            {
                return Ok($"Segment with ID ${segmentID} was deleted.");
            }
            else return BadRequest($"Pattern with ID ${segmentID} not found or not deleted.");
        }
    }
}

