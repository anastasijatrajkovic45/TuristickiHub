using TuristickiHub.Models;
using TuristickiHub.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<TuristickiHubDatabaseSettings>(
    builder.Configuration.GetSection("TuristickiHubDatabase"));

builder.Services.AddSingleton<AgencijaService>();
builder.Services.AddSingleton<PutovanjeService>();
builder.Services.AddSingleton<AktivnostService>();
builder.Services.AddSingleton<RecenzijaService>();
builder.Services.AddSingleton<RezervacijaService>();
builder.Services.AddSingleton<SmestajService>();
builder.Services.AddSingleton<AuthService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsPolicyBuilder =>
    {
        corsPolicyBuilder.AllowAnyOrigin();
        corsPolicyBuilder.AllowAnyHeader();
        corsPolicyBuilder.AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();