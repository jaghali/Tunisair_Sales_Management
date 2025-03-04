using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TunisairSalesManagement.Models; 
using TunisairSalesManagement.Data; 

[Route("api/[controller]")]
[ApiController]
public class EnteteOffreController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EnteteOffreController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/EnteteOffre
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EnteteOffre>>> GetEnteteOffre()
    {
        return await _context.EnteteOffre.ToListAsync();
    }

    // GET: api/EnteteOffre/5
    [HttpGet("{id}")]
    public async Task<ActionResult<EnteteOffre>> GetEnteteOffre(int id)
    {
        var enteteOffre = await _context.EnteteOffre.FindAsync(id);

        if (enteteOffre == null)
        {
            return NotFound();
        }

        return enteteOffre;
    }

    // POST: api/EnteteOffre
    [HttpPost]
    public async Task<ActionResult<EnteteOffre>> PostEnteteOffre(EnteteOffre enteteOffre)
    {
        _context.EnteteOffre.Add(enteteOffre);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEnteteOffre), new { id = enteteOffre.ID }, enteteOffre);
    }

    // PUT: api/EnteteOffre/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEnteteOffre(int id, EnteteOffre enteteOffre)
    {
        if (id != enteteOffre.ID)
        {
            return BadRequest();
        }

        _context.Entry(enteteOffre).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EnteteOffreExists(id))
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

    // DELETE: api/EnteteOffre/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnteteOffre(int id)
    {
        var enteteOffre = await _context.EnteteOffre.FindAsync(id);
        if (enteteOffre == null)
        {
            return NotFound();
        }

        _context.EnteteOffre.Remove(enteteOffre);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EnteteOffreExists(int id)
    {
        return _context.EnteteOffre.Any(e => e.ID == id);
    }
}
