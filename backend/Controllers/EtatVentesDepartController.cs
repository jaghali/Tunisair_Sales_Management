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
            var etatVentesDepart = await _context.EtatVentesDepart
            .AsNoTracking()
            .OrderBy(e => e.EnteteVenteID)
            .ThenBy(e => e.Code)
            .ToListAsync();
            return Ok(etatVentesDepart);
        }

        // POST: api/EtatVentesDepart
        [HttpPost]
public async Task<ActionResult<EtatVentesDepart>> PostEtatVentesDepart(EtatVentesDepart item)
{
    // Vérifie si le produit est déjà présent dans CET état de vente (même code + même enteteVenteID)
    var alreadyExists = await _context.EtatVentesDepart
        .AnyAsync(e => e.Code == item.Code && e.EnteteVenteID == item.EnteteVenteID);

    if (alreadyExists)
    {
        return BadRequest("Ce produit est déjà ajouté à cet état de vente.");
    }

    _context.EtatVentesDepart.Add(item);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetEtatVentesDepartByCode), new { code = item.Code }, item);
}
        

        // GET: api/EtatVentesDepart/GroupByMonth
[HttpGet("GroupByMonth")]
public async Task<ActionResult> GetVentesGroupéesParMois()
{
    var grouped = await _context.EtatVentesDepart
        .Where(e => e.DateVente.HasValue)
        .GroupBy(e => new { e.DateVente.Value.Year, e.DateVente.Value.Month })
        .Select(g => new
        {
            Annee = g.Key.Year,
            Mois = g.Key.Month,
            TotalValeur = g.Sum(e => e.Valeur),
            TotalVente = g.Sum(e => e.QuantiteVente),
            Articles = g.ToList()
        })
        .ToListAsync();

    return Ok(grouped);
}

        // GET: api/EtatVentesDepart/code/XYZ123
[HttpGet("code/{code}")]
public async Task<ActionResult<EtatVentesDepart>> GetEtatVentesDepartByCode(string code)
{
    var item = await _context.EtatVentesDepart.FirstOrDefaultAsync(e => e.Code == code);

    if (item == null)
    {
        return NotFound();
    }

    return Ok(item);
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
        public async Task<IActionResult> DeleteEtatVentesDepart(string code)
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
