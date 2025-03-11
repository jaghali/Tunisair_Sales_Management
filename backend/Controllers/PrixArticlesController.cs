using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Models;
using TunisairSalesManagement.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrixArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrixArticlesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PrixArticles (Récupérer tous les prix d'articles)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrixArticle>>> GetPrixArticles()
        {
            var prixArticles = await _context.PrixArticles
                .Include(p => p.Article)  // Inclure l'article associé
                .Include(p => p.Devise)   // Inclure la devise associée
                .ToListAsync();

            if (!prixArticles.Any())
            {
                return NotFound("Aucun prix d'article trouvé.");
            }

            return Ok(prixArticles);
        }

        // POST: api/PrixArticles (Ajouter un prix pour un article)
        [HttpPost]
public async Task<ActionResult<PrixArticle>> PostPrixArticle(PrixArticle prixArticle)
{
    // Vérifier si l'article existe
    var article = await _context.Articles.FindAsync(prixArticle.ArticleCode);
    if (article == null)
    {
        return BadRequest("L'article spécifié n'existe pas.");
    }

    // Vérifier si la devise existe
    var devise = await _context.Devises.FindAsync(prixArticle.DeviseId);
    if (devise == null)
    {
        return BadRequest("La devise spécifiée n'existe pas.");
    }

    // Vérification des autres propriétés de prixArticle
    if (prixArticle.DateDepart == default(DateTime) || prixArticle.DateArrivee == default(DateTime) || prixArticle.Prix <= 0)
    {
        return BadRequest("Les informations du prix sont incomplètes.");
    }

    // Ajouter le prix de l'article
    _context.PrixArticles.Add(prixArticle);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetPrixArticles), new { id = prixArticle.Id }, prixArticle);
}

       
    }
}
