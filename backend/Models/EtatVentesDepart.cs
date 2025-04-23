using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    public class EtatVentesDepart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; } // Nouvelle clé primaire auto-incrémentée

        public string Code { get; set; }
        public string Description { get; set; }
        public int QtDotation { get; set; }
        public int QtCompJ { get; set; }
        public int TotEm { get; set; }
        public int QuantiteCasse { get; set; }
        public int QuantiteOffre { get; set; }
        public int QuantiteVente { get; set; }
        public decimal PrixUnitaireHT { get; set; }
        public decimal Valeur { get; set; }
        public int Restant { get; set; }
        public DateTime? DateVente { get; set; }

        // Foreign key property
        public int EnteteVenteID { get; set; }

        // Navigation property
        [ForeignKey("EnteteVenteID")]
        public EnteteVente? EnteteVente { get; set; }
    }
}
