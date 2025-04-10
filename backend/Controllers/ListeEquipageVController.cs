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
    public class ListeEquipageVController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListeEquipageVController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET: api/ListeEquipageV (Récupérer tous les équipages)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListeEquipageV>>> GetListeEquipageV()
        {
            return await _context.ListeEquipageV.ToListAsync();
        }

        // 🔹 GET: api/ListeEquipageV/{matricule} (Récupérer un équipage par matricule)
        [HttpGet("{matricule}")]
        public async Task<ActionResult<ListeEquipageV>> GetListeEquipageVByMatricule(string matricule)
        {
            var equipage = await _context.ListeEquipageV.FindAsync(matricule);

            if (equipage == null)
            {
                return NotFound();
            }

            return equipage;
        }


        // 🔹 POST: api/ListeEquipageV (Ajouter un équipage)
        [HttpPost]
        public async Task<ActionResult<ListeEquipageV>> PostListeEquipageV(ListeEquipageV equipage)
        {
            _context.ListeEquipageV.Add(equipage);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetListeEquipageVByMatricule), new { matricule = equipage.MATRICULE }, equipage);  // Utilisez MATRICULE en majuscule
        }

        // 🔹 PUT: api/ListeEquipageV/{matricule} (Modifier un équipage)
        [HttpPut("{matricule}")]
        public async Task<IActionResult> PutListeEquipageV(string matricule, ListeEquipageV equipage)
        {
            if (matricule != equipage.MATRICULE)  // Utilisez MATRICULE en majuscule
            {
                return BadRequest();
            }

            _context.Entry(equipage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ListeEquipageV.Any(e => e.MATRICULE == matricule))  // Utilisez MATRICULE en majuscule
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // 🔹 DELETE: api/ListeEquipageV/{matricule} (Supprimer un équipage)
        [HttpDelete("{matricule}")]
        public async Task<IActionResult> DeleteListeEquipageV(string matricule)
        {
            var equipage = await _context.ListeEquipageV.FindAsync(matricule);
            if (equipage == null)
            {
                return NotFound();
            }

            _context.ListeEquipageV.Remove(equipage);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
