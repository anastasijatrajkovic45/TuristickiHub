using TuristickiHub.Models;
using TuristickiHub.Services;
using Microsoft.AspNetCore.Mvc;
using Isopoh.Cryptography.Argon2;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace TuristickiHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly AgencijaService _agencijaService;
    public AuthController(AuthService authService, AgencijaService agencijaService)
    {
        _authService = authService;
        _agencijaService=agencijaService;
    }

    // [HttpPost("Register")]
    // public async Task<IActionResult> Register(Korisnik newKorisnik)
    // {
    //     Korisnik k = await _authService.VratiKorisnikaAsync(newKorisnik.Username);
    //     if(k!=null)
    //     {
    //         return BadRequest("Korisnik sa tim korisnickim imenom vec postoji.");
    //     }      
    //     var passwordHash = Argon2.Hash(newKorisnik.Password);
    //     newKorisnik.Password = passwordHash;
    //     await _authService.DodajKorisnikaAsync(newKorisnik);

    //     return Ok(); 
    // }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] Korisnik newKorisnik)
    {
        Korisnik k = await _authService.VratiKorisnikaAsync(newKorisnik.Username);
        if(k != null)
        {
            return BadRequest("Korisnik sa tim korisnickim imenom vec postoji.");
        }      

        var passwordHash = Argon2.Hash(newKorisnik.Password);
        newKorisnik.Password = passwordHash;

        // Ako korisnik nije admin, postavi ID odabrane agencije na null
        if (!newKorisnik.IsAdmin)
        {
            if (string.IsNullOrEmpty(newKorisnik.ZaduzenaAgencijaId))
            {
                return BadRequest("Morate izabrati agenciju.");
            }
        }

        await _authService.DodajKorisnikaAsync(newKorisnik);

        return Ok(); 
    }



    [HttpPost("Login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _authService.VratiKorisnikaAsync(username);
        if(user==null)
        {
            return BadRequest("Korisnicko ime ili lozinka koje ste uneli nije tacna.");
        }
        if(Argon2.Verify(user.Password, password))
        {
            Token token = new(username);
            await _authService.DodajTokenAsync(token);
            
            var response = new
            {
                Token = token.TokenString,
                User = new {
                    id = user.Id,
                    ime = user.Ime,
                    prezime = user.Prezime,
                    email = user.Email,
                    username = user.Username,
                    isAdmin = user.IsAdmin,
                }
            };

            return Ok(response);
        }
        return BadRequest("Korisnicko ime ili lozinka koje ste uneli nije tacna.");
    }

    [HttpDelete("ObrisiNalog")]
    public async Task<IActionResult> ObrisiNalog(string username)
    {
        var korisnik = await _authService.VratiKorisnikaAsync(username);

        if(korisnik is null)
        {
            return NotFound();
        }

        await _authService.ObrisiTokenAsync(username);
        await _authService.ObrisiKorisnikaAsync(username);
        
        return NoContent();
    }
    
    [HttpDelete("Logout")]
    public async Task<IActionResult> Logout(string token)
    {
        if(token!=null)
        {
            await _authService.ObrisiTokenAsync(token);
            return Ok("Uspesno ste se izlogovoali.");
        }
        return BadRequest();
    }

    [HttpGet("GetKorisnikByToken")]
    public async Task<ActionResult<Korisnik>> GetKorisnikByToken(string token)
    {
        var userToken = await _authService.VratiTokenByStringAsync(token);
        var username = userToken.UsernameKorisnika;
        var korisnik = await _authService.VratiKorisnikaAsync(username);
        if(korisnik!=null)
            return Ok(korisnik);
        return BadRequest("Greska!");
    }

    [HttpGet("GetAgencijaKorisnika")]
    public async Task<ActionResult<Korisnik>> GetAgencijaKorisnika(string token)
    {
        var userToken = await _authService.VratiTokenByStringAsync(token);
        var username = userToken.UsernameKorisnika;
        var korisnik = await _authService.VratiKorisnikaAsync(username);
        if(korisnik!=null)
            return Ok(korisnik.ZaduzenaAgencijaId);
        return BadRequest("Greska!");
    }

    [HttpGet("PreuzmiAgencijuKorisnika")]
    public async Task<ActionResult<Agencija>> PreuzmiAgencijuKorisnika(string token)
    {
        var userToken = await _authService.VratiTokenByStringAsync(token);
        var username = userToken?.UsernameKorisnika;

        if (string.IsNullOrEmpty(username))
        {
            return BadRequest("Korisnik nije pronađen.");
        }

        var korisnik = await _authService.VratiKorisnikaAsync(username);
        var agencijaId = korisnik?.ZaduzenaAgencijaId;

        if (string.IsNullOrEmpty(agencijaId))
        {
            return BadRequest("Korisnik nije zadužen za agenciju.");
        }

        var agencija = await _agencijaService.PreuzmiAgenciju(agencijaId);

        if (agencija == null)
        {
            return BadRequest("Agencija nije pronađena.");
        }

        return Ok(agencija);
    }

    [HttpPut("AzurirajKorisnika")]
    public async Task<IActionResult> AzurirajKorisnika(string username, Korisnik updatedKorisnik)
    {
        var korisnik = await _authService.VratiKorisnikaAsync(username);
        if(korisnik is null)
        {
            return NotFound();
        }

        updatedKorisnik.Username = korisnik.Username;
        var passwordHash = Argon2.Hash(updatedKorisnik.Password);
        updatedKorisnik.Password = passwordHash;

        await _authService.AzurirajKorisnikaAsync(username, updatedKorisnik);

        return NoContent();
    }
}