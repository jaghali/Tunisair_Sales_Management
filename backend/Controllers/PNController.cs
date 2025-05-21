using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;  // EPPlus for Excel reading
using BCrypt.Net; // For password hashing
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Security.Cryptography;
using System.Text;

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

        // 1. Get all PN
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PN>>> GetPNs()
        {
            var pns = await _context.PN.ToListAsync();

            foreach (var pn in pns)
            {
                if (string.IsNullOrEmpty(pn.Password))
                {
                    pn.Password = "DefaultPassword";
                }
            }

            return Ok(pns);
        }

        // 2. Get PN by matricule
        [HttpGet("{matricule}")]
        public async Task<ActionResult<PN>> GetPN(string matricule)
        {
            var pn = await _context.PN.FindAsync(matricule);
            if (pn == null) return NotFound();
            return pn;
        }

        // 3. Create PN
        [HttpPost]
        public async Task<ActionResult<PN>> CreatePN(PN pn)
        {
            pn.Password = BCrypt.Net.BCrypt.HashPassword(pn.Password);
            _context.PN.Add(pn);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPN), new { matricule = pn.MATRICULE }, pn);
        }

        // 4. Update PN
        [HttpPut("{matricule}")]
        public async Task<IActionResult> UpdatePN(string matricule, PN pn)
        {
            if (matricule != pn.MATRICULE) return BadRequest("Le matricule ne correspond pas.");

            var existingPN = await _context.PN.FindAsync(matricule);
            if (existingPN == null) return NotFound();

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

        // 5. Delete PN
        [HttpDelete("{matricule}")]
        public async Task<IActionResult> DeletePN(string matricule)
        {
            var pn = await _context.PN.FindAsync(matricule);
            if (pn == null) return NotFound();

            _context.PN.Remove(pn);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 6. Import PN from Excel
        [HttpPost("import")]
        public async Task<IActionResult> ImportPN(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Aucun fichier n'a été téléchargé.");

            var pnList = new List<PN>();

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0];

                        int rowCount = worksheet.Dimension.Rows;
                        for (int row = 2; row <= rowCount; row++)
                        {
                            var password = worksheet.Cells[row, 7].Text;

                            if (string.IsNullOrEmpty(password))
                            {
                                password = "DefaultPassword";
                            }

                            var pn = new PN
                            {
                                MATRICULE = worksheet.Cells[row, 1].Text,
                                Nom = worksheet.Cells[row, 2].Text,
                                Prenom = worksheet.Cells[row, 3].Text,
                                BASE = worksheet.Cells[row, 4].Text,
                                COLLEGE = worksheet.Cells[row, 5].Text,
                                SECTEUR = worksheet.Cells[row, 6].Text,
                                Password = BCrypt.Net.BCrypt.HashPassword(password)
                            };

                            pnList.Add(pn);
                        }
                    }
                }

                _context.PN.AddRange(pnList);
                await _context.SaveChangesAsync();

                return Ok($"Importation réussie ! {pnList.Count} enregistrements ajoutés.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de l'importation : {ex.Message}");
            }
        }

        // 7. Forgot password: generate random password, update DB, send email
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.PN.FirstOrDefaultAsync(p => p.MATRICULE == request.Matricule && p.Email == request.Email);
            if (user == null)
                return NotFound(new { success = false, message = "Invalid matricule or email." });

            var newPassword = GenerateRandomPassword(10);

            // Update password in database
            user.Password = newPassword;
            await _context.SaveChangesAsync();

            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("Tunisair", "your_email@gmail.com"));
                email.To.Add(new MailboxAddress(user.Prenom, user.Email));
                email.Subject = "🔐 Your New Password";
                email.Body = new TextPart("plain")
                {
                    Text = $"Hello {user.Nom},\n\nYour new password is: {newPassword}\n\nPlease change it after logging in."
                };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("labidiweldchhiba24@gmail.com", "uwnb kgkj txfl auqk");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return Ok(new { success = true, message = "Password reset email sent." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send email.", details = ex.Message });
            }
        }

        // Helper method: generate secure random password
        private string GenerateRandomPassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];

                while (res.Length < length)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int)(num % (uint)valid.Length)]);
                }
            }

            return res.ToString();
        }
    }

    // Request DTO for forgot password endpoint
    public class ForgotPasswordRequest
    {
        public string Matricule { get; set; }
        public string Email { get; set; }
    }
}
