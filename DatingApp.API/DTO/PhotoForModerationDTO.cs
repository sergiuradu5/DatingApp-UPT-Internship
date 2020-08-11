using System;

namespace DatingApp.API.DTO
{
    public class PhotoForModerationDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string UserName {get; set;} 
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public bool IsApproved { get; set; }
    }
}