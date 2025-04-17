using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
public class TauxChange
{
    public int Id { get; set; }
    public decimal Valeur { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int DeviseId { get; set; }
    public Devise Devise { get; set; }
}
}
