using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class Cliente
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Documento { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Sexo { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? CEP { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.Now;
}