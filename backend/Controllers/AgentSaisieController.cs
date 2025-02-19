using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Models;
using TunisairSalesManagement.Data;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentSaisieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AgentSaisieController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Récupérer toutes les entrées d'une table
        [HttpGet("{tableName}")]
        public async Task<IActionResult> GetTableData(string tableName)
        {
            if (!IsValidTable(tableName))
                return BadRequest("Table invalide.");

            switch (tableName)
            {
                case "EtatVentesArrivee":
                    var ventesArrivee = await _context.EtatVentesArrivee.ToListAsync();
                    return Ok(ventesArrivee);

                case "EtatVentesDepart":
                    var ventesDepart = await _context.EtatVentesDepart.ToListAsync();
                    return Ok(ventesDepart);

                case "EtatOffresArrivee":
                    var offresArrivee = await _context.EtatOffresArrivee.ToListAsync();
                    return Ok(offresArrivee);

                case "EtatOffresDepart":
                    var offresDepart = await _context.EtatOffresDepart.ToListAsync();
                    return Ok(offresDepart);

                default:
                    return BadRequest("Table invalide.");
            }
        }

        // 2. Ajouter une entrée
        [HttpPost("{tableName}")]
        public async Task<IActionResult> AddEntry(string tableName, [FromBody] object entryData)
        {
            if (!IsValidTable(tableName))
                return BadRequest("Table invalide.");

            switch (tableName)
            {
                case "EtatVentesArrivee":
                    var ventesArrivee = entryData as EtatVentesArrivee;
                    if (ventesArrivee == null) return BadRequest("Données invalides.");
                    await _context.EtatVentesArrivee.AddAsync(ventesArrivee);
                    break;

                case "EtatVentesDepart":
                    var ventesDepart = entryData as EtatVentesDepart;
                    if (ventesDepart == null) return BadRequest("Données invalides.");
                    await _context.EtatVentesDepart.AddAsync(ventesDepart);
                    break;

                case "EtatOffresArrivee":
                    var offresArrivee = entryData as EtatOffresArrivee;
                    if (offresArrivee == null) return BadRequest("Données invalides.");
                    await _context.EtatOffresArrivee.AddAsync(offresArrivee);
                    break;

                case "EtatOffresDepart":
                    var offresDepart = entryData as EtatOffresDepart;
                    if (offresDepart == null) return BadRequest("Données invalides.");
                    await _context.EtatOffresDepart.AddAsync(offresDepart);
                    break;

                default:
                    return BadRequest("Table invalide.");
            }

            await _context.SaveChangesAsync();
            return Ok("Ajout réussi");
        }

        // 3. Mettre à jour une entrée
        [HttpPut("{tableName}/{code}")]
        public async Task<IActionResult> UpdateEntry(string tableName, string code, [FromBody] object entryData)
        {
            if (!IsValidTable(tableName))
                return BadRequest("Table invalide.");

            switch (tableName)
            {
                case "EtatVentesArrivee":
                    var ventesArrivee = await _context.EtatVentesArrivee.FindAsync(code);
                    if (ventesArrivee == null) return NotFound("Élément introuvable.");
                    // Mettre à jour les propriétés de `ventesArrivee` avec `entryData`
                    break;

                case "EtatVentesDepart":
                    var ventesDepart = await _context.EtatVentesDepart.FindAsync(code);
                    if (ventesDepart == null) return NotFound("Élément introuvable.");
                    // Mettre à jour les propriétés de `ventesDepart` avec `entryData`
                    break;

                case "EtatOffresArrivee":
                    var offresArrivee = await _context.EtatOffresArrivee.FindAsync(code);
                    if (offresArrivee == null) return NotFound("Élément introuvable.");
                    // Mettre à jour les propriétés de `offresArrivee` avec `entryData`
                    break;

                case "EtatOffresDepart":
                    var offresDepart = await _context.EtatOffresDepart.FindAsync(code);
                    if (offresDepart == null) return NotFound("Élément introuvable.");
                    // Mettre à jour les propriétés de `offresDepart` avec `entryData`
                    break;

                default:
                    return BadRequest("Table invalide.");
            }

            await _context.SaveChangesAsync();
            return Ok("Mise à jour réussie");
        }

        // 4. Supprimer une entrée
        [HttpDelete("{tableName}/{code}")]
        public async Task<IActionResult> DeleteEntry(string tableName, string code)
        {
            if (!IsValidTable(tableName))
                return BadRequest("Table invalide.");

            switch (tableName)
            {
                case "EtatVentesArrivee":
                    var ventesArrivee = await _context.EtatVentesArrivee.FindAsync(code);
                    if (ventesArrivee == null) return NotFound("Élément introuvable.");
                    _context.EtatVentesArrivee.Remove(ventesArrivee);
                    break;

                case "EtatVentesDepart":
                    var ventesDepart = await _context.EtatVentesDepart.FindAsync(code);
                    if (ventesDepart == null) return NotFound("Élément introuvable.");
                    _context.EtatVentesDepart.Remove(ventesDepart);
                    break;

                case "EtatOffresArrivee":
                    var offresArrivee = await _context.EtatOffresArrivee.FindAsync(code);
                    if (offresArrivee == null) return NotFound("Élément introuvable.");
                    _context.EtatOffresArrivee.Remove(offresArrivee);
                    break;

                case "EtatOffresDepart":
                    var offresDepart = await _context.EtatOffresDepart.FindAsync(code);
                    if (offresDepart == null) return NotFound("Élément introuvable.");
                    _context.EtatOffresDepart.Remove(offresDepart);
                    break;

                default:
                    return BadRequest("Table invalide.");
            }

            await _context.SaveChangesAsync();
            return Ok("Suppression réussie");
        }

        private bool IsValidTable(string tableName)
        {
            var validTables = new HashSet<string> {
                "EtatVentesArrivee",
                "EtatVentesDepart",
                "EtatOffresArrivee",
                "EtatOffresDepart"
            };
            return validTables.Contains(tableName);
        }
    }
}
