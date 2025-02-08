using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;  // EPPlus pour lire Excel
using BCrypt.Net; // Pour le hachage des mots de passe
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/pn")]
    [ApiController]
    public class PNController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PNController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ?? 1. Obtenir tous les PN
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PN>>> GetPNs()
        {
            var pns = await _context.PN.ToListAsync();

            // Assurer que Password ne soit jamais null
            foreach (var pn in pns)
            {
                if (string.IsNullOrEmpty(pn.Password))
                {
                    pn.Password = "DefaultPassword"; // ou tout autre valeur s�curis�e
                }
            }

            return Ok(pns);
        }


        // ?? 2. Obtenir un PN par matricule
        [HttpGet("{matricule}")]
        public async Task<ActionResult<PN>> GetPN(string matricule)
        {
            var pn = await _context.PN.FindAsync(matricule);
            if (pn == null) return NotFound();
            return pn;
        }

        // ?? 3. Ajouter un PN
        [HttpPost]
        public async Task<ActionResult<PN>> CreatePN(PN pn)
        {
            // Hacher le mot de passe avant de l�enregistrer
            pn.Password = BCrypt.Net.BCrypt.HashPassword(pn.Password);
            _context.PN.Add(pn);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPN), new { matricule = pn.MATRICULE }, pn);
        }

        // ?? 4. Modifier un PN
        [HttpPut("{matricule}")]
        public async Task<IActionResult> UpdatePN(string matricule, PN pn)
        {
            if (matricule != pn.MATRICULE) return BadRequest("Le matricule ne correspond pas.");

            var existingPN = await _context.PN.FindAsync(matricule);
            if (existingPN == null) return NotFound();

            // Mise � jour des champs
            existingPN.Nom = pn.Nom;
            existingPN.Prenom = pn.Prenom;
            existingPN.BASE = pn.BASE;
            existingPN.COLLEGE = pn.COLLEGE;
            existingPN.SECTEUR = pn.SECTEUR;

            if (!string.IsNullOrEmpty(pn.Password))
            {
                existingPN.Password = BCrypt.Net.BCrypt.HashPassword(pn.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ?? 5. Supprimer un PN
        [HttpDelete("{matricule}")]
        public async Task<IActionResult> DeletePN(string matricule)
        {
            var pn = await _context.PN.FindAsync(matricule);
            if (pn == null) return NotFound();

            _context.PN.Remove(pn);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ?? 6. Importer un fichier Excel
        [HttpPost("import")]
        public async Task<IActionResult> ImportPN(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Aucun fichier n'a �t� t�l�charg�.");

            var pnList = new List<PN>();

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0]; // Premi�re feuille du fichier

                        int rowCount = worksheet.Dimension.Rows;
                        for (int row = 2; row <= rowCount; row++) // Commencer � la ligne 2 (ignorer l'en-t�te)
                        {
                            var password = worksheet.Cells[row, 7].Text;

                            // Si le mot de passe est vide, tu peux d�finir un mot de passe par d�faut ou ignorer l'enregistrement
                            if (string.IsNullOrEmpty(password))
                            {
                                // D�finir un mot de passe par d�faut ou sauter cette ligne
                                password = "DefaultPassword";  // Exemple : mot de passe par d�faut
                            }

                            var pn = new PN
                            {
                                MATRICULE = worksheet.Cells[row, 1].Text,
                                Nom = worksheet.Cells[row, 2].Text,
                                Prenom = worksheet.Cells[row, 3].Text,
                                BASE = worksheet.Cells[row, 4].Text,
                                COLLEGE = worksheet.Cells[row, 5].Text,
                                SECTEUR = worksheet.Cells[row, 6].Text,
                                Password = BCrypt.Net.BCrypt.HashPassword(password) // Hachage du mot de passe (maintenant non vide)
                            };

                            pnList.Add(pn);
                        }

                    }
                }

                _context.PN.AddRange(pnList);
                await _context.SaveChangesAsync();

                return Ok($"Importation r�ussie ! {pnList.Count} enregistrements ajout�s.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de l'importation : {ex.Message}");
            }
        }
    }
}
