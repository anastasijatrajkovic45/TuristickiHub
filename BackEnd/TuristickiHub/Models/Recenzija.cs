using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Recenzija
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Korisnik { get; set; }
    public string Komentar { get; set; }
    public int Ocena { get; set; }

    public Putovanje Putovanje { get; set; }
}
