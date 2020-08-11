using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.DTO;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(UsersParams userParams);
        Task<User> GetOwnUser(int id);
        Task<User> GetOtherUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<PagedList<PhotoForModerationDTO>> GetPhotosForModeration(PhotosForModerationParams messageParams);
        Task<Photo> GetMainPhotoForUser(int userId);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId); /*Conversation between two users*/
    }
}