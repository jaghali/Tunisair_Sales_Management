using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TunisairSalesManagement.Data;

namespace TunisairSalesManagement.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<IdentityUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager    = userManager;
            _configuration  = configuration;
            _context        = context;
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            // 1) Try in Utilisateurs table
            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Matricule == loginModel.Matricule);

            if (user != null && user.Pwd == loginModel.Password)
            {
                var jwtToken = GenerateJwtToken(user.Matricule, user.Role);
                var redirectUrl = GetRedirectUrl(user.Role);
                return Ok(new
                {
                    token    = jwtToken,
                    role     = user.Role,
                    redirect = redirectUrl
                });
            }

            // 2) If not found, try in PN table
            var pnUser = await _context.PN
                .FirstOrDefaultAsync(p =>
                    p.MATRICULE == loginModel.Matricule &&
                    p.Password  == loginModel.Password);

            if (pnUser != null)
            {
                // Use SECTEUR as role
                string role = pnUser.SECTEUR;
                var jwtToken = GenerateJwtToken(pnUser.MATRICULE, role);

                // Build redirect URL dynamically for PNC/PNT
                string redirectUrl = (role == "PNC" || role == "PNT")
                    ? $"/UserInterface/{pnUser.MATRICULE}"
                    : GetRedirectUrl(role);

                return Ok(new
                {
                    token    = jwtToken,
                    role,
                    redirect = redirectUrl
                });
            }

            return Unauthorized(new { message = "Invalid credentials." });
        }

        /// <summary>
        /// Maps roles to their SPA route:
        /// </summary>
        private string GetRedirectUrl(string role) => role switch
        {
            "Admin"               => "/OverviewPage",
            "DirectionFinanciere" => "/direction-financiere-dashboard",
            "AgentSaisie"         => "/agent-saisie-dashboard",
            _                     => "/default-dashboard"
        };

        /// <summary>
        /// Generates a JWT including matricule and role claims.
        /// </summary>
        private string GenerateJwtToken(string matricule, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, matricule),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             _configuration["Jwt:Issuer"],
                audience:           _configuration["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string Matricule { get; set; }
        public string Password  { get; set; }
    }
}
