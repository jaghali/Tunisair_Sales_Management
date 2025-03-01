using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("Articles")]
    public class Articles
    {


        [Key]
        public string Code { get; set; }
        
        public string Description { get; set; }
       
    }
}
