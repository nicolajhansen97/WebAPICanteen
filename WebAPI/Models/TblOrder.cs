using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblOrder
    {
        public TblOrder()
        {
            TblOrderLines = new HashSet<TblOrderLine>();
        }

        public int FldOrderId { get; set; }
        public int? FldEmployeeId { get; set; }
        public DateTime? FldTimeStamp { get; set; }

        public virtual TblEmployee FldEmployee { get; set; }
        public virtual ICollection<TblOrderLine> TblOrderLines { get; set; }
    }
}
