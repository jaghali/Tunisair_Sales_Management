using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("ListeEquipageO")]
    public class ListeEquipageO
    {


        [Key]
        public string MATRICULE { get; set; }
        
        public string PNC { get; set; }
        public string? DONNEES { get; set; }
        public string? DESTINATION { get; set; }
    }
}
