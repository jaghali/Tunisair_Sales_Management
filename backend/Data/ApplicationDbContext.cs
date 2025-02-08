using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Models;

namespace TunisairSalesManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<PN> PN { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }  
    }
}
