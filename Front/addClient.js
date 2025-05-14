document.getElementById("addClienteForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const cliente = {
    nome: document.getElementById("nome").value,
    documento: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    sexo: document.querySelector('input[name="sexo"]:checked').value,
    dataNascimento: document.getElementById("data_nascimento").value,
    endereco: document.getElementById("endereco").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    cep: document.getElementById("cep").value,
  };

  try {
    console.log("Dados do cliente:");
    // Envia os dados para a API
    const response = await fetch("http://localhost:5222/AddCliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente), 
    });

    console.log("Resposta da API:", response);

  if (response.ok) {
    alert("Cliente cadastrado com sucesso!");
    document.getElementById("addClienteForm").reset();
  } else {
    const errorText = await response.text();
    console.error("Erro ao cadastrar cliente:", errorText);
    alert("Erro ao cadastrar cliente.");
  }
} catch (error) {
  console.error("Erro:", error);
  alert("Erro ao conectar com a API.");
}
});