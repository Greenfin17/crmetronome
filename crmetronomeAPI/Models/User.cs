using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace crmetronomeAPI.Models
{
    public class User
    {
            public Guid Id { get; set; }
            public string FirebaseUID { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
            public string ProfilePicUrl { get; set; }
            public bool Shared { get; set; }
            public Guid Role { get; set; }

     }

}
