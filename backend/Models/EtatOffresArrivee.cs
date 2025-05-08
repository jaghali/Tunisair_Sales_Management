using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TunisairSalesManagement.Models
{
    public class EtatOffresArrivee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public string Code { get; set; }

        public string Description { get; set; }
        public int QuantiteDotation { get; set; }
        public int TotEm { get; set; }
        public int QuantiteOfferte { get; set; }
        public int Restant { get; set; }

        public int EnteteVenteID { get; set; }

        [ForeignKey("EnteteVenteID")]
        public EnteteVente? EnteteVente { get; set; }
    }
}
