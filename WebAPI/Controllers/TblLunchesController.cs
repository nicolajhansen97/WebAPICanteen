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
    [Route("api/TblLunches")]
    [ApiController]
    public class TblLunchesController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblLunchesController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblLunches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblLunch>>> GetTblLunches()
        {
            return await _context.TblLunches.ToListAsync();
        }

        // GET: api/TblLunches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblLunch>> GetTblLunch(DateTime id)
        {
            var tblLunch = await _context.TblLunches.FindAsync(id);

            if (tblLunch == null)
            {
                return NotFound();
            }

            return tblLunch;
        }

        // PUT: api/TblLunches/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblLunch(DateTime id, TblLunch tblLunch)
        {
            if (id != tblLunch.FldDate)
            {
                return BadRequest();
            }

            _context.Entry(tblLunch).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblLunchExists(id))
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

        // POST: api/TblLunches
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblLunch>> PostTblLunch(TblLunch tblLunch)
        {
            _context.TblLunches.Add(tblLunch);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TblLunchExists(tblLunch.FldDate))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTblLunch", new { id = tblLunch.FldDate }, tblLunch);
        }

        // DELETE: api/TblLunches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblLunch(DateTime id)
        {
            var tblLunch = await _context.TblLunches.FindAsync(id);
            if (tblLunch == null)
            {
                return NotFound();
            }

            _context.TblLunches.Remove(tblLunch);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblLunchExists(DateTime id)
        {
            return _context.TblLunches.Any(e => e.FldDate == id);
        }
    }
}
