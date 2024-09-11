using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TuristickiHub.Services
{
    public class RecenzijaService
    {
        private readonly IMongoCollection<Recenzija> _recenzijaCollection;
        private readonly IMongoCollection<Putovanje> _putovanjeCollection;

        public RecenzijaService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
        {
            var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
            _recenzijaCollection = mongoDatabase.GetCollection<Recenzija>(turistickiHubDatabaseSettings.Value.RecenzijaCollectionName);
        }

        public async Task<List<Recenzija>> PreuzmiRecenzije() =>
            await _recenzijaCollection.Find(_ => true).ToListAsync();

        public async Task<Recenzija> PreuzmiRecenziju(string id) =>
            await _recenzijaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Recenzija>> PreuzmiRecenzijeNaPutovanju(string putovanjeId)
        {
            return await _recenzijaCollection.Find(p => p.Putovanje.Id == putovanjeId).ToListAsync();
        }

        public async Task DodajRecenzijuPutovanju(Recenzija recenzija, string putovanjeId)
        {
            recenzija.Putovanje = new Putovanje { Id = putovanjeId };
            await _recenzijaCollection.InsertOneAsync(recenzija);
        }

        public async Task AzurirajRecenziju(string id, Recenzija recenzija) =>
            await _recenzijaCollection.ReplaceOneAsync(x => x.Id == id, recenzija);

        public async Task ObrisiRecenziju(string id) =>
            await _recenzijaCollection.DeleteOneAsync(x => x.Id == id);
    }
}
