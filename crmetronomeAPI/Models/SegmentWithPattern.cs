using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class SegmentWithPattern
    {
        public string BeatPattern { get; set; }
        public int Repetitions { get; set; }
        public decimal Tempo { get; set; }

    }
}
