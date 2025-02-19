using System.ComponentModel.DataAnnotations;

namespace TunisairSalesManagement.Models
{
    public class EtatVentesDepart
    {
        [Key]
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
    }
}
