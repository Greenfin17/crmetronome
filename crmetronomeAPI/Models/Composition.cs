using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Composition
	{ 
		public Guid ID { get; set; }
		public string Title { get; set; }
		public string Catalog { get; set; }
		public Guid Composer { get; set; }
		public Guid AddedBy { get; set; }
		public bool Shared { get; set; }
    }
}
