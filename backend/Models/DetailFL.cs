using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TunisairSalesManagement.Models
{
    [Table("DetailFL")]
    public class DetailFL
    {
        [Key, Column(Order = 0)]
        public int NUMFL { get; set; }

        [Key, Column(Order = 1)]
        public int NUMVOL { get; set; }

        public string CIE { get; set; }

        public DateTime? DATEVOL { get; set; }
        public string ESCALEDEP { get; set; }
        public string ESCALEARR { get; set; }
        public int? NUMORDRE { get; set; }

        public DateTime? DATEDEPPREV { get; set; }
        public DateTime? HEUREBBDEP { get; set; }
        public DateTime? HEUREBBARR { get; set; }
        public int? DUREEVOLBB { get; set; }

        public DateTime? HEUREABDEP { get; set; }
        public DateTime? HEUREABARR { get; set; }
        public int? DUREEVOLAB { get; set; }

        public int? CARBVOLPREC { get; set; }
        public string CARBRAVUNITE { get; set; }
        public int? CARBRAV { get; set; }
        public double? CARBCOEFCONV { get; set; }
        public int? CARBRAVKG { get; set; }
        public int? CARBJAUGEDEP { get; set; }
        public int? CARBJAUGEARR { get; set; }
        public int? CARBCONSOM { get; set; }

        public string VOLOPERATIONNEL { get; set; }
        public DateTime? DATEVOLOP { get; set; }

        public int? MAT { get; set; }

    }
}
