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
            var etatVentesArrivee = await _context.EtatVentesArrivee
            .AsNoTracking()
            .OrderBy(e => e.EnteteVenteID)
            .ThenBy(e => e.Code)
            .ToListAsync();
            return Ok(etatVentesArrivee);
        }

        // POST: api/EtatVentesArrivee
        [HttpPost]
        public async Task<ActionResult<EtatVentesArrivee>> PostEtatVentesArrivee(EtatVentesArrivee item)
        {
           // Vérifie si le produit est déjà présent dans CET état de vente (même code + même enteteVenteID)
    var alreadyExists = await _context.EtatVentesArrivee
        .AnyAsync(e => e.Code == item.Code && e.EnteteVenteID == item.EnteteVenteID);

    if (alreadyExists)
    {
        return BadRequest("Ce produit est déjà ajouté à cet état de vente.");
    }

    _context.EtatVentesArrivee.Add(item);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetEtatVentesArriveeByCode), new { code = item.Code }, item);        }

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

                // GET: api/EtatVentesArrivee/code/XYZ123
[HttpGet("code/{code}")]
public async Task<ActionResult<EtatVentesArrivee>> GetEtatVentesArriveeByCode(string code)
{
    var item = await _context.EtatVentesArrivee.FirstOrDefaultAsync(e => e.Code == code);

    if (item == null)
    {
        return NotFound();
    }

    return Ok(item);
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
