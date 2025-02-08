using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/utilisateurs")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtilisateurController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Obtenir tous les utilisateurs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Utilisateur>>> GetUtilisateurs()
        {
            return await _context.Utilisateurs.ToListAsync();
        }

        // Obtenir un utilisateur par matricule
        [HttpGet("{matricule}")]
        public async Task<ActionResult<Utilisateur>> GetUtilisateur(string matricule)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(matricule);
            if (utilisateur == null) return NotFound(new { message = "Utilisateur non trouvé." });

            return utilisateur;
        }

        // Ajouter un utilisateur avec hachage du mot de passe
        [HttpPost]
        public async Task<ActionResult<Utilisateur>> CreateUtilisateur(Utilisateur utilisateur)
        {
            if (await _context.Utilisateurs.AnyAsync(u => u.Matricule == utilisateur.Matricule))
            {
                return Conflict(new { message = "Un utilisateur avec ce matricule existe déjà." });
            }

            utilisateur.Pwd = BCrypt.Net.BCrypt.HashPassword(utilisateur.Pwd);
            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUtilisateur), new { matricule = utilisateur.Matricule }, utilisateur);
        }

        // Modifier un utilisateur
        [HttpPut("{matricule}")]
        public async Task<IActionResult> UpdateUtilisateur(string matricule, Utilisateur utilisateur)
        {
            if (matricule != utilisateur.Matricule) return BadRequest(new { message = "Le matricule ne correspond pas." });

            var existingUser = await _context.Utilisateurs.FindAsync(matricule);
            if (existingUser == null) return NotFound(new { message = "Utilisateur non trouvé." });

            // Mise à jour des champs
            existingUser.Nom = utilisateur.Nom;
            existingUser.Prenom = utilisateur.Prenom;
            existingUser.Role = utilisateur.Role;

            if (!string.IsNullOrEmpty(utilisateur.Pwd))
            {
                existingUser.Pwd = BCrypt.Net.BCrypt.HashPassword(utilisateur.Pwd);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Supprimer un utilisateur
        [HttpDelete("{matricule}")]
        public async Task<IActionResult> DeleteUtilisateur(string matricule)
        {
            var utilisateur = await _context.Utilisateurs.FindAsync(matricule);
            if (utilisateur == null) return NotFound(new { message = "Utilisateur non trouvé." });

            _context.Utilisateurs.Remove(utilisateur);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
