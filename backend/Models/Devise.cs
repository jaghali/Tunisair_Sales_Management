using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("Devises")]
    public class Devise
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Code { get; set; } // Exemple: "EUR", "USD"

        public string Nom { get; set; }

        public ICollection<PrixArticle> PrixArticles { get; set; } = new List<PrixArticle>();
    }

}
