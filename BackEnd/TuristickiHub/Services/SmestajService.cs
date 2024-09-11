using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TuristickiHub.Services
{
    public class SmestajService
    {
        private readonly IMongoCollection<Smestaj> _smestajCollection;
        private readonly IMongoCollection<Putovanje> _putovanjeCollection;

        public SmestajService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
        {
            var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
            _smestajCollection = mongoDatabase.GetCollection<Smestaj>(turistickiHubDatabaseSettings.Value.SmestajCollectionName);
        }

        public async Task<List<Smestaj>> PreuzmiSmestaje() =>
            await _smestajCollection.Find(_ => true).ToListAsync();

        public async Task<Smestaj> PreuzmiSmestaj(string id) =>
            await _smestajCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Smestaj>> PreuzmiSmestajeNaPutovanju(string putovanjeId)
        {
            return await _smestajCollection.Find(p => p.Putovanje.Id == putovanjeId).ToListAsync();
        }

        public async Task DodajSmestajPutovanju(Smestaj smestaj, string putovanjeId)
        {
            smestaj.Putovanje = new Putovanje { Id = putovanjeId };
            await _smestajCollection.InsertOneAsync(smestaj);
        }

        public async Task AzurirajSmestaj(string id, Smestaj smestaj) =>
            await _smestajCollection.ReplaceOneAsync(x => x.Id == id, smestaj);

        public async Task ObrisiSmestaj(string id) =>
            await _smestajCollection.DeleteOneAsync(x => x.Id == id);
    }
}
