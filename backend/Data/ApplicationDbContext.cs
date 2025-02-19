using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Models;

namespace TunisairSalesManagement.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<EtatVentesArrivee> EtatVentesArrivee { get; set; }
        public DbSet<EtatVentesDepart> EtatVentesDepart { get; set; }
        public DbSet<EtatOffresArrivee> EtatOffresArrivee { get; set; }
        public DbSet<EtatOffresDepart> EtatOffresDepart { get; set; }

        public DbSet<PN> PN { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }  

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Définir les clés primaires
            modelBuilder.Entity<EtatOffresDepart>()
                .HasKey(e => e.Code);  

            modelBuilder.Entity<EtatVentesArrivee>()
                .HasKey(e => e.Code);  

            modelBuilder.Entity<EtatOffresArrivee>()
                .HasKey(e => e.Code); 
                 
            modelBuilder.Entity<EtatVentesDepart>()
                .HasKey(e => e.Code);
        }
    }
}
