using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace WebAPI.Models
{
    public partial class canteenSystemContext : DbContext
    {
        public canteenSystemContext()
        {
        }

        public canteenSystemContext(DbContextOptions<canteenSystemContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TblCategory> TblCategories { get; set; }
        public virtual DbSet<TblEmployee> TblEmployees { get; set; }
        public virtual DbSet<TblFavoriteItem> TblFavoriteItems { get; set; }
        public virtual DbSet<TblItemInfo> TblItemInfos { get; set; }
        public virtual DbSet<TblLunch> TblLunches { get; set; }
        public virtual DbSet<TblLunchBooking> TblLunchBookings { get; set; }
        public virtual DbSet<TblOrder> TblOrders { get; set; }
        public virtual DbSet<TblOrderLine> TblOrderLines { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=LAPTOP-JOS7OFN3\\MSSQLSERVER01;Database=canteenSystem;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Danish_Norwegian_CI_AS");

            modelBuilder.Entity<TblCategory>(entity =>
            {
                entity.HasKey(e => e.FldCategoryTypeId)
                    .HasName("PK__tblCateg__FF13D5E86CBD9314");

                entity.ToTable("tblCategory");

                entity.Property(e => e.FldCategoryTypeId)
                    .ValueGeneratedNever()
                    .HasColumnName("fldCategoryTypeID");

                entity.Property(e => e.FldType)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("fldType");
            });

            modelBuilder.Entity<TblEmployee>(entity =>
            {
                entity.HasKey(e => e.FldEmployeeId)
                    .HasName("PK__tblEmplo__548BB22F4A144A5E");

                entity.ToTable("tblEmployee");

                entity.Property(e => e.FldEmployeeId).HasColumnName("fldEmployeeID");

                entity.Property(e => e.FldBirhdate)
                    .HasColumnType("date")
                    .HasColumnName("fldBirhdate");

                entity.Property(e => e.FldEmail)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("fldEmail");

                entity.Property(e => e.FldName)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("fldName");

                entity.Property(e => e.FldPhone)
                    .HasMaxLength(16)
                    .IsUnicode(false)
                    .HasColumnName("fldPhone");
            });

            modelBuilder.Entity<TblFavoriteItem>(entity =>
            {
                entity.HasKey(e => e.FldFavoriteItemNumber)
                    .HasName("PK__tblFavor__A4A6355009502067");

                entity.ToTable("tblFavoriteItems");

                entity.Property(e => e.FldFavoriteItemNumber).HasColumnName("fldFavoriteItemNumber");

                entity.Property(e => e.FldEmployeeId).HasColumnName("fldEmployeeID");

                entity.Property(e => e.FldItemInfoId).HasColumnName("fldItemInfoID");

                entity.HasOne(d => d.FldEmployee)
                    .WithMany(p => p.TblFavoriteItems)
                    .HasForeignKey(d => d.FldEmployeeId)
                    .HasConstraintName("FK__tblFavori__fldEm__33D4B598");

                entity.HasOne(d => d.FldItemInfo)
                    .WithMany(p => p.TblFavoriteItems)
                    .HasForeignKey(d => d.FldItemInfoId)
                    .HasConstraintName("FK__tblFavori__fldIt__34C8D9D1");
            });

            modelBuilder.Entity<TblItemInfo>(entity =>
            {
                entity.HasKey(e => e.FldItemInfoId)
                    .HasName("PK__tblItemI__3D7D4E50A3FBD228");

                entity.ToTable("tblItemInfo");

                entity.Property(e => e.FldItemInfoId).HasColumnName("fldItemInfoID");

                entity.Property(e => e.FldCategoryTypeId).HasColumnName("fldCategoryTypeID");

                entity.Property(e => e.FldImage)
                    .HasMaxLength(300)
                    .IsUnicode(false)
                    .HasColumnName("fldImage");

                entity.Property(e => e.FldItemDescription)
                    .HasMaxLength(300)
                    .IsUnicode(false)
                    .HasColumnName("fldItemDescription");

                entity.Property(e => e.FldItemname)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("fldItemname");

                entity.Property(e => e.FldPrice).HasColumnName("fldPrice");

                entity.HasOne(d => d.FldCategoryType)
                    .WithMany(p => p.TblItemInfos)
                    .HasForeignKey(d => d.FldCategoryTypeId)
                    .HasConstraintName("FK__tblItemIn__fldCa__30F848ED");
            });

            modelBuilder.Entity<TblLunch>(entity =>
            {
                entity.HasKey(e => e.FldDate)
                    .HasName("PK__tblLunch__4A187B7CD049A147");

                entity.ToTable("tblLunch");

                entity.Property(e => e.FldDate)
                    .HasColumnType("date")
                    .HasColumnName("fldDate");

                entity.Property(e => e.FldMenu)
                    .HasMaxLength(80)
                    .IsUnicode(false)
                    .HasColumnName("fldMenu");
            });

            modelBuilder.Entity<TblLunchBooking>(entity =>
            {
                entity.HasKey(e => e.FldLunchBookingId)
                    .HasName("PK__tblLunch__5610B7BA7BFA6607");

                entity.ToTable("tblLunchBooking");

                entity.Property(e => e.FldLunchBookingId).HasColumnName("fldLunchBookingID");

                entity.Property(e => e.FldDate)
                    .HasColumnType("date")
                    .HasColumnName("fldDate");

                entity.Property(e => e.FldEmployeeId).HasColumnName("fldEmployeeID");

                entity.HasOne(d => d.FldDateNavigation)
                    .WithMany(p => p.TblLunchBookings)
                    .HasForeignKey(d => d.FldDate)
                    .HasConstraintName("FK__tblLunchB__fldDa__29572725");

                entity.HasOne(d => d.FldEmployee)
                    .WithMany(p => p.TblLunchBookings)
                    .HasForeignKey(d => d.FldEmployeeId)
                    .HasConstraintName("FK__tblLunchB__fldEm__286302EC");
            });

            modelBuilder.Entity<TblOrder>(entity =>
            {
                entity.HasKey(e => e.FldOrderId)
                    .HasName("PK__tblOrder__89F5B010BDC7A264");

                entity.ToTable("tblOrders");

                entity.Property(e => e.FldOrderId).HasColumnName("fldOrderID");

                entity.Property(e => e.FldEmployeeId).HasColumnName("fldEmployeeID");

                entity.Property(e => e.FldTimeStamp)
                    .HasColumnType("datetime")
                    .HasColumnName("fldTimeStamp");

                entity.HasOne(d => d.FldEmployee)
                    .WithMany(p => p.TblOrders)
                    .HasForeignKey(d => d.FldEmployeeId)
                    .HasConstraintName("FK__tblOrders__fldEm__2C3393D0");
            });

            modelBuilder.Entity<TblOrderLine>(entity =>
            {
                entity.HasKey(e => e.FldOrderLineId)
                    .HasName("PK__tblOrder__7C7F447744101A73");

                entity.ToTable("tblOrderLines");

                entity.Property(e => e.FldOrderLineId).HasColumnName("fldOrderLineID");

                entity.Property(e => e.FldItemInfoId).HasColumnName("fldItemInfoID");

                entity.Property(e => e.FldOrderId).HasColumnName("fldOrderID");

                entity.Property(e => e.FldPrice).HasColumnName("fldPrice");

                entity.HasOne(d => d.FldItemInfo)
                    .WithMany(p => p.TblOrderLines)
                    .HasForeignKey(d => d.FldItemInfoId)
                    .HasConstraintName("FK__tblOrderL__fldIt__38996AB5");

                entity.HasOne(d => d.FldOrder)
                    .WithMany(p => p.TblOrderLines)
                    .HasForeignKey(d => d.FldOrderId)
                    .HasConstraintName("FK__tblOrderL__fldOr__37A5467C");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
