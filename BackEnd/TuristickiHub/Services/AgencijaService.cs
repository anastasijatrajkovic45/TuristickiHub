using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TuristickiHub.Services;

public class AgencijaService
{
    private readonly IMongoCollection<Agencija> _agencijaCollection;

    public AgencijaService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
    {
        var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
        _agencijaCollection = mongoDatabase.GetCollection<Agencija>(turistickiHubDatabaseSettings.Value.AgencijaCollectionName);
    }

    public async Task<List<Agencija>> PreuzmiAgencije() =>
        await _agencijaCollection.Find(_ => true).ToListAsync();

    public async Task<Agencija> PreuzmiAgenciju(string id) =>
        await _agencijaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task DodajAgenciju(Agencija agencija) =>
        await _agencijaCollection.InsertOneAsync(agencija);

    public async Task AzurirajAgenciju(string id, Agencija agencija) =>
        await _agencijaCollection.ReplaceOneAsync(x => x.Id == id, agencija);

    public async Task ObrisiAgenciju(string id) =>
        await _agencijaCollection.DeleteOneAsync(x => x.Id == id);
}
