using Microsoft.EntityFrameworkCore;

namespace ExercitiuLaborator12.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

        public DbSet<Gym> Gyms { get; set; }
        public DbSet<Membership> Memberships { get; set; }
    }
}
