document.getElementById("searchClienteForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const id = document.getElementById("id").value;

    try {
        const response = await fetch(`http://localhost:5222/Clientes/${id}`, {
            method: "GET",
        });

        if (response.ok) {
            const cliente = await response.json();

            // Preenche a tabela com os dados do cliente
            const tbody = document.getElementById("clienteTableBody");
            tbody.innerHTML = `
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

            // Mostra a tabela com os dados do cliente
            document.getElementById("clienteInfo").style.display = "block";
        } else {
            alert("Cliente não encontrado. Verifique o ID.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com a API.");
    }
});

document.getElementById("deleteButton").addEventListener("click", async function () {
    const id = document.getElementById("id").value;

    try {
        const response = await fetch(`http://localhost:5222/DelClientes/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Cliente deletado com sucesso!");
            resetPage(); // Reseta a página após deletar
        } else {
            alert("Erro ao deletar cliente. Verifique se o ID é válido.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com a API.");
    }
});

document.getElementById("resetButton").addEventListener("click", function () {
    resetPage(); // Reseta a página ao clicar no botão "Voltar"
});

function resetPage() {
    document.getElementById("searchClienteForm").reset(); // Reseta o formulário
    document.getElementById("clienteInfo").style.display = "none"; // Esconde os dados do cliente
    document.getElementById("clienteTableBody").innerHTML = ""; // Limpa a tabela
}