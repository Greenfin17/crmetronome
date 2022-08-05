using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Segment
	{
		Guid ID { get; set; }
		Guid Excerpt { get; set; }
		int Position { get; set; }
		Guid Pattern { get; set; }
		decimal tempo { get; set; }
		int Repetitions { get; set; }

    }
}
