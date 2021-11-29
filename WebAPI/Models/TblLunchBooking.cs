using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblLunchBooking
    {
        public int FldLunchBookingId { get; set; }
        public int? FldEmployeeId { get; set; }
        public DateTime? FldDate { get; set; }

        public virtual TblLunch FldDateNavigation { get; set; }
        public virtual TblEmployee FldEmployee { get; set; }
    }
}
