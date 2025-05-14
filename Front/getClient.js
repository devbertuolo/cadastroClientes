document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:5222/Clientes", {
      method: "GET",
    });

    if (response.ok) {
      const clientes = await response.json();

      // Cria a tabela dinamicamente
      let tabela = `
        <table border="1" style="width: 95%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Sexo</th>
              <th>Data de Nascimento</th>
              <th>Endereço</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>CEP</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Adiciona uma linha para cada cliente
      clientes.forEach(cliente => {
        tabela += `
          <tr>
            <td>${cliente.id || "Não informado"}</td>
            <td>${cliente.nome || "Não informado"}</td>
            <td>${cliente.documento || "Não informado"}</td>
            <td>${cliente.email || "Não informado"}</td>
            <td>${cliente.telefone || "Não informado"}</td>
            <td>${cliente.sexo || "Não informado"}</td>
            <td>${cliente.dataNascimento || "Não informado"}</td>
            <td>${cliente.endereco || "Não informado"}</td>
            <td>${cliente.cidade || "Não informado"}</td>
            <td>${cliente.estado || "Não informado"}</td>
            <td>${cliente.cep || "Não informado"}</td>
          </tr>
        `;
      });

      tabela += `
          </tbody>
        </table>
      `;

      // Exibe a tabela no elemento com ID "clienteInfo"
      document.getElementById("clienteInfo").innerHTML = tabela;
    } else {
      document.getElementById("clienteInfo").innerHTML = `<p>Nenhum cliente encontrado.</p>`;
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("clienteInfo").innerHTML = `<p>Erro ao conectar com a API.</p>`;
  }
});