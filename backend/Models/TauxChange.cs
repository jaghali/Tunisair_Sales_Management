using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    public class TauxChange
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valeur must be greater than 0.")]
        public decimal Valeur { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [ForeignKey("Devise")]
        public int DeviseId { get; set; }

        public Devise Devise { get; set; }
    }
}
