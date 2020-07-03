
using System;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        /* The Following 2 lines are used in order to get a CASCADE DELETE */
        public User User { get; set; }
        public int UserId { get; set; }
    }
}