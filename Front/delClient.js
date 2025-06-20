document.addEventListener("DOMContentLoaded", function() {
    // --- ELEMENTOS DO DOM ---
    const searchForm = document.getElementById("search-form");
    const idInput = document.getElementById("id-input");
    const resultContainer = document.getElementById("result-container");
    const clientDataBody = document.getElementById("cliente-data-body");
    const deleteButton = document.getElementById("delete-button");
    const resetButton = document.getElementById("reset-button");

    // --- VARIÁVEL DE ESTADO ---
    let currentClientId = null;

    // --- FUNÇÕES ---

    /**
     * Reseta a página para o estado inicial.
     */
    function resetPage() {
        resultContainer.classList.add("hidden"); // Esconde a área de resultados
        clientDataBody.innerHTML = ""; // Limpa a tabela
        searchForm.reset(); // Limpa o campo de busca
        currentClientId = null; // Reseta o ID do cliente em memória
    }

    /**
     * Exibe os dados de um cliente na tabela.
     * @param {object} cliente - O objeto do cliente a ser exibido.
     */
    function displayClientData(cliente) {
        clientDataBody.innerHTML = ""; // Limpa qualquer dado anterior
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cliente.id || ""}</td>
            <td>${cliente.nome || ""}</td>
            <td>${cliente.documento || ""}</td>
            <td>${cliente.email || ""}</td>
            <td>${cliente.telefone || ""}</td>
            <td>${cliente.sexo || ""}</td>
            <td>${cliente.dataNascimento ? new Date(cliente.dataNascimento).toLocaleDateString() : ""}</td>
            <td>${cliente.endereco || ""}</td>
            <td>${cliente.cidade || ""}</td>
            <td>${cliente.estado || ""}</td>
            <td>${cliente.cep || ""}</td>
        `;
        clientDataBody.appendChild(row);
        resultContainer.classList.remove("hidden"); // Mostra a área de resultados
    }

    // --- EVENT LISTENERS ---

    // 1. Ao submeter o formulário de busca
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const id = idInput.value;
        if (!id) {
            alert("Por favor, insira um ID.");
            return;
        }

        // Reseta a visualização antes de uma nova busca
        resetPage();

        try {
            const response = await fetch(`http://localhost:5222/Clientes/${id}`);
            
            if (response.ok) {
                const cliente = await response.json();
                currentClientId = cliente.id; // Guarda o ID do cliente encontrado
                displayClientData(cliente); // Mostra os dados na tela
            } else {
                alert("Cliente não encontrado com o ID informado.");
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            alert("Falha na comunicação com a API.");
        }
    });

    // 2. Ao clicar no botão "Deletar"
    deleteButton.addEventListener("click", async function() {
        if (!currentClientId) {
            alert("Nenhum cliente selecionado para deletar.");
            return;
        }

        // Confirmação de segurança
        if (!confirm(`Tem certeza que deseja deletar o cliente ID: ${currentClientId}? Esta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5222/DelClientes/${currentClientId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Cliente deletado com sucesso!");
                resetPage(); // Limpa a tela após o sucesso
            } else {
                alert("Erro ao tentar deletar o cliente.");
            }
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            alert("Falha na comunicação com a API.");
        }
    });

    // 3. Ao clicar no botão "Voltar"
    resetButton.addEventListener("click", function() {
        resetPage();
    });
});