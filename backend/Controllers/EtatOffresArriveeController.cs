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
            var etatOffresArrivee = await _context.EtatOffresArrivee
            .AsNoTracking()
            .OrderBy(e => e.EnteteVenteID)
            .ThenBy(e => e.Code)
            .ToListAsync();
            return Ok(etatOffresArrivee);
        }

         // 🔹 GET: api/EtatOffresArrivee/{code} (Récupérer un article par code)
        [HttpGet("{code}")]
        public async Task<ActionResult<EtatOffresArrivee>> GetEtatOffresArriveeByMatricule(string code)
        {
            var article = await _context.EtatOffresArrivee.FindAsync(code);

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }


        // POST: api/EtatOffresArrivee
        [HttpPost]
        public async Task<ActionResult<EtatOffresArrivee>> PostEtatOffresArrivee(EtatOffresArrivee etatOffresArrivee)
        {
            // Vérifie seulement s'il est déjà dans CET état spécifique
            var existingInSameVente = await _context.EtatOffresArrivee
           .AnyAsync(e => e.Code == etatOffresArrivee.Code && 
                     e.EnteteVenteID == etatOffresArrivee.EnteteVenteID);

            if (existingInSameVente)
            {
                return BadRequest("Cet article a déjà été ajouté à cet état de vente.");
            }
            _context.EtatOffresArrivee.Add(etatOffresArrivee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtatOffresArriveeByMatricule), new { code = etatOffresArrivee.Code }, etatOffresArrivee);
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

       // DELETE: api/EtatOffresArrivee/{id}/{enteteVenteID}
[HttpDelete("{code}/{enteteVenteID}")]
public async Task<IActionResult> DeleteEtatOffresArrivee(string code, int enteteVenteID)
{
    var article = await _context.EtatOffresArrivee
        .FirstOrDefaultAsync(a => a.Code == code && a.EnteteVenteID == enteteVenteID);

    if (article == null)
    {
        return NotFound("Article non trouvé dans cet état de vente.");
    }

    _context.EtatOffresArrivee.Remove(article);
    await _context.SaveChangesAsync();

    return NoContent();
}



        private bool EtatOffresArriveeExists(string code)
        {
            return _context.EtatOffresArrivee.Any(e => e.Code == code);
        }
    }
}
