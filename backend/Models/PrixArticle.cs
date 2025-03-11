using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("PrixArticles")]
    public class PrixArticle
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Article")]
        public string ArticleCode { get; set; }

        public Articles? Article { get; set; }

        [ForeignKey("Devise")]
        public int DeviseId { get; set; }

        public Devise? Devise { get; set; }

        [Required]
        public DateTime DateDepart { get; set; }

        [Required]
        public DateTime DateArrivee { get; set; }

        [Required]
        public decimal Prix { get; set; }
    }
}
