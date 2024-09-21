using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
	public class Composer {
		public Guid ID { get; set; }
		public Guid AddedBy { get; set; }
		public bool? Shared { get; set; }
		public string First { get; set; }
		public string Last { get; set; }
		public string Middle { get; set; }
		public string Birth { get; set; }
		public string Death { get; set; }
	}

}
