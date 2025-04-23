using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TunisairSalesManagement.Models;
using TunisairSalesManagement.Data;

[ApiController]
[Route("api/[controller]")]
public class TauxChangeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TauxChangeController(ApplicationDbContext context) => _context = context;

    // GET: api/TauxChange
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TauxChange>>> GetAll()
    {
        var tauxChanges = await _context.TauxChange.Include(t => t.Devise).ToListAsync();
        return Ok(tauxChanges); // Return with 200 OK
    }

    // GET: api/TauxChange/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TauxChange>> GetById(int id)
    {
        var taux = await _context.TauxChange.Include(t => t.Devise)
                                            .FirstOrDefaultAsync(t => t.Id == id);
        if (taux == null)
        {
            return NotFound(); // Return 404 if not found
        }

        return Ok(taux); // Return 200 OK with the taux
    }

    // POST: api/TauxChange
    [HttpPost]
    public async Task<ActionResult<TauxChange>> CreateTauxChange(TauxChange tauxChange)
    {
        _context.TauxChange.Add(tauxChange);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tauxChange.Id }, tauxChange);
    }

    // PUT: api/TauxChange/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTauxChange(int id, TauxChange tauxChange)
    {
        if (id != tauxChange.Id)
            return BadRequest("ID mismatch");

        _context.Entry(tauxChange).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/TauxChange/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var taux = await _context.TauxChange.FindAsync(id);
        if (taux == null)
        {
            return NotFound(); // Return 404 if taux not found
        }

        // Remove the taux from context
        _context.TauxChange.Remove(taux);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content after successful deletion
    }
}
