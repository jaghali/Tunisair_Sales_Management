using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using BCrypt.Net;
using TunisairSalesManagement.Data;
using TunisairSalesManagement.Models;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/detailfl")]
    [ApiController]
    public class DetailFLController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetailFLController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all DetailFL entries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetailFL>>> GetAllDetailFL()
        {
            var details = await _context.DetailFLs.ToListAsync();
            return Ok(details);
        }

        // 2. Get DetailFL by NUMFL and NUMVOL (composite key)
        [HttpGet("{numfl}/{numvol}")]
        public async Task<ActionResult<DetailFL>> GetDetailFL(int numfl, int numvol)
        {
            var detail = await _context.DetailFLs.FindAsync(numfl, numvol);
            if (detail == null) return NotFound();
            return Ok(detail);
        }

        // 3. Create a new DetailFL
        [HttpPost]
        public async Task<ActionResult<DetailFL>> CreateDetailFL(DetailFL detail)
        {
            _context.DetailFLs.Add(detail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetailFL), new { numfl = detail.NUMFL, numvol = detail.NUMVOL }, detail);
        }

        // 4. Update an existing DetailFL
        [HttpPut("{numfl}/{numvol}")]
        public async Task<IActionResult> UpdateDetailFL(int numfl, int numvol, DetailFL detail)
        {
            if (numfl != detail.NUMFL || numvol != detail.NUMVOL)
                return BadRequest("Clé composite (NUMFL, NUMVOL) ne correspond pas.");

            var existing = await _context.DetailFLs.FindAsync(numfl, numvol);
            if (existing == null) return NotFound();

            // Update properties manually as needed
            existing.CIE = detail.CIE;
            existing.DATEVOL = detail.DATEVOL;
            existing.ESCALEDEP = detail.ESCALEDEP;
            existing.ESCALEARR = detail.ESCALEARR;
            existing.NUMORDRE = detail.NUMORDRE;
            existing.DATEDEPPREV = detail.DATEDEPPREV;
            existing.HEUREBBDEP = detail.HEUREBBDEP;
            existing.HEUREBBARR = detail.HEUREBBARR;
            existing.DUREEVOLBB = detail.DUREEVOLBB;
            existing.HEUREABDEP = detail.HEUREABDEP;
            existing.HEUREABARR = detail.HEUREABARR;
            existing.DUREEVOLAB = detail.DUREEVOLAB;
            existing.CARBVOLPREC = detail.CARBVOLPREC;
            existing.CARBRAVUNITE = detail.CARBRAVUNITE;
            existing.CARBRAV = detail.CARBRAV;
            existing.CARBCOEFCONV = detail.CARBCOEFCONV;
            existing.CARBRAVKG = detail.CARBRAVKG;
            existing.CARBJAUGEDEP = detail.CARBJAUGEDEP;
            existing.CARBJAUGEARR = detail.CARBJAUGEARR;
            existing.CARBCONSOM = detail.CARBCONSOM;
            existing.VOLOPERATIONNEL = detail.VOLOPERATIONNEL;
            existing.DATEVOLOP = detail.DATEVOLOP;
            existing.MAT = detail.MAT;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 5. Delete DetailFL
        [HttpDelete("{numfl}/{numvol}")]
        public async Task<IActionResult> DeleteDetailFL(int numfl, int numvol)
        {
            var detail = await _context.DetailFLs.FindAsync(numfl, numvol);
            if (detail == null) return NotFound();

            _context.DetailFLs.Remove(detail);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 6. Import DetailFL from Excel
        [HttpPost("import")]
        public async Task<IActionResult> ImportFromExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Fichier manquant ou vide.");

            var details = new List<DetailFL>();

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
                            var detail = new DetailFL
                            {
                                NUMFL = int.Parse(worksheet.Cells[row, 1].Text),
                                NUMVOL = int.Parse(worksheet.Cells[row, 2].Text),
                                CIE = worksheet.Cells[row, 3].Text,
                                DATEVOL = DateTime.TryParse(worksheet.Cells[row, 4].Text, out var d1) ? d1 : (DateTime?)null,
                                ESCALEDEP = worksheet.Cells[row, 5].Text,
                                ESCALEARR = worksheet.Cells[row, 6].Text,
                                NUMORDRE = int.TryParse(worksheet.Cells[row, 7].Text, out var n1) ? n1 : (int?)null
                                // Add parsing for more fields if needed
                            };

                            details.Add(detail);
                        }
                    }
                }

                _context.DetailFLs.AddRange(details);
                await _context.SaveChangesAsync();

                return Ok($"Importation réussie : {details.Count} lignes ajoutées.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur import Excel : {ex.Message}");
            }
        }
    }
}
