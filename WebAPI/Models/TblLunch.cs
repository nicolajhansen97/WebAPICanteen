using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblLunch
    {
        public TblLunch()
        {
            TblLunchBookings = new HashSet<TblLunchBooking>();
        }

        public DateTime FldDate { get; set; }
        public string FldMenu { get; set; }

        public virtual ICollection<TblLunchBooking> TblLunchBookings { get; set; }
    }
}
