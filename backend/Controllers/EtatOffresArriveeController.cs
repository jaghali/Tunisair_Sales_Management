using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtatOffresArriveeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EtatOffresArriveeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EtatOffresArrivee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatOffresArrivee>>> GetEtatOffresArrivee()
        {
            var etatOffresArrivee = await _context.EtatOffresArrivee.ToListAsync();
            return Ok(etatOffresArrivee); 
        }

        // POST: api/EtatOffresArrivee
        [HttpPost]
        public async Task<ActionResult<EtatOffresArrivee>> PostEtatOffresArrivee(EtatOffresArrivee etatOffresArrivee)
        {
            _context.EtatOffresArrivee.Add(etatOffresArrivee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtatOffresArrivee), new { code = etatOffresArrivee.Code }, etatOffresArrivee);
        }

        // PUT: api/EtatOffresArrivee/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutEtatOffresArrivee(string code, EtatOffresArrivee etatOffresArrivee)
        {
            if (code != etatOffresArrivee.Code)
            {
                return BadRequest();
            }

            _context.Entry(etatOffresArrivee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatOffresArriveeExists(code))
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

        // DELETE: api/EtatOffresArrivee/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteEtatOffresArrivee(string code)
        {
            var etatOffresArrivee = await _context.EtatOffresArrivee.FindAsync(code);
            if (etatOffresArrivee == null)
            {
                return NotFound();
            }

            _context.EtatOffresArrivee.Remove(etatOffresArrivee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtatOffresArriveeExists(string code)
        {
            return _context.EtatOffresArrivee.Any(e => e.Code == code);
        }
    }
}
