using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Models;
using TunisairSalesManagement.Data;  // Assurez-vous d'ajouter cette directive pour ApplicationDbContext

namespace TunisairSalesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FournisseursController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FournisseursController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Fournisseurs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fournisseur>>> GetFournisseurs()
        {
           var fournisseurs = await _context.Fournisseurs.ToListAsync();
            return Ok(fournisseurs); 
        }

        // POST: api/Fournisseurs
        [HttpPost]
        public async Task<ActionResult<Fournisseur>> PostArticles(Fournisseur fournisseurs)
        {
            _context.Fournisseurs.Add(fournisseurs);
            await _context.SaveChangesAsync();

            // Return the newly created article with a 201 Created status
            return CreatedAtAction(nameof(GetFournisseurs), new { id = fournisseurs.Id }, fournisseurs);
        }

        // PUT: api/Fournisseur/id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFournisseur(int id, Fournisseur fournisseurs)
        {
            if (id != fournisseurs.Id)
            {
                return BadRequest();
            }

            _context.Entry(fournisseurs).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FournisseurExists(id)) 
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent(); // Return No Content if successful
        }
            // DELETE: api/Fournisseur/5
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteFournisseurs(int Id)
        {
            var fournisseurs = await _context.Fournisseurs.FindAsync(Id); // Find the article by Code
            if (fournisseurs == null)
            {
                return NotFound();
            }

            _context.Fournisseurs.Remove(fournisseurs);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        private bool FournisseurExists(int Id)
        {
            return _context.Fournisseurs.Any(e => e.Id == Id);
        }
        }
    }

