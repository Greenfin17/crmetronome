using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Excerpt
    {
		public Guid ID { get; set; }
		public Guid Composition { get; set; }
		public string Movement { get; set; }
		public string Measures { get; set; }
		public Guid CreatedBy { get; set; }
		public bool Shared { get; set; }
    }
}
