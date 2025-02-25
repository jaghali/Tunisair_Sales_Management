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
    public class EnteteVenteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnteteVenteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public async Task<ActionResult<IEnumerable<EnteteVente>>> GetEnteteVente()
{
    var entetes = await _context.EnteteVente.ToListAsync();

    return entetes;
}

    }
}
