using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("EnteteOffre")]
    public class EnteteOffre
    {

        public string PNC { get; set; }

        [Key]
        public string MATRICULE { get; set; }
        
        public string? DONNEES { get; set; }
        public string? DESTINATION { get; set; }
    }
}
