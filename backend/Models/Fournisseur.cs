using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("Fournisseurs")]
    public class Fournisseur
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nom { get; set; }

        public string Adresse { get; set; }

        public string Telephone { get; set; }

        // Relation avec les articles
        public ICollection<Articles> Articles { get; set; } = new List<Articles>();
    }
}
