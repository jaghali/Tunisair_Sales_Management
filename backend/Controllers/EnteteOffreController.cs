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
    public class EnteteOffreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnteteOffreController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public async Task<ActionResult<IEnumerable<EnteteOffre>>> GetEnteteOffres()
{
    var entetes = await _context.EnteteOffre.ToListAsync();

    return entetes;
}

    }
}
