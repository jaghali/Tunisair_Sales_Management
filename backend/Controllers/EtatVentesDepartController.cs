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
    public class EtatVentesDepartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EtatVentesDepartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EtatVentesDepart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatVentesDepart>>> GetEtatVentesDepart()
        {
            var etatVentesDepart = await _context.EtatVentesDepart.ToListAsync();
            return Ok(etatVentesDepart);
        }

        // POST: api/EtatVentesDepart
        [HttpPost]
        public async Task<ActionResult<EtatVentesDepart>> PostEtatVentesDepart(EtatVentesDepart etatVentesDepart)
        {
            _context.EtatVentesDepart.Add(etatVentesDepart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtatVentesDepart), new { code = etatVentesDepart.Code }, etatVentesDepart);
        }

        // PUT: api/EtatVentesDepart/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutEtatVentesDepart(string code, EtatVentesDepart etatVentesDepart)
        {
            if (code != etatVentesDepart.Code)
            {
                return BadRequest();
            }

            _context.Entry(etatVentesDepart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatVentesDepartExists(code))
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

        // DELETE: api/EtatVentesDepart/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteEtatVentesDepart(int code)
        {
            var etatVentesDepart = await _context.EtatVentesDepart.FindAsync(code);
            if (etatVentesDepart == null)
            {
                return NotFound();
            }

            _context.EtatVentesDepart.Remove(etatVentesDepart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtatVentesDepartExists(string code)
        {
            return _context.EtatVentesDepart.Any(e => e.Code == code);
        }
    }
}
