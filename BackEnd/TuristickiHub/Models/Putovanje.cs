using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TuristickiHub.Models;

public class Putovanje
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Slika { get; set; }
    public string Mesto { get; set; }
    public int BrojNocenja { get; set; }
    public string Prevoz { get; set; }
    public int Cena { get; set; }

    public Agencija Agencija { get; set; }
    public List<Aktivnost> Aktivnosti { get; set; }
    public List<Recenzija> Recenzije { get; set; }
    public List<Smestaj> Smestaji { get; set; }
}
