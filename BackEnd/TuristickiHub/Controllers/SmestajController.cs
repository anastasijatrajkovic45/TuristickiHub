using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SmestajController : ControllerBase
{
    private readonly SmestajService _smestajService;

    public SmestajController(SmestajService smestajService) =>
        _smestajService = smestajService;

    [HttpGet("PreuzmiSmestaje")]
    public async Task<List<Smestaj>> PreuzmiSmestaje() =>
        await _smestajService.PreuzmiSmestaje();

    [HttpGet("PreuzmiSmestaj{id:length(24)}")]
    public async Task<ActionResult<Smestaj>> PreuzmiSmestaj(string id)
    {
        var smestaj = await _smestajService.PreuzmiSmestaj(id);

        if (smestaj is null)
        {
            return NotFound();
        }

        return smestaj;
    }

    [HttpGet("PreuzmiSmestajeNaPutovanju/{id}")]
    public async Task<ActionResult<List<Smestaj>>> PreuzmiSmestajeNaPutovanju(string id)
    {
        var smestajiPutovanja = await _smestajService.PreuzmiSmestajeNaPutovanju(id);

        if (smestajiPutovanja == null)
        {
            return NotFound();
        }

        return smestajiPutovanja;
    }

    [HttpPost("DodajSmestajPutovanju/{id}")]
    public async Task<IActionResult> DodajSmestajPutovanju(string id, [FromBody] Smestaj smestaj)
    {
        await _smestajService.DodajSmestajPutovanju(smestaj, id);

        return Ok(new { Message = "Smestaj na putovanju je uspešno dodat." });
    }

    [HttpPut("AzurirajSmestaj{id:length(24)}")]
    public async Task<IActionResult> AzurirajSmestaj(string id, Smestaj azurirajSmestaj)
    {
        var smestaj = await _smestajService.PreuzmiSmestaj(id);

        if (smestaj is null)
        {
            return NotFound();
        }

        azurirajSmestaj.Id = smestaj.Id;
        azurirajSmestaj.Putovanje = smestaj.Putovanje;
        azurirajSmestaj.Rezervacije = smestaj.Rezervacije;

        await _smestajService.AzurirajSmestaj(id, azurirajSmestaj);

        return NoContent();
    }

    [HttpDelete("ObrisiSmestaj{id:length(24)}")]
    public async Task<IActionResult> ObrisiSmestaj(string id)
    {
        var smestaj = await _smestajService.PreuzmiSmestaj(id);

        if (smestaj is null)
        {
            return NotFound();
        }

        await _smestajService.ObrisiSmestaj(id);

        return NoContent();
    }
}
