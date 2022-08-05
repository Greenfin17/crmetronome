using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Excerpt
    {
		Guid ID { get; set; }
		Guid Composition { get; set; }
		string Movement { get; set; }
		string Measures { get; set; }
		Guid CreatedBy { get; set; }
		bool shared { get; set; }
    }
}
