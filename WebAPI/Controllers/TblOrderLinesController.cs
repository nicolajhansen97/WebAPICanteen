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
    [Route("api/TblOrderLines")]
    [ApiController]
    public class TblOrderLinesController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblOrderLinesController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblOrderLines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblOrderLine>>> GetTblOrderLines()
        {
            return await _context.TblOrderLines.ToListAsync();
        }

        // GET: api/TblOrderLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblOrderLine>> GetTblOrderLine(int id)
        {
            var tblOrderLine = await _context.TblOrderLines.FindAsync(id);

            if (tblOrderLine == null)
            {
                return NotFound();
            }

            return tblOrderLine;
        }

        // PUT: api/TblOrderLines/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblOrderLine(int id, TblOrderLine tblOrderLine)
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                if (id != tblOrderLine.FldOrderLineId)
                {
                    return BadRequest();
                }

                _context.Entry(tblOrderLine).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TblOrderLineExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            else
            {
                return null;
            }
           

            return NoContent();
        }

        // POST: api/TblOrderLines
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblOrderLine>> PostTblOrderLine(TblOrderLine tblOrderLine)
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ussr", out value);

            if (value.Equals("user"))
            {
                _context.TblOrderLines.Add(tblOrderLine);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTblOrderLine", new { id = tblOrderLine.FldOrderLineId }, tblOrderLine);
            }
            else
            {
                return CreatedAtAction("Access denied", null);
            }
            
        }

        // DELETE: api/TblOrderLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblOrderLine(int id)
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblOrderLine = await _context.TblOrderLines.FindAsync(id);
                if (tblOrderLine == null)
                {
                    return NotFound();
                }

                _context.TblOrderLines.Remove(tblOrderLine);
                await _context.SaveChangesAsync();
            }
            else
            {
                return null;
            }
           

            return NoContent();
        }

        private bool TblOrderLineExists(int id)
        {
            return _context.TblOrderLines.Any(e => e.FldOrderLineId == id);
        }
    }
}
