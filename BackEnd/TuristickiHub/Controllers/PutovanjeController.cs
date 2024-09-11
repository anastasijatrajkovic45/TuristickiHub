using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PutovanjeController : ControllerBase
{
    private readonly PutovanjeService _putovanjeService;

    public PutovanjeController(PutovanjeService putovanjeService) =>
        _putovanjeService = putovanjeService;

    [HttpGet("PreuzmiPutovanja")]
    public async Task<List<Putovanje>> PreuzmiPutovanje() =>
        await _putovanjeService.PreuzmiPutovanja();

    [HttpGet("PreuzmiPutovanje{id:length(24)}")]
    public async Task<ActionResult<Putovanje>> PreuzmiPutovanje(string id)
    {
        var putovanje = await _putovanjeService.PreuzmiPutovanje(id);

        if (putovanje is null)
        {
            return NotFound();
        }

        return putovanje;
    }

    [HttpGet("PreuzmiPutovanjaAgencije/{id}")]
    public async Task<ActionResult<List<Putovanje>>> PreuzmiPutovanjaAgencije(string id)
    {
        var putovanjaAgencije = await _putovanjeService.PreuzmiPutovanjaAgencije(id);

        if (putovanjaAgencije == null)
        {
            return NotFound();
        }

        return putovanjaAgencije;
    }

    [HttpPost("DodajPutovanjeAgenciji/{id}")]
    public async Task<IActionResult> DodajPutovanjeAgenciji(string id, [FromBody] Putovanje putovanje)
    {
        await _putovanjeService.DodajPutovanjeAgenciji(putovanje, id);

        return Ok(new { Message = "Putovanje za agenciju je uspešno dodato." });
    }

    [HttpPut("AzurirajPutovanje{id:length(24)}")]
    public async Task<IActionResult> AzurirajPutovanje(string id, Putovanje azurirajPutovanje)
    {
        var putovanje = await _putovanjeService.PreuzmiPutovanje(id);

        if (putovanje is null)
        {
            return NotFound();
        }

        azurirajPutovanje.Id = putovanje.Id;
        azurirajPutovanje.Agencija = putovanje.Agencija;
        azurirajPutovanje.Aktivnosti = putovanje.Aktivnosti;
        azurirajPutovanje.Recenzije = putovanje.Recenzije;

        await _putovanjeService.AzurirajPutovanje(id, azurirajPutovanje);

        return NoContent();
    }

    [HttpDelete("ObrisiPutovanje{id:length(24)}")]
    public async Task<IActionResult> ObrisiPutovanje(string id)
    {
        var putovanje = await _putovanjeService.PreuzmiPutovanje(id);

        if (putovanje is null)
        {
            return NotFound();
        }

        await _putovanjeService.ObrisiPutovanje(id);

        return NoContent();
    }
}
