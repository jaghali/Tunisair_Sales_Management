using System.ComponentModel.DataAnnotations;
namespace TunisairSalesManagement.Models
{
    public class EtatOffresArrivee
    {
        [Key]
        [Required]
        public string Code { get; set; }

        public string Description { get; set; }
        public int QuantiteDotation { get; set; }
        public int TotEm { get; set; }
        public int QuantiteOfferte { get; set; }
        public int Restant { get; set; }
    }
}
