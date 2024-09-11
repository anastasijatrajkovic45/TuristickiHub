using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Smestaj
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public List<string> Slike { get; set; }
    public string Naziv { get; set; }
    public int CenaSmestaja { get; set; }
    public int UdaljenostCentra { get; set; }

    public Putovanje Putovanje { get; set; }
    public List<Rezervacija> Rezervacije { get; set; }
}
