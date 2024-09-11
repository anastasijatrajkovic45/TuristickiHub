using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AktivnostController : ControllerBase
{
    private readonly AktivnostService _aktivnostService;

    public AktivnostController(AktivnostService aktivnostService) =>
        _aktivnostService = aktivnostService;

    [HttpGet("PreuzmiAktivnosti")]
    public async Task<List<Aktivnost>> PreuzmiAktivnosti() =>
        await _aktivnostService.PreuzmiAktivnosti();

    [HttpGet("PreuzmiAktivnost{id:length(24)}")]
    public async Task<ActionResult<Aktivnost>> PreuzmiAktivnost(string id)
    {
        var aktivnost = await _aktivnostService.PreuzmiAktivnost(id);

        if (aktivnost is null)
        {
            return NotFound();
        }

        return aktivnost;
    }

    [HttpGet("PreuzmiAktivnostiNaPutovanju/{id}")]
    public async Task<ActionResult<List<Aktivnost>>> PreuzmiAktivnostiNaPutovanju(string id)
    {
        var aktivnostiPutovanja = await _aktivnostService.PreuzmiAktivnostiNaPutovanju(id);

        if (aktivnostiPutovanja == null)
        {
            return NotFound();
        }

        return aktivnostiPutovanja;
    }

    [HttpPost("DodajAktivnostPutovanju/{id}")]
    public async Task<IActionResult> DodajAktivnostPutovanju(string id, [FromBody] Aktivnost aktivnost)
    {
        await _aktivnostService.DodajAktivnostPutovanju(aktivnost, id);

        return Ok(new { Message = "Aktivnost na putovanju je uspešno dodato." });
    }

    [HttpPut("AzurirajAktivnost{id:length(24)}")]
    public async Task<IActionResult> AzurirajAktivnost(string id, Aktivnost azurirajAktivnost)
    {
        var aktivnost = await _aktivnostService.PreuzmiAktivnost(id);

        if (aktivnost is null)
        {
            return NotFound();
        }

        azurirajAktivnost.Id = aktivnost.Id;
        azurirajAktivnost.Putovanje = aktivnost.Putovanje;

        await _aktivnostService.AzurirajAktivnost(id, azurirajAktivnost);

        return NoContent();
    }

    [HttpDelete("ObrisiAktivnost{id:length(24)}")]
    public async Task<IActionResult> ObrisiAktivnost(string id)
    {
        var aktivnost = await _aktivnostService.PreuzmiAktivnost(id);

        if (aktivnost is null)
        {
            return NotFound();
        }

        await _aktivnostService.ObrisiAktivnost(id);

        return NoContent();
    }
}
