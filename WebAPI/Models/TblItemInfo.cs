using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblItemInfo
    {
        public TblItemInfo()
        {
            TblFavoriteItems = new HashSet<TblFavoriteItem>();
            TblOrderLines = new HashSet<TblOrderLine>();
        }

        public int FldItemInfoId { get; set; }
        public int? FldCategoryTypeId { get; set; }
        public string FldItemname { get; set; }
        public string FldItemDescription { get; set; }
        public double? FldPrice { get; set; }
        public string FldImage { get; set; }

        public virtual TblCategory FldCategoryType { get; set; }
        public virtual ICollection<TblFavoriteItem> TblFavoriteItems { get; set; }
        public virtual ICollection<TblOrderLine> TblOrderLines { get; set; }
    }
}
