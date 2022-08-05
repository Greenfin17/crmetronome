using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Measure
    {
        Guid ID { get; set; }
        string Pattern { get; set; }
        Guid CreatedBy { get; set; }
    }
}
