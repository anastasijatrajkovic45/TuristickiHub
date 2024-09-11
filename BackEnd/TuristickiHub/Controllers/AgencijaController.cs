using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgencijaController : ControllerBase
{
    private readonly AgencijaService _agencijaService;

    public AgencijaController(AgencijaService agencijaService) =>
        _agencijaService = agencijaService;

    [HttpGet("PreuzmiAgencije")]
    public async Task<List<Agencija>> PreuzmiAgencije() =>
        await _agencijaService.PreuzmiAgencije();

    [HttpGet("PreuzmiAgenciju{id:length(24)}")]
    public async Task<ActionResult<Agencija>> PreuzmiAgenciju(string id)
    {
        var agencija = await _agencijaService.PreuzmiAgenciju(id);

        if (agencija is null)
        {
            return NotFound();
        }

        return agencija;
    }

    [HttpPost("DodajAgenciju")]
    public async Task<IActionResult> DodajAgenciju(Agencija agencija)
    {
        await _agencijaService.DodajAgenciju(agencija);

        return CreatedAtAction(nameof(PreuzmiAgencije), new { id = agencija.Id }, agencija);
    }

    [HttpPut("AzurirajAgenciju{id:length(24)}")]
    public async Task<IActionResult> AzurirajAgenciju(string id, Agencija azurirajAgenciju)
    {
        var agencija = await _agencijaService.PreuzmiAgenciju(id);

        if (agencija is null)
        {
            return NotFound();
        }

        azurirajAgenciju.Id = agencija.Id;

        await _agencijaService.AzurirajAgenciju(id, azurirajAgenciju);

        return NoContent();
    }

    [HttpDelete("ObrisiAgenciju{id:length(24)}")]
    public async Task<IActionResult> ObrisiAgenciju(string id)
    {
        var agencija = await _agencijaService.PreuzmiAgenciju(id);

        if (agencija is null)
        {
            return NotFound();
        }

        await _agencijaService.ObrisiAgenciju(id);

        return NoContent();
    }
}
