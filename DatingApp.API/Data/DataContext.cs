using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace DatingApp.API.Data

{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}
        public DbSet<Value> Values {get; set;}
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos {get; set; }

        public DbSet<Like> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }

        /*Overriding a function*/
        protected override void OnModelCreating(ModelBuilder builder)
        {/*With this OnModelCreating function we create our own tables*/
        /*Likes table and Messages table is more of a Look up table with One To Many Relationship*/
            builder.Entity<Like>()
            .HasKey(k => new {k.LikerId, k.LikeeId });

            builder.Entity<Like>()
            .HasOne(u => u.Likee)
            .WithMany(u => u.Likers)
            .HasForeignKey(u => u.LikeeId )
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
            .HasOne(u => u.Liker)
            .WithMany(u => u.Likees)
            .HasForeignKey(u => u.LikerId )
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}