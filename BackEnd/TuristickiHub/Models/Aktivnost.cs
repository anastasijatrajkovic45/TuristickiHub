using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Aktivnost
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Naziv { get; set; }
    public int Cena { get; set; }

    public Putovanje Putovanje { get; set; }
}
