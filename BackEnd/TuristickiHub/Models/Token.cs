using System.Security.Cryptography;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TuristickiHub.Models;

public class Token
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    [BsonElement("Name")]
    public string TokenString { get; set; }
    public string UsernameKorisnika { get; set; }
    public DateTime VremeIsticanja { get; set; }

    public Token(string username)
    {
        UsernameKorisnika = username;
        TokenString = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        DateTime now = DateTime.Now;
        VremeIsticanja = now.AddHours(2);
    }
}