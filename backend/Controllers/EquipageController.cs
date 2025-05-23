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
    public class EquipageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EquipageController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET: api/Equipage/equipageByNumfl/123
        [HttpGet("automatedEquipage/{enteteId}")]
public async Task<IActionResult> GetAutomatedEquipage(int enteteId)
{
    var entete = await _context.EnteteVente.FindAsync(enteteId);
    if (entete == null || string.IsNullOrEmpty(entete.FL01))
        return NotFound("Entete or FL01 not found");

    int fl01;
    if (!int.TryParse(entete.FL01, out fl01))
        return BadRequest("FL01 is not a valid number");

    var equipages = await _context.Equipages
        .Where(e => e.NUMFL == fl01)
        .ToListAsync();

    return Ok(equipages);
}



        
    }
}
