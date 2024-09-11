using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Rezervacija
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Ime { get; set; }
    public string Prezime { get; set; }
    public int BrojPasosa { get; set;  }
    public string BrojTelefona { get; set; }
    public int BrojOsoba { get; set; }
    public string Email { get; set; }

    public Smestaj Smestaj { get; set; }
}
