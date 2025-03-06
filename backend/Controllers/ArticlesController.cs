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
    public class ArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArticlesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Articles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Articles>>> GetArticles()
        {
            var articles = await _context.Articles.ToListAsync();
            return Ok(articles); // Return the list of articles
        }

        // POST: api/Articles
        [HttpPost]
        public async Task<ActionResult<Articles>> PostArticles(Articles articles)
        {
            _context.Articles.Add(articles);
            await _context.SaveChangesAsync();

            // Return the newly created article with a 201 Created status
            return CreatedAtAction(nameof(GetArticles), new { code = articles.Code }, articles);
        }

        // PUT: api/Articles/5
        [HttpPut("{code}")]
        public async Task<IActionResult> PutArticles(string code, Articles articles)
        {
            if (code != articles.Code)
            {
                return BadRequest();
            }

            _context.Entry(articles).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticlesExists(code)) 
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

        // DELETE: api/Articles/5
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteArticles(string code)
        {
            var article = await _context.Articles.FindAsync(code); // Find the article by Code
            if (article == null)
            {
                return NotFound();
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        private bool ArticlesExists(string code)
        {
            return _context.Articles.Any(e => e.Code == code);
        }
    }
}
