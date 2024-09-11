using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TuristickiHub.Services;

public class AuthService
{
    private readonly IMongoCollection<Korisnik> _korisniciCollection;
    private readonly IMongoCollection<Token> _tokeniCollection;

    public AuthService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
    {
        var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
        _korisniciCollection = mongoDatabase.GetCollection<Korisnik>(turistickiHubDatabaseSettings.Value.KorisniciCollectionName);
        _tokeniCollection = mongoDatabase.GetCollection<Token>(turistickiHubDatabaseSettings.Value.TokeniCollectionName);
    }

    //Korisnik
    public async Task<Korisnik> VratiKorisnikaAsync(string username) =>
        await _korisniciCollection.Find(x=>x.Username == username).FirstOrDefaultAsync();

    public async Task<Korisnik> VratiKorisnikaByIdAsync(string id) =>
        await _korisniciCollection.Find(x=>x.Id == id).FirstOrDefaultAsync();

    public async Task DodajKorisnikaAsync(Korisnik newKorisnik) =>
        await _korisniciCollection.InsertOneAsync(newKorisnik);

    public async Task AzurirajKorisnikaAsync(string username, Korisnik updatedKorisnik) =>
        await _korisniciCollection.ReplaceOneAsync(x=>x.Username == username, updatedKorisnik);

    public async Task ObrisiKorisnikaAsync(string username) =>
        await _korisniciCollection.DeleteOneAsync(x=>x.Username == username);

    
    //Token
    public async Task<Token> VratiTokenAsync(string username)
    {
        var nadjeniToken = await _tokeniCollection.Find(x=>x.UsernameKorisnika == username).FirstOrDefaultAsync();
        if(nadjeniToken==null)
            return null;
        if(nadjeniToken.VremeIsticanja.CompareTo(DateTime.Now)<=0)
        {
            await _tokeniCollection.DeleteOneAsync(x=>x.TokenString == nadjeniToken.TokenString);
            return null;
        }
        return nadjeniToken;
    }      

    public async Task DodajTokenAsync(Token newToken) =>
        await _tokeniCollection.InsertOneAsync(newToken);

    public async Task ObrisiTokenAsync(string token) =>
        await _tokeniCollection.DeleteOneAsync(x=>x.TokenString == token);

    public async Task<Token> VratiTokenByStringAsync(string token)
    {
        var nadjeniToken = await _tokeniCollection.Find(x=>x.TokenString == token).FirstOrDefaultAsync();
        if(nadjeniToken==null)
            return null;
        if(nadjeniToken.VremeIsticanja.CompareTo(DateTime.Now)<=0)
        {
            await _tokeniCollection.DeleteOneAsync(x=>x.TokenString == nadjeniToken.TokenString);
            return null;
        }
        return nadjeniToken;
    }   
}