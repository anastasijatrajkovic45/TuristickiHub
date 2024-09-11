using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TuristickiHub.Services
{
    public class PutovanjeService
    {
        private readonly IMongoCollection<Putovanje> _putovanjeCollection;
        private readonly IMongoCollection<Agencija> _agencijaCollection;

        public PutovanjeService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
        {
            var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
            _putovanjeCollection = mongoDatabase.GetCollection<Putovanje>(turistickiHubDatabaseSettings.Value.PutovanjeCollectionName);
        }

        public async Task<List<Putovanje>> PreuzmiPutovanja() =>
            await _putovanjeCollection.Find(_ => true).ToListAsync();

        public async Task<Putovanje> PreuzmiPutovanje(string id) =>
            await _putovanjeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Putovanje>> PreuzmiPutovanjaAgencije(string agencijaId)
        {
            return await _putovanjeCollection.Find(p => p.Agencija.Id == agencijaId).ToListAsync();
        }

        public async Task DodajPutovanjeAgenciji(Putovanje putovanje, string agencijaId)
        {
            putovanje.Agencija = new Agencija { Id = agencijaId };
            await _putovanjeCollection.InsertOneAsync(putovanje);
        }

        public async Task AzurirajPutovanje(string id, Putovanje putovanje) =>
            await _putovanjeCollection.ReplaceOneAsync(x => x.Id == id, putovanje);

        public async Task ObrisiPutovanje(string id) =>
            await _putovanjeCollection.DeleteOneAsync(x => x.Id == id);
    }
}
