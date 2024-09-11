namespace TuristickiHub.Models;

public class TuristickiHubDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string AgencijaCollectionName { get; set; }
    public string PutovanjeCollectionName { get; set; }
    public string AktivnostCollectionName { get; set; }
    public string RecenzijaCollectionName { get; set; }
    public string RezervacijaCollectionName { get; set; }
    public string SmestajCollectionName { get; set; }
    public string KorisniciCollectionName { get; set; } = null;
    public string TokeniCollectionName { get; set; } = null;
}