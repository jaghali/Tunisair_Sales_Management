using System.ComponentModel.DataAnnotations;

namespace TunisairSalesManagement.Models
{
    public class Utilisateur
    {
        [Key]
        public string Matricule { get; set; } 

        [Required]
        public string Nom { get; set; }

        [Required]
        public string Prenom { get; set; }

        [Required]
        public string Pwd { get; set; } 

        [Required]
        public string Role { get; set; } 
    }
}
