using TuristickiHub.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TuristickiHub.Services
{
    public class RezervacijaService
    {
        private readonly IMongoCollection<Rezervacija> _rezervacijaCollection;
        private readonly IMongoCollection<Smestaj> _smestajCollection;

        public RezervacijaService(IOptions<TuristickiHubDatabaseSettings> turistickiHubDatabaseSettings)
        {
            var mongoClient = new MongoClient(turistickiHubDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(turistickiHubDatabaseSettings.Value.DatabaseName);
            _rezervacijaCollection = mongoDatabase.GetCollection<Rezervacija>(turistickiHubDatabaseSettings.Value.RezervacijaCollectionName);
        }

        public async Task<List<Rezervacija>> PreuzmiRezervacije() =>
            await _rezervacijaCollection.Find(_ => true).ToListAsync();

        public async Task<Rezervacija> PreuzmiRezervaciju(string id) =>
            await _rezervacijaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Rezervacija>> PreuzmiRezervacijeSmestaja(string smestajId)
        {
            return await _rezervacijaCollection.Find(p => p.Smestaj.Id == smestajId).ToListAsync();
        }

        public async Task DodajRezervacijuUSmestaj(Rezervacija rezervacija, string smestajId)
        {
            rezervacija.Smestaj = new Smestaj { Id = smestajId };
            await _rezervacijaCollection.InsertOneAsync(rezervacija);
        }

        public async Task AzurirajRezervaciju(string id, Rezervacija rezervacija) =>
            await _rezervacijaCollection.ReplaceOneAsync(x => x.Id == id, rezervacija);

        public async Task ObrisiRezervaciju(string id) =>
            await _rezervacijaCollection.DeleteOneAsync(x => x.Id == id);
    }
}
