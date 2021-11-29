using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/TblLunchBookingsController")]
    [ApiController]
    public class TblLunchBookingsController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblLunchBookingsController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblLunchBookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblLunchBooking>>> GetTblLunchBookings()
        {
            return await _context.TblLunchBookings.ToListAsync();
        }

        // GET: api/TblLunchBookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblLunchBooking>> GetTblLunchBooking(int id)
        {
            var tblLunchBooking = await _context.TblLunchBookings.FindAsync(id);

            if (tblLunchBooking == null)
            {
                return NotFound();
            }

            return tblLunchBooking;
        }

        // PUT: api/TblLunchBookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblLunchBooking(int id, TblLunchBooking tblLunchBooking)
        {
            if (id != tblLunchBooking.FldLunchBookingId)
            {
                return BadRequest();
            }

            _context.Entry(tblLunchBooking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblLunchBookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TblLunchBookings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblLunchBooking>> PostTblLunchBooking(TblLunchBooking tblLunchBooking)
        {
            _context.TblLunchBookings.Add(tblLunchBooking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTblLunchBooking", new { id = tblLunchBooking.FldLunchBookingId }, tblLunchBooking);
        }

        // DELETE: api/TblLunchBookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblLunchBooking(int id)
        {
            var tblLunchBooking = await _context.TblLunchBookings.FindAsync(id);
            if (tblLunchBooking == null)
            {
                return NotFound();
            }

            _context.TblLunchBookings.Remove(tblLunchBooking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblLunchBookingExists(int id)
        {
            return _context.TblLunchBookings.Any(e => e.FldLunchBookingId == id);
        }
    }
}
