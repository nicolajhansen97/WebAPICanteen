using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblEmployee
    {
        public TblEmployee()
        {
            TblFavoriteItems = new HashSet<TblFavoriteItem>();
            TblLunchBookings = new HashSet<TblLunchBooking>();
            TblOrders = new HashSet<TblOrder>();
        }

        public int FldEmployeeId { get; set; }
        public string FldName { get; set; }
        public string FldEmail { get; set; }
        public DateTime? FldBirhdate { get; set; }
        public string FldPhone { get; set; }
        public string FldCardNumber { get; set; }

        public virtual ICollection<TblFavoriteItem> TblFavoriteItems { get; set; }
        public virtual ICollection<TblLunchBooking> TblLunchBookings { get; set; }
        public virtual ICollection<TblOrder> TblOrders { get; set; }
    }
}
