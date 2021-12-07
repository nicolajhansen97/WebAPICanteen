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
    [Route("api/TblEmployees")]
    [ApiController]
    public class TblEmployeesController : ControllerBase
    {

        private readonly canteenSystemContext _context;

        public TblEmployeesController(canteenSystemContext context)
        {
            _context = context;
        }

        // GET: api/TblEmployees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblEmployee>>> GetTblEmployees()
        {
            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ussr", out value);

            if (value.Equals("user"))
            {
                return await _context.TblEmployees.ToListAsync();
            }
            else
            {
                return null;
            }

            
        }

        // GET: api/TblEmployees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblEmployee>> GetTblEmployee(int id)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblEmployee = await _context.TblEmployees.FindAsync(id);

                if (tblEmployee == null)
                {
                    return NotFound();
                }

                return tblEmployee;
            }
            else
            {
                return null;
            }
            
        }

        // PUT: api/TblEmployees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblEmployee(int id, TblEmployee tblEmployee)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                if (id != tblEmployee.FldEmployeeId)
                {
                    return BadRequest();
                }

                _context.Entry(tblEmployee).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TblEmployeeExists(id))
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

        // POST: api/TblEmployees
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblEmployee>> PostTblEmployee(TblEmployee tblEmployee)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                _context.TblEmployees.Add(tblEmployee);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTblEmployee", new { id = tblEmployee.FldEmployeeId }, tblEmployee);
            }
            else
            {
                return CreatedAtAction("Access denied!", null);
            }
            
        }

        // DELETE: api/TblEmployees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblEmployee(int id)
        {

            // Custom GUARD - Created by Niels & Nicolaj
            Microsoft.Extensions.Primitives.StringValues value = "";
            Request.Headers.TryGetValue("ccp", out value);

            if (value.Equals("admin"))
            {
                var tblEmployee = await _context.TblEmployees.FindAsync(id);
                if (tblEmployee == null)
                {
                    return NotFound();
                }

                _context.TblEmployees.Remove(tblEmployee);
                await _context.SaveChangesAsync();
            }
            else
            {
                return null;
            }
          

            return NoContent();
        }

        private bool TblEmployeeExists(int id)
        {
            return _context.TblEmployees.Any(e => e.FldEmployeeId == id);
        }
    }
}
