using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("Articles")]
    public class Articles
    {
        [Key]
        public string Code { get; set; }
        
        public string Description { get; set; }

        // Ajout de la relation avec Fournisseur
        [ForeignKey("Fournisseur")]
        public int FournisseurId { get; set; }

        public Fournisseur? Fournisseur { get; set; } // Navigation Property

        public ICollection<PrixArticle> PrixArticles { get; set; } = new List<PrixArticle>();
    }
}
