using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecenzijaController : ControllerBase
{
    private readonly RecenzijaService _recenzijaService;

    public RecenzijaController(RecenzijaService recenzijaService) =>
        _recenzijaService = recenzijaService;

    [HttpGet("PreuzmiRecenzije")]
    public async Task<List<Recenzija>> PreuzmiRecenzije() =>
        await _recenzijaService.PreuzmiRecenzije();

    [HttpGet("PreuzmiRecenziju{id:length(24)}")]
    public async Task<ActionResult<Recenzija>> PreuzmiRecenziju(string id)
    {
        var recenzija = await _recenzijaService.PreuzmiRecenziju(id);

        if (recenzija is null)
        {
            return NotFound();
        }

        return recenzija;
    }

    [HttpGet("PreuzmiRecenzijeNaPutovanju/{id}")]
    public async Task<ActionResult<List<Recenzija>>> PreuzmiRecenzijeNaPutovanju(string id)
    {
        var recenzijePutovanja = await _recenzijaService.PreuzmiRecenzijeNaPutovanju(id);

        if (recenzijePutovanja == null)
        {
            return NotFound();
        }

        return recenzijePutovanja;
    }

    [HttpPost("DodajRecenzijuPutovanju/{id}")]
    public async Task<IActionResult> DodajRecenzijuPutovanju(string id, [FromBody] Recenzija recenzija)
    {
        await _recenzijaService.DodajRecenzijuPutovanju(recenzija, id);

        return Ok(new { Message = "Recenzija na putovanju je uspešno dodato." });
    }

    [HttpPut("AzurirajRecenziju{id:length(24)}")]
    public async Task<IActionResult> AzurirajRecenziju(string id, Recenzija azurirajRecenziju)
    {
        var recenzija = await _recenzijaService.PreuzmiRecenziju(id);

        if (recenzija is null)
        {
            return NotFound();
        }

        azurirajRecenziju.Id = recenzija.Id;
        azurirajRecenziju.Putovanje = recenzija.Putovanje;

        await _recenzijaService.AzurirajRecenziju(id, azurirajRecenziju);

        return NoContent();
    }

    [HttpDelete("ObrisiRecenziju{id:length(24)}")]
    public async Task<IActionResult> ObrisiRecenziju(string id)
    {
        var recenzija = await _recenzijaService.PreuzmiRecenziju(id);

        if (recenzija is null)
        {
            return NotFound();
        }

        await _recenzijaService.ObrisiRecenziju(id);

        return NoContent();
    }
}
