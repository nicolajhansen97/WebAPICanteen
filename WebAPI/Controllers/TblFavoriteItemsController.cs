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
    [Route("api/TblFavoriteItems")]
    [ApiController]
    public class TblFavoriteItemsController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblFavoriteItemsController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblFavoriteItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblFavoriteItem>>> GetTblFavoriteItems()
        {
            return await _context.TblFavoriteItems.ToListAsync();
        }

        // GET: api/TblFavoriteItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblFavoriteItem>> GetTblFavoriteItem(int id)
        {
            var tblFavoriteItem = await _context.TblFavoriteItems.FindAsync(id);

            if (tblFavoriteItem == null)
            {
                return NotFound();
            }

            return tblFavoriteItem;
        }

        // PUT: api/TblFavoriteItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblFavoriteItem(int id, TblFavoriteItem tblFavoriteItem)
        {
            if (id != tblFavoriteItem.FldFavoriteItemNumber)
            {
                return BadRequest();
            }

            _context.Entry(tblFavoriteItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblFavoriteItemExists(id))
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

        // POST: api/TblFavoriteItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblFavoriteItem>> PostTblFavoriteItem(TblFavoriteItem tblFavoriteItem)
        {
            _context.TblFavoriteItems.Add(tblFavoriteItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTblFavoriteItem", new { id = tblFavoriteItem.FldFavoriteItemNumber }, tblFavoriteItem);
        }

        // DELETE: api/TblFavoriteItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblFavoriteItem(int id)
        {
            var tblFavoriteItem = await _context.TblFavoriteItems.FindAsync(id);
            if (tblFavoriteItem == null)
            {
                return NotFound();
            }

            _context.TblFavoriteItems.Remove(tblFavoriteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblFavoriteItemExists(int id)
        {
            return _context.TblFavoriteItems.Any(e => e.FldFavoriteItemNumber == id);
        }
    }
}
