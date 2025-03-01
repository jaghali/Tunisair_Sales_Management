using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("EnteteVente")]
    public class EnteteVente
    {
         [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // Auto-incrémentation
        public int ID { get; set; }

        public string AVION { get; set; }
        public string AIROPORT { get; set; }
        public DateTime DATE_EDITION { get; set; }
        public string AGENT_SAISIE { get; set; }
        public string NUMERO_ETAT { get; set; }
        public string FL01 { get; set; }
        public string FL02 { get; set; }
        public string FL03 { get; set; }
        public string CC1 { get; set; }
        public string PNC1 { get; set; }
        public string NOM1 { get; set; }
        public string NOM2 { get; set; }
        public string CC2 { get; set; }
        public string PNC2 { get; set; }
    }
}
