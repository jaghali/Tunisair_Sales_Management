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
    public class ListeEquipageOController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListeEquipageOController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public async Task<ActionResult<IEnumerable<ListeEquipageO>>> GetEnteteOffres()
{
    var entetes = await _context.ListeEquipageO.ToListAsync();

    return entetes;
}

    }
}
