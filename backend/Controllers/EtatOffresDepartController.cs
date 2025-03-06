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
    public class EtatOffresDepartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EtatOffresDepartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EtatOffresDepart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatOffresDepart>>> GetEtatOffresDepart()
        {
            var etatOffresDepart = await _context.EtatOffresDepart.ToListAsync();
            return Ok(etatOffresDepart);
        }

        // POST: api/EtatOffresDepart
        [HttpPost]
        public async Task<ActionResult<EtatOffresDepart>> PostEtatOffresDepart(EtatOffresDepart etatOffresDepart)
        {
            _context.EtatOffresDepart.Add(etatOffresDepart);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtatOffresDepart), new { code = etatOffresDepart.Code }, etatOffresDepart);
        }

        // PUT: api/EtatOffresDepart/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutEtatOffresDepart(string code, EtatOffresDepart etatOffresDepart)
        {
            if (code != etatOffresDepart.Code)
            {
                return BadRequest();
            }

            _context.Entry(etatOffresDepart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatOffresDepartExists(code))
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

        // DELETE: api/EtatOffresDepart/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteEtatOffresDepart(string code)
        {
            var etatOffresDepart = await _context.EtatOffresDepart.FindAsync(code);
            if (etatOffresDepart == null)
            {
                return NotFound();
            }

            _context.EtatOffresDepart.Remove(etatOffresDepart);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtatOffresDepartExists(string code)
        {
            return _context.EtatOffresDepart.Any(e => e.Code == code);
        }
    }
}
