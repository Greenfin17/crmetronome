using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class Pattern
    {
        public Guid ID { get; set; }
        public Guid CreatedBy { get; set; }
        public bool Shared { get; set; }
        public string BeatPattern { get; set; }
    }
}
