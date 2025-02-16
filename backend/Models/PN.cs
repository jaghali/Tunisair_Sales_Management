using System.ComponentModel.DataAnnotations;

namespace TunisairSalesManagement.Models
{
    public class PN
    {
        [Key]
        public string MATRICULE { get; set; } 

        [Required]
        public string Nom { get; set; }

        [Required]
        public string Prenom { get; set; }

        public string BASE { get; set; }
        public string COLLEGE { get; set; }
        public string SECTEUR { get; set; }

        [Required]
        public string Password { get; set; } 


    }
}
