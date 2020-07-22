namespace DatingApp.API.Models
{
    public class Like
    {
        /*There is no Many to Many relationship in this API
        There are only 2 One to Many relationships*/
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public User Liker { get; set; } /*One Liker can have many Likees*/
        public User Likee { get; set; } /*One Likee can have many Likers*/
    }
}