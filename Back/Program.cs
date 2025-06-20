using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<databaseContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options => options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/Clientes", (databaseContext db) =>
{
    var clientes = db.Clientes
        .ToList()
        .ToArray();
    return clientes;
})
.WithName("GetClientes");

app.MapGet("/Clientes/{id:int}", async (int id, databaseContext db) =>
{
    var cliente = await db.Clientes.FindAsync(id);

    if (cliente is not null)
    {
        return Results.Ok(cliente);
    }

    return Results.NotFound();
})
.WithName("GetClienteById");

app.MapPost("/AddCliente/", async (Cliente cliente, databaseContext db) =>
{
    db.Clientes.Add(cliente);
    await db.SaveChangesAsync();

    return Results.Created($"/clientes/{cliente.Id}", cliente);
});

app.MapDelete("/DelClientes/{id:int}", async (int id, databaseContext db) =>
{
    var cliente = await db.Clientes.FindAsync(id);

    if (cliente is not null)
    {
        db.Clientes.Remove(cliente);
        await db.SaveChangesAsync();
    }

    return Results.NoContent();
});

app.MapPut("/Clientes/{id:int}", async (int id, Cliente updatedCliente, databaseContext db) =>
{
    var cliente = await db.Clientes.FindAsync(id);

    if (cliente is null)
    {
        return Results.NotFound();
    }

    cliente.Nome = updatedCliente.Nome;
    cliente.Documento = updatedCliente.Documento;
    cliente.Email = updatedCliente.Email;
    cliente.Telefone = updatedCliente.Telefone;
    cliente.Sexo = updatedCliente.Sexo;
    cliente.DataNascimento = updatedCliente.DataNascimento;
    cliente.Endereco = updatedCliente.Endereco;
    cliente.Cidade = updatedCliente.Cidade;
    cliente.Estado = updatedCliente.Estado;
    cliente.Cep = updatedCliente.Cep;

    await db.SaveChangesAsync();

    return Results.Ok(cliente);
});

app.MapPost("/AddClientesEmLote", async (List<Cliente> novosClientes, databaseContext db) =>
{
    if (novosClientes == null || !novosClientes.Any())
    {
        return Results.BadRequest("A lista de clientes não pode ser vazia.");
    }

    await db.Clientes.AddRangeAsync(novosClientes);

    await db.SaveChangesAsync();

    return Results.Ok($"{novosClientes.Count} clientes foram cadastrados com sucesso.");
});

app.Run();