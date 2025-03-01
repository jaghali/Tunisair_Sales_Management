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
    public class ListeEquipageVController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListeEquipageVController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public async Task<ActionResult<IEnumerable<ListeEquipageV>>> GetEnteteVente()
{
    var entetes = await _context.ListeEquipageV.ToListAsync();

    return entetes;
}

    }
}
