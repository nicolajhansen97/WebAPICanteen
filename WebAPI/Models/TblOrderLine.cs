using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblOrderLine
    {
        public int FldOrderLineId { get; set; }
        public int? FldOrderId { get; set; }
        public int? FldItemInfoId { get; set; }
        public double? FldPrice { get; set; }

        public virtual TblItemInfo FldItemInfo { get; set; }
        public virtual TblOrder FldOrder { get; set; }
    }
}
