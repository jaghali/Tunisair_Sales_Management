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

         public DbSet<ListeEquipageO> ListeEquipageO { get; set; }
        public DbSet<ListeEquipageV> ListeEquipageV { get; set; }

        public DbSet<EnteteVente> EnteteVente { get; set; }
        public DbSet<EnteteOffre> EnteteOffre { get; set; }
        public DbSet<Articles> Articles { get; set; }
        public DbSet<PrixArticle> PrixArticles { get; set; }
        public DbSet<Fournisseur> Fournisseurs { get; set; }
        public DbSet<Devise> Devises { get; set; }
        public DbSet<TauxChange> TauxChange { get; set; }
        public DbSet<DetailFL> DetailFLs { get; set; }
        public DbSet<Equipage> Equipages { get; set; }



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
            modelBuilder.Entity<ListeEquipageO>().HasKey(e => e.MATRICULE);
            modelBuilder.Entity<EnteteVente>().HasKey(e => e.ID);
            modelBuilder.Entity<EnteteOffre>().HasKey(e => e.ID);

            modelBuilder.Entity<ListeEquipageV>().HasKey(e => e.MATRICULE);
            modelBuilder.Entity<Articles>().HasKey(e => e.Code);

            modelBuilder.Entity<PrixArticle>()
            .HasOne(p => p.Article)
            .WithMany(a => a.PrixArticles)
            .HasForeignKey(p => p.ArticleCode);

        modelBuilder.Entity<PrixArticle>()
            .HasOne(p => p.Devise)
            .WithMany(d => d.PrixArticles)
            .HasForeignKey(p => p.DeviseId);

        modelBuilder.Entity<Articles>()
        .HasOne(a => a.Fournisseur)  
        .WithMany(f => f.Articles)   
        .HasForeignKey(a => a.FournisseurId);

        // Clé primaire composite pour DetailFL
modelBuilder.Entity<DetailFL>()
    .HasKey(d => new { d.NUMFL, d.NUMVOL });

// Ne pas ajouter de contrainte UNIQUE sur NUMFL dans DetailFL
modelBuilder.Entity<DetailFL>()
    .HasIndex(d => d.NUMFL)
    .IsUnique(false);


    }

    }
}
