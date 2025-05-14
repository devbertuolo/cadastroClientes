using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class databaseContext : DbContext
{
    public DbSet<Cliente> Clientes { get; set; }
    public databaseContext()
    {
        
    }
        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Cliente>().HasKey(c => c.Id);
        }
    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlServer("Server=NITRO-STILFLER;Database=Db_CadastroClientes;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");
}