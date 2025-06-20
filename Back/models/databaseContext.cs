using Microsoft.EntityFrameworkCore;

public class databaseContext : DbContext
{
    public databaseContext(DbContextOptions<databaseContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Cliente>().HasKey(c => c.Id);
    }
}