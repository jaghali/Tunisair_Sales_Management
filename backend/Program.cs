using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using TunisairSalesManagement.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuration de la base de données
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajout des services Identity pour UserManager
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders(); // This ensures that the UserManager can be injected

// Enregistrement de HttpClient pour les appels d'API externes
builder.Services.AddHttpClient();

// Ajout de CORS pour autoriser les requêtes du frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000") // URL de votre frontend React
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Ajout des contrôleurs et NewtonsoftJson
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


// Configuration de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TunisairSalesManagement API",
        Version = "v1",
        Description = "API de gestion des ventes et utilisateurs pour Tunisair",
        Contact = new OpenApiContact
        {
            Name = "Support Tunisair",
            Email = "support@tunisair.com"
        }
    });
});

var app = builder.Build();

// Activer Swagger uniquement en développement
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TunisairSalesManagement API v1");
        c.RoutePrefix = string.Empty; // Accès direct à Swagger sur http://localhost:PORT/
    });
}

app.UseHttpsRedirection();

// Activation du middleware CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();
app.Run();
