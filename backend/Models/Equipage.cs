using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Equipage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    public int NUMFL { get; set; }
    public int MAT { get; set; }
    public string CLE { get; set; }
    public string FONCTION { get; set; }
    public string PILOTEENVOL { get; set; }




}
