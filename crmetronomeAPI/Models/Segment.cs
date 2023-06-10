using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Segment
	{
		public Guid ID { get; set; }
		public Guid Excerpt { get; set; }
		public int Position { get; set; }
		public Guid Pattern { get; set; }
		public int Unit { get; set; }
		public int Tempo { get; set; }
		public int Repetitions { get; set; }

    }
}
