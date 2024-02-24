using API_Projecr.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Projecr.Data
{
    public class ApplicationDbContext :DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }

    }
}
