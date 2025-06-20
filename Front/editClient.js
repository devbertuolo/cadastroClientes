document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("editClienteForm");

    // 1. Pega o ID do cliente da URL
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('id');

    if (!clientId) {
        alert("ID do cliente não encontrado na URL.");
        window.location.href = "getClient.html"; // Volta para a lista se não houver ID
        return;
    }

    // 2. Busca os dados do cliente específico para preencher o formulário
    async function loadClientData() {
        try {
            const response = await fetch(`http://localhost:5222/Clientes/${clientId}`);
            if (!response.ok) {
                throw new Error("Cliente não encontrado.");
            }
            const cliente = await response.json();
            
            // Preenche o formulário com os dados recebidos
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('cpf').value = cliente.documento;
            document.getElementById('email').value = cliente.email;
            document.getElementById('telefone').value = cliente.telefone;
            document.querySelector(`input[name="sexo"][value="${cliente.sexo}"]`).checked = true;
            
            if (cliente.dataNascimento) {
                const date = new Date(cliente.dataNascimento);
                document.getElementById('data_nascimento').value = date.toISOString().split('T')[0];
            }
            
            document.getElementById('endereco').value = cliente.endereco;
            document.getElementById('cep').value = cliente.cep;
            document.getElementById('cidade').value = cliente.cidade;
            document.getElementById('estado').value = cliente.estado;

        } catch (error) {
            console.error("Erro ao carregar dados do cliente:", error);
            alert(error.message);
            window.location.href = "getClient.html";
        }
    }

    // 3. Adiciona listener para o envio do formulário (salvar as alterações)
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Coleta os dados atualizados do formulário
        const updatedCliente = {
            id: parseInt(clientId),
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
            // Envia os dados para o endpoint PUT da API
            const response = await fetch(`http://localhost:5222/Clientes/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCliente),
            });

            if (response.ok) {
                alert("Cliente atualizado com sucesso!");
                window.location.href = "getClient.html"; // Volta para a lista de clientes
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar cliente: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro:", error);
            alert(error.message);
        }
    });

    // --- CARGA INICIAL ---
    loadClientData();
});