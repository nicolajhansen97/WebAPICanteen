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
    [Route("api/TblItemInfoes")]
    [ApiController]
    public class TblItemInfoesController : ControllerBase
    {
        private readonly canteenSystemContext _context;

        public TblItemInfoesController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblItemInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblItemInfo>>> GetTblItemInfos()
        {
            // Custom GUARD
           Microsoft.Extensions.Primitives.StringValues value = "";
           Request.Headers.TryGetValue("ussr", out value);

           if (value.Equals("user"))
           { 
                return await _context.TblItemInfos.ToListAsync();
           }
           else
           {
                return null;
           }



        }

        // GET: api/TblItemInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblItemInfo>> GetTblItemInfo(int id)
        {
            var tblItemInfo = await _context.TblItemInfos.FindAsync(id);

            if (tblItemInfo == null)
            {
                return NotFound();
            }

            return tblItemInfo;
        }

        // PUT: api/TblItemInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblItemInfo(int id, TblItemInfo tblItemInfo)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                if (id != tblItemInfo.FldItemInfoId)
                {
                    return BadRequest();
                }

                _context.Entry(tblItemInfo).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TblItemInfoExists(id))
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

        // POST: api/TblItemInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblItemInfo>> PostTblItemInfo(TblItemInfo tblItemInfo)
        {


            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                _context.TblItemInfos.Add(tblItemInfo);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTblItemInfo", new { id = tblItemInfo.FldItemInfoId }, tblItemInfo);
            }
            else
            {
                return CreatedAtAction("Access denied!", null);
            }
            
        }

        // DELETE: api/TblItemInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblItemInfo(int id)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblItemInfo = await _context.TblItemInfos.FindAsync(id);
                if (tblItemInfo == null)
                {
                    return NotFound();
                }

                _context.TblItemInfos.Remove(tblItemInfo);
                await _context.SaveChangesAsync();

            }
            else
            {
                return null;
            }


            return NoContent();


        }

        private bool TblItemInfoExists(int id)
        {
            return _context.TblItemInfos.Any(e => e.FldItemInfoId == id);
        }
    }
}
