document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("search-form");
    const idInput = document.getElementById("id-input");
    const resultContainer = document.getElementById("result-container");
    const clientDataBody = document.getElementById("cliente-data-body");
    const deleteButton = document.getElementById("delete-button");
    const resetButton = document.getElementById("reset-button");
    const spinner = document.getElementById("spinner-overlay");

    let currentClientId = null;

    function resetPage() {
        resultContainer.classList.add("hidden");
        clientDataBody.innerHTML = "";
        searchForm.reset();
        currentClientId = null;
    }

    function displayClientData(cliente) {
        clientDataBody.innerHTML = "";
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
        resultContainer.classList.remove("hidden");
    }

    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const id = idInput.value;
        if (!id) {
            Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Por favor, insira um ID.' });
            return;
        }
        resetPage();
        spinner.style.display = "flex";
        try {
            const response = await fetch(`http://localhost:5222/Clientes/${id}`);
            if (response.ok) {
                const cliente = await response.json();
                currentClientId = cliente.id;
                displayClientData(cliente);
            } else {
                Swal.fire({ icon: 'error', title: 'Não Encontrado', text: 'Cliente não encontrado com o ID informado.' });
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            Swal.fire({ icon: 'error', title: 'Erro de Conexão', text: 'Falha na comunicação com a API.' });
        } finally {
            spinner.style.display = "none";
        }
    });

    deleteButton.addEventListener("click", function() {
        if (!currentClientId) {
            Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Nenhum cliente selecionado para deletar.' });
            return;
        }

        Swal.fire({
            title: 'Você tem certeza?',
            text: `Deseja realmente deletar o cliente ID: ${currentClientId}? Esta ação não pode ser desfeita.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                spinner.style.display = "flex";
                try {
                    const response = await fetch(`http://localhost:5222/DelClientes/${currentClientId}`, { method: "DELETE" });
                    if (response.ok) {
                        Swal.fire('Deletado!', 'O cliente foi removido com sucesso.', 'success');
                        resetPage();
                    } else {
                        Swal.fire('Erro!', 'Ocorreu um erro ao tentar deletar o cliente.', 'error');
                    }
                } catch (error) {
                    console.error("Erro ao deletar cliente:", error);
                    Swal.fire('Erro!', 'Falha na comunicação com a API.', 'error');
                } finally {
                    spinner.style.display = "none";
                }
            }
        });
    });

    resetButton.addEventListener("click", function() {
        resetPage();
    });
});