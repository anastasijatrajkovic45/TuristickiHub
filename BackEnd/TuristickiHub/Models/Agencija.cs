using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Agencija
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Naziv { get; set; }
    public string Adresa { get; set; }
    public string Grad { get; set; }
    public string Email { get; set; }
    public string BrojTelefona { get; set; }

    public List<Putovanje> Putovanje { get; set; }
}