using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TunisairSalesManagement.Models; 
using TunisairSalesManagement.Data; 
[ApiController]
[Route("api/[controller]")]
public class DeviseController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public DeviseController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Devise>>> GetDevises() =>
        await _context.Devises.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Devise>> GetDevise(int id)
    {
        var devise = await _context.Devises.FindAsync(id);
        return devise == null ? NotFound() : devise;
    }

    [HttpPost]
    public async Task<ActionResult<Devise>> CreateDevise(Devise devise)
    {
        _context.Devises.Add(devise);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDevise), new { id = devise.Id }, devise);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDevise(int id, Devise devise)
    {
        if (id != devise.Id) return BadRequest();

        _context.Entry(devise).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDevise(int id)
    {
        var devise = await _context.Devises.FindAsync(id);
        if (devise == null) return NotFound();

        _context.Devises.Remove(devise);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
