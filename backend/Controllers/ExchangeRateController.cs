using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ExchangeRateController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ExchangeRateController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet("{currency}")]
    public async Task<IActionResult> GetRate(string currency)
    {
        string baseCurrency = "EUR";
        string apiKey = "e5923cd8530f1ce9548e37f2"; 
        string url = $"https://v6.exchangerate-api.com/v6/{apiKey}/latest/{baseCurrency}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode, "Erreur de l’API");

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        if (json.RootElement.GetProperty("conversion_rates").TryGetProperty(currency.ToUpper(), out var rate))
        {
            return Ok(new { rate = rate.GetDecimal() });
        }

        return BadRequest("Devise inconnue");
    }
}
