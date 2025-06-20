document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("editClienteForm");
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const spinner = document.getElementById("spinner-overlay");

    const cepMask = IMask(cepInput, { mask: '00000-000' });
    const cpfMask = IMask(cpfInput, { mask: '000.000.000-00' });
    const telefoneMask = IMask(telefoneInput, {
        mask: [
            { mask: '(00) 0000-0000' },
            { mask: '(00) 0 0000-0000' }
        ]
    });

    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('id');

    if (!clientId) {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'ID do cliente não encontrado na URL.' })
            .then(() => { window.location.href = "getClient.html"; });
        return;
    }

    async function loadClientData() {
        spinner.style.display = "flex";
        try {
            const response = await fetch(`http://localhost:5222/Clientes/${clientId}`);
            if (!response.ok) { throw new Error("Cliente não encontrado."); }
            const cliente = await response.json();
            
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
            Swal.fire({ icon: 'error', title: 'Erro ao Carregar', text: error.message })
                .then(() => { window.location.href = "getClient.html"; });
        } finally {
            spinner.style.display = "none";
        }
    }

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
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

        spinner.style.display = "flex";
        try {
            const response = await fetch(`http://localhost:5222/Clientes/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCliente),
            });

            if (response.ok) {
                await Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Cliente atualizado com sucesso!' });
                window.location.href = "getClient.html";
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar cliente: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire({ icon: 'error', title: 'Erro na Atualização', text: error.message });
        } finally {
            spinner.style.display = "none";
        }
    });

    loadClientData();
});