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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TauxChange>>> GetAll() =>
        await _context.TauxChange.Include(t => t.Devise).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<TauxChange>> GetById(int id)
    {
        var taux = await _context.TauxChange.Include(t => t.Devise).FirstOrDefaultAsync(t => t.Id == id);
        return taux == null ? NotFound() : taux;
    }

    [HttpPost]
    public async Task<ActionResult<TauxChange>> Create(TauxChange tauxChange)
    {
        _context.TauxChange.Add(tauxChange);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tauxChange.Id }, tauxChange);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TauxChange tauxChange)
    {
        if (id != tauxChange.Id) return BadRequest();
        _context.Entry(tauxChange).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var taux = await _context.TauxChange.FindAsync(id);
        if (taux == null) return NotFound();

        _context.TauxChange.Remove(taux);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
