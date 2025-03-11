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
            // Récupère tous les fournisseurs de la base de données
            var fournisseurs = await _context.Fournisseurs.ToListAsync();

            // Si aucun fournisseur n'est trouvé
            if (fournisseurs == null || fournisseurs.Count == 0)
            {
                return NotFound("Aucun fournisseur trouvé.");
            }

            // Retourne la liste des fournisseurs
            return Ok(fournisseurs);
        }
    }
}
