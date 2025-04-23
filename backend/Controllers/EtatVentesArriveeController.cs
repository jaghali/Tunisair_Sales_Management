using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtatVentesArriveeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EtatVentesArriveeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EtatVentesArrivee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatVentesArrivee>>> GetEtatVentesArrivee()
        {
            var etatVentesArrivee = await _context.EtatVentesArrivee.ToListAsync();
            return Ok(etatVentesArrivee);
        }

        // POST: api/EtatVentesArrivee
        [HttpPost]
        public async Task<ActionResult<EtatVentesArrivee>> PostEtatVentesArrivee(EtatVentesArrivee etatVentesArrivee)
        {
            _context.EtatVentesArrivee.Add(etatVentesArrivee);
            await _context.SaveChangesAsync();

            // Return the created entity with the new ID.
            return CreatedAtAction(nameof(GetEtatVentesArrivee), new { id = etatVentesArrivee.ID }, etatVentesArrivee);
        }

        // PUT: api/EtatVentesArrivee/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtatVentesArrivee(int id, EtatVentesArrivee etatVentesArrivee)
        {
            if (id != etatVentesArrivee.ID)
            {
                return BadRequest();
            }

            _context.Entry(etatVentesArrivee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatVentesArriveeExists(id))
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

        // DELETE: api/EtatVentesArrivee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtatVentesArrivee(int id)
        {
            var etatVentesArrivee = await _context.EtatVentesArrivee.FindAsync(id);
            if (etatVentesArrivee == null)
            {
                return NotFound();
            }

            _context.EtatVentesArrivee.Remove(etatVentesArrivee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtatVentesArriveeExists(int id)
        {
            return _context.EtatVentesArrivee.Any(e => e.ID == id);
        }
    }
}
