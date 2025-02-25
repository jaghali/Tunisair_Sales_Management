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

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration, ApplicationDbContext context)
    {
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        // Vérifier d'abord dans la table Utilisateurs
        var user = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Matricule == loginModel.Matricule);
        if (user != null && user.Pwd == loginModel.Password) // Check plain password
        {
            var jwtToken = GenerateJwtToken(user.Matricule, user.Role);
            return Ok(new { token = jwtToken, role = user.Role, redirect = GetRedirectUrl(user.Role) });
        }


        // Si non trouvé dans la table Utilisateurs, vérifier dans la table PN
        var pnUser = await _context.PN.FirstOrDefaultAsync(p => p.MATRICULE == loginModel.Matricule && p.Password == loginModel.Password);
        if (pnUser != null)
        {
            // Définition du rôle en fonction du champ SECTEUR
            string role = pnUser.SECTEUR;
            var jwtToken = GenerateJwtToken(pnUser.MATRICULE, role);
            return Ok(new { token = jwtToken, role = role, redirect = GetRedirectUrl(role) });
        }

        return Unauthorized(new { message = "Invalid credentials." });
    }

    private string GetRedirectUrl(string role)
    {
        return role switch
        {
            "Admin" => "/admin-users",
            "DirectionFinanciere" => "/direction-financiere-dashboard",
            "AgentSaisie" => "/agent-saisie-dashboard",
            "PNC" => "/avances-consultation",
            "PNT" => "/avances-consultation",
            _ => "/default-dashboard"
        };
    }

    private string GenerateJwtToken(string matricule, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, matricule),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginModel
{
    public string Matricule { get; set; }
    public string Password { get; set; }
}
