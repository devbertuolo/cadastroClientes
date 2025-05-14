using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options => options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

using var db = new databaseContext();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirOrigem", policy =>
    {
        policy
            .AllowAnyOrigin() 
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("PermitirOrigem");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/Clientes", () =>
{
    var clientes = db.Clientes
        .ToList()
        .ToArray();
    return clientes;
})
.WithName("GetClientes");

app.MapGet("/Clientes/{id:int}", async (int id) =>
{
    var cliente = await db.Clientes.FindAsync(id);

    if (cliente is not null)
    {
        return Results.Ok(cliente);
    }

    return Results.NotFound();
})
.WithName("GetClienteById");

app.MapPost("/AddCliente/", async (Cliente cliente) =>
{
   db.Clientes.Add(cliente);
   await db.SaveChangesAsync();

    return Results.Created($"/clientes/{cliente.Id}", cliente);
});


 app.MapDelete("/DelClientes/{id:int}", async (int id) =>
 {
    var cliente = await db.Clientes.FindAsync(id);

    if (cliente is not null)
    {
        db.Clientes.Remove(cliente);
        await db.SaveChangesAsync();
     }

     return Results.NoContent();

 });

app.Run();
