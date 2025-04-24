using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    public class EtatVentesArrivee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; } // New primary key

        public string Code { get; set; }
        public string Description { get; set; }
        public int QuantiteDotation { get; set; }
        public decimal TotEm { get; set; }
        public int QuantiteVendue { get; set; }
        public decimal PrixUnitaireHT { get; set; }
        public decimal Valeur { get; set; }
        public int Restant { get; set; }

        // Foreign key to EnteteVente
        public int EnteteVenteID { get; set; }

        [ForeignKey("EnteteVenteID")]
        public EnteteVente? EnteteVente { get; set; }

        public bool IsRestantValid()
        {
            return Restant <= QuantiteDotation;
        }
    }
}
