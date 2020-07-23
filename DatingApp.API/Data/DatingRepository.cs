using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data {
    public class DatingRepository : IDatingRepository {
        private readonly DataContext _context;
        private readonly DataContext context;
        public DatingRepository (DataContext context) {
            _context = context;

        }
        public void Add<T> (T entity) where T : class {
            _context.Add(entity);
        }

        public void Delete<T> (T entity) where T : class {
        _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {   /*This Method returns the Like if the like between userId & recipientId exists
                if it doesn't, then it returns null*/
            return await _context.Likes
            .FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser (int id) {
           var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
           return user;
        }
        /* This Method will be using paging -> instead of retreiving all the data at once
        data is separated / divided into pages */
        public async Task<PagedList<User>> GetUsers(UsersParams usersParams) {

            var users = _context.Users.Include(p => p.Photos)
            .OrderByDescending(u => u.LastActive ).AsQueryable();
            users = users.Where(u => u.Id != usersParams.UserId);

            users = users.Where( u => u.Gender == usersParams.Gender);

            if(usersParams.Likers)
            {
                var userLikers = await GetUserLikes(usersParams.UserId, usersParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(usersParams.Likees)
            {
                var userLikees = await GetUserLikes(usersParams.UserId, usersParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(usersParams.MinAge != 18 || usersParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-usersParams.MaxAge -1 );
                var maxDob = DateTime.Today.AddYears(-usersParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <=maxDob);
            }

            if(!string.IsNullOrEmpty(usersParams.OrderBy))
            {
                switch (usersParams.OrderBy)
                {
                    case "created":
                    users = users.OrderByDescending(u=> u.Created);
                    break;
                    default:
                    users = users.OrderByDescending(u => u.LastActive);
                    break;
                }
            }

            return await PagedList<User>.CreateAsync(users, usersParams.PageNumber, usersParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Likees)
            .FirstOrDefaultAsync(u => u.Id == id );

            if (likers)
            {
                /* Select makes the Where() return the IEnumerable collection of user ID and not the whole collection of  Users */
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else 
            {
                return user.Likees.Where(u=> u.LikerId == id).Select(i => i.LikeeId);
            }

        }

        public async Task<bool> SaveAll () {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
             return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u=> u.Sender).ThenInclude(p=>p.Photos)
            .Include(u=> u.Recipient).ThenInclude(p=> p.Photos)
            .AsQueryable(); /*When you add a Where() method, it has to be Queryable*/

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId);
                    break;
                default:
                    messages = messages.Where(u=>u.RecipientId == messageParams.UserId && u.IsRead==false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>
            .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            throw new NotImplementedException();
        }
    }
}