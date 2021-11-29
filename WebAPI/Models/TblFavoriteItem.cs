using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblFavoriteItem
    {
        public int FldFavoriteItemNumber { get; set; }
        public int? FldEmployeeId { get; set; }
        public int? FldItemInfoId { get; set; }

        public virtual TblEmployee FldEmployee { get; set; }
        public virtual TblItemInfo FldItemInfo { get; set; }
    }
}
