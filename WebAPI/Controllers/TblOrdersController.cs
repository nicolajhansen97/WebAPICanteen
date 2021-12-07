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
    [Route("api/TblOrders")]
    [ApiController]
    public class TblOrdersController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblOrdersController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblOrder>>> GetTblOrders()
        {
            return await _context.TblOrders.ToListAsync();
        }

        // GET: api/TblOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblOrder>> GetTblOrder(int id)
        {
            var tblOrder = await _context.TblOrders.FindAsync(id);

            if (tblOrder == null)
            {
                return NotFound();
            }

            return tblOrder;
        }

        // PUT: api/TblOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblOrder(int id, TblOrder tblOrder)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                if (id != tblOrder.FldOrderId)
                {
                    return BadRequest();
                }

                _context.Entry(tblOrder).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TblOrderExists(id))
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

        // POST: api/TblOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblOrder>> PostTblOrder(TblOrder tblOrder)
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ussr", out value);

            if (value.Equals("user"))
            {
                _context.TblOrders.Add(tblOrder);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTblOrder", new { id = tblOrder.FldOrderId }, tblOrder);
            }
            else
            {
                return CreatedAtAction("Access denied", null);
            }
            
        }

        // DELETE: api/TblOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblOrder(int id)
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblOrder = await _context.TblOrders.FindAsync(id);
                if (tblOrder == null)
                {
                    return NotFound();
                }

                _context.TblOrders.Remove(tblOrder);
                await _context.SaveChangesAsync();
            }
            else
            {
                return null;
            }
           

            return NoContent();
        }

        private bool TblOrderExists(int id)
        {
            return _context.TblOrders.Any(e => e.FldOrderId == id);
        }
    }
}
