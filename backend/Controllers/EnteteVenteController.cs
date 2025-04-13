using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TunisairSalesManagement.Models; 
using TunisairSalesManagement.Data; 

[Route("api/[controller]")]
[ApiController]
public class EnteteVenteController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EnteteVenteController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/EnteteVente
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EnteteVente>>> GetEnteteVente()
    {
        return await _context.EnteteVente.ToListAsync();
    }

    // GET: api/EnteteVente/5
    [HttpGet("{id}")]
    public async Task<ActionResult<EnteteVente>> GetEnteteVente(int id)
    {
        var enteteVente = await _context.EnteteVente.FindAsync(id);

        if (enteteVente == null)
        {
            return NotFound();
        }

        return enteteVente;
    }

    // POST: api/EnteteVente
    [HttpPost]
    public async Task<ActionResult<EnteteVente>> PostEnteteVente(EnteteVente enteteVente)
    {
        // Si le statut n'est pas fourni, on assigne "Not Approved" par défaut
        if (string.IsNullOrEmpty(enteteVente.Statut))
        {
        enteteVente.Statut = "Not Approved";
        }

        _context.EnteteVente.Add(enteteVente);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEnteteVente), new { id = enteteVente.ID }, enteteVente);
    }

    // PUT: api/EnteteVente/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEnteteVente(int id, EnteteVente enteteVente)
    {
        if (id != enteteVente.ID)
        {
            return BadRequest();
        }

        _context.Entry(enteteVente).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EnteteVenteExists(id))
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

    // PUT: api/EnteteVente/updateStatut
      [HttpPut("updateStatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusRequest request)
        {
            if (request == null || request.Id <= 0 || string.IsNullOrEmpty(request.Statut))
            {
                return BadRequest(new { message = "Données invalides" });
            }

            // Chercher l'EnteteVente par l'ID
            var enteteVente = await _context.EnteteVente.FindAsync(request.Id);
            if (enteteVente == null)
            {
                return NotFound(new { message = "Entête de vente non trouvé" });
            }

            // Mettre à jour le statut
            enteteVente.Statut = request.Statut;
            _context.EnteteVente.Update(enteteVente);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Statut mis à jour avec succès" });
        }
        


    // DELETE: api/EnteteVente/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEnteteVente(int id)
    {
        var enteteVente = await _context.EnteteVente.FindAsync(id);
        if (enteteVente == null)
        {
            return NotFound();
        }

        _context.EnteteVente.Remove(enteteVente);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EnteteVenteExists(int id)
    {
        return _context.EnteteVente.Any(e => e.ID == id);
    }
}
 // Classe de requête pour recevoir l'ID et le statut
    public class UpdateStatusRequest
    {
        public int Id { get; set; }
        public string Statut { get; set; }
    }

