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
    [Route("api/TblCategories")]
    [ApiController]
    public class TblCategoriesController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblCategoriesController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblCategory>>> GetTblCategories()
        {
            return await _context.TblCategories.ToListAsync();
        }

        // GET: api/TblCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblCategory>> GetTblCategory(int id)
        {
            var tblCategory = await _context.TblCategories.FindAsync(id);

            if (tblCategory == null)
            {
                return NotFound();
            }

            return tblCategory;
        }

        // PUT: api/TblCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblCategory(int id, TblCategory tblCategory)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("db", out value);

            if (value.Equals("owner"))
            {
                if (id != tblCategory.FldCategoryTypeId)
                {
                    return BadRequest();
                }

                _context.Entry(tblCategory).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TblCategoryExists(id))
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

        // POST: api/TblCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblCategory>> PostTblCategory(TblCategory tblCategory)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                _context.TblCategories.Add(tblCategory);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    if (TblCategoryExists(tblCategory.FldCategoryTypeId))
                    {
                        return Conflict();
                    }
                    else
                    {
                        throw;
                    }
                }

                return CreatedAtAction("GetTblCategory", new { id = tblCategory.FldCategoryTypeId }, tblCategory);
            }
            else
            {
                return CreatedAtAction("Access denied!", null);
            }

           
        }

        // DELETE: api/TblCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblCategory(int id)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblCategory = await _context.TblCategories.FindAsync(id);
                if (tblCategory == null)
                {
                    return NotFound();
                }

                _context.TblCategories.Remove(tblCategory);
                await _context.SaveChangesAsync();
            }
            else
            {
                return null;
            }

            return NoContent();
        }

        private bool TblCategoryExists(int id)
        {
            return _context.TblCategories.Any(e => e.FldCategoryTypeId == id);
        }
    }
}
