using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RezervacijaController : ControllerBase
{
    private readonly RezervacijaService _rezervacijaService;

    public RezervacijaController(RezervacijaService rezervacijaService) =>
        _rezervacijaService = rezervacijaService;

    [HttpGet("PreuzmiRezervacije")]
    public async Task<List<Rezervacija>> PreuzmiRezervacije() =>
        await _rezervacijaService.PreuzmiRezervacije();

    [HttpGet("PreuzmiRezervaciju{id:length(24)}")]
    public async Task<ActionResult<Rezervacija>> PreuzmiRezervaciju(string id)
    {
        var rezervacija = await _rezervacijaService.PreuzmiRezervaciju(id);

        if (rezervacija is null)
        {
            return NotFound();
        }

        return rezervacija;
    }

    [HttpGet("PreuzmiRezervacijeSmestaja/{id}")]
    public async Task<ActionResult<List<Rezervacija>>> PreuzmiRezervacijeSmestaja(string id)
    {
        var rezervacijeSmestaja = await _rezervacijaService.PreuzmiRezervacijeSmestaja(id);

        if (rezervacijeSmestaja == null)
        {
            return NotFound();
        }

        return rezervacijeSmestaja;
    }

    [HttpPost("DodajRezervacijuUSmestaj/{id}")]
    public async Task<IActionResult> DodajRezervacijuUSmestaj(string id, [FromBody] Rezervacija rezervacija)
    {
        await _rezervacijaService.DodajRezervacijuUSmestaj(rezervacija, id);

        return Ok(new { Message = "Rezervacija smestaja je uspesno dodata!" });
    }

    [HttpPut("AzurirajRezervaciju{id:length(24)}")]
    public async Task<IActionResult> AzurirajRezervaciju(string id, Rezervacija azurirajRezervaciju)
    {
        var rezervacija = await _rezervacijaService.PreuzmiRezervaciju(id);

        if (rezervacija is null)
        {
            return NotFound();
        }

        azurirajRezervaciju.Id = rezervacija.Id;
        azurirajRezervaciju.Smestaj = rezervacija.Smestaj;

        await _rezervacijaService.AzurirajRezervaciju(id, azurirajRezervaciju);

        return NoContent();
    }

    [HttpDelete("ObrisiRezervaciju{id:length(24)}")]
    public async Task<IActionResult> ObrisiRezervaciju(string id)
    {
        var rezervacija = await _rezervacijaService.PreuzmiRezervaciju(id);

        if (rezervacija is null)
        {
            return NotFound();
        }

        await _rezervacijaService.ObrisiRezervaciju(id);

        return NoContent();
    }
}
