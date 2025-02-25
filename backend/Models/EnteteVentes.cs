using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("EnteteVente")]
    public class EnteteVente
    {

        public string PNC { get; set; }

        [Key]
        public string MATRICULE { get; set; }
        
        public string? DONNEES { get; set; }
        public string? GENERALES { get; set; }
    }
}
