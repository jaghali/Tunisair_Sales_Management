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
             var equipages = await _context.ListeEquipageV
        .AsNoTracking()
        .OrderBy(e => e.EnteteVenteID)
        .ThenBy(e => e.MATRICULE)
        .ToListAsync();

         return Ok(equipages);
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


[HttpPost]
public async Task<ActionResult<ListeEquipageV>> PostListeEquipageV(ListeEquipageV equipage)
{
    // Vérifie seulement s'il est déjà dans CET état spécifique
    var existingInSameVente = await _context.ListeEquipageV
        .AnyAsync(e => e.MATRICULE == equipage.MATRICULE && 
                     e.EnteteVenteID == equipage.EnteteVenteID);

    if (existingInSameVente)
    {
        return BadRequest("Cet équipage a déjà été ajouté à cet état de vente.");
    }

    // Autorise l'ajout si c'est un nouvel état pour ce PNC
    _context.ListeEquipageV.Add(equipage);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetListeEquipageVByMatricule), 
        new { matricule = equipage.MATRICULE }, equipage);
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

        // 🔹 api/ListeEquipageV/{matricule}/{enteteVenteId}
        [HttpDelete("{matricule}/{enteteVenteID}")]
public async Task<IActionResult> DeleteEquipage(string matricule, int enteteVenteID)
{
    var equipage = await _context.ListeEquipageV
                                .FirstOrDefaultAsync(e => e.MATRICULE == matricule && e.EnteteVenteID == enteteVenteID);

    if (equipage == null)
    {
        return NotFound("Équipage non trouvé dans cet état de vente.");
    }

    _context.ListeEquipageV.Remove(equipage);
    await _context.SaveChangesAsync();

    return NoContent();  // Retourne un statut 204 pour la suppression réussie
}

    }
}


