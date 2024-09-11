using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TuristickiHub.Services
{
    public class AktivnostService
    {
        private readonly IMongoCollection<Aktivnost> _aktivnostCollection;
        private readonly IMongoCollection<Putovanje> _putovanjeCollection;

        public AktivnostService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
        {
            var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
            _aktivnostCollection = mongoDatabase.GetCollection<Aktivnost>(turistickiHubDatabaseSettings.Value.AktivnostCollectionName);
        }

        public async Task<List<Aktivnost>> PreuzmiAktivnosti() =>
            await _aktivnostCollection.Find(_ => true).ToListAsync();

        public async Task<Aktivnost> PreuzmiAktivnost(string id) =>
            await _aktivnostCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Aktivnost>> PreuzmiAktivnostiNaPutovanju(string putovanjeId)
        {
            return await _aktivnostCollection.Find(p => p.Putovanje.Id == putovanjeId).ToListAsync();
        }

        public async Task DodajAktivnostPutovanju(Aktivnost aktivnost, string putovanjeId)
        {
            aktivnost.Putovanje = new Putovanje { Id = putovanjeId };
            await _aktivnostCollection.InsertOneAsync(aktivnost);
        }

        public async Task AzurirajAktivnost(string id, Aktivnost aktivnost) =>
            await _aktivnostCollection.ReplaceOneAsync(x => x.Id == id, aktivnost);

        public async Task ObrisiAktivnost(string id) =>
            await _aktivnostCollection.DeleteOneAsync(x => x.Id == id);
    }
}
