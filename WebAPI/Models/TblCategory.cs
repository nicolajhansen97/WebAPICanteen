using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.Models
{
    public partial class TblCategory
    {
        public TblCategory()
        {
            TblItemInfos = new HashSet<TblItemInfo>();
        }

        public int FldCategoryTypeId { get; set; }
        public string FldType { get; set; }

        public virtual ICollection<TblItemInfo> TblItemInfos { get; set; }
    }
}
