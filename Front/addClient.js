document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addClienteForm");
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const bairroInput = document.getElementById("bairro");
    const cidadeSelect = document.getElementById("cidade-select");
    const estadoSelect = document.getElementById("estado-select");
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const spinner = document.getElementById("spinner-overlay");

    const cepMask = IMask(cepInput, { mask: '00000-000' });
    const cpfMask = IMask(cpfInput, { mask: '000.000.000-00' });
    const telefoneMask = IMask(telefoneInput, {
        mask: [
            { mask: '(00) 0000-0000' },
            { mask: '(00) 0 0000-0000' }
        ]
    });

    async function buscarCep(cep) {
        cep = cep.replace(/\D/g, ''); 
        if (cep.length !== 8) return;

        spinner.style.display = "flex";
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error("CEP não encontrado.");
            
            const data = await response.json();
            if (data.erro) {
                Swal.fire({ icon: 'error', title: 'CEP não encontrado', text: 'Por favor, verifique o CEP digitado.' });
                return;
            }

            enderecoInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            estadoSelect.value = data.uf;
            await carregarCidades(data.uf, false);
            cidadeSelect.value = data.localidade;
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            Swal.fire({ icon: 'error', title: 'Erro na Busca', text: error.message });
        } finally {
            spinner.style.display = "none";
        }
    }

    async function carregarEstados() {
        spinner.style.display = "flex";
        try {
            const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
            if (!response.ok) throw new Error("Não foi possível carregar os estados.");

            const estados = await response.json();
            estados.forEach(estado => {
                const option = document.createElement("option");
                option.value = estado.sigla;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar estados:", error);
            Swal.fire({ icon: 'error', title: 'Erro de Carga', text: 'Não foi possível carregar a lista de estados.' });
        } finally {
            spinner.style.display = "none";
        }
    }

    async function carregarCidades(uf, showSpinner = true) {
        if (!uf) {
            cidadeSelect.innerHTML = '<option value="">Aguardando Estado...</option>';
            cidadeSelect.disabled = true;
            return;
        }

        if(showSpinner) spinner.style.display = "flex";
        cidadeSelect.innerHTML = '<option value="">Carregando...</option>';
        cidadeSelect.disabled = true;

        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
            if (!response.ok) throw new Error("Não foi possível carregar as cidades.");

            const cidades = await response.json();
            cidadeSelect.innerHTML = '<option value="">Selecione uma Cidade</option>';
            cidades.forEach(cidade => {
                const option = document.createElement("option");
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                cidadeSelect.appendChild(option);
            });
            cidadeSelect.disabled = false;
        } catch (error) {
            console.error("Erro ao carregar cidades:", error);
            Swal.fire({ icon: 'error', title: 'Erro de Carga', text: 'Não foi possível carregar a lista de cidades.' });
            cidadeSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        } finally {
            if(showSpinner) spinner.style.display = "none";
        }
    }
    
    cepInput.addEventListener("blur", (e) => { buscarCep(e.target.value); });
    estadoSelect.addEventListener("change", (e) => { carregarCidades(e.target.value); });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const rua = enderecoInput.value.trim();
        const numero = document.getElementById("numero").value.trim();
        const bairro = bairroInput.value.trim();
        let enderecoCompleto = rua;
        if (numero) { enderecoCompleto += `, ${numero}`; }
        if (bairro) { enderecoCompleto += ` - ${bairro}`; }

        const cliente = {
            nome: document.getElementById("nome").value,
            documento: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            sexo: document.querySelector('input[name="sexo"]:checked').value,
            dataNascimento: document.getElementById("data_nascimento").value,
            endereco: enderecoCompleto,
            cidade: cidadeSelect.value,
            estado: estadoSelect.value,
            cep: cepInput.value,
        };

        spinner.style.display = "flex";
        try {
            const response = await fetch("http://localhost:5222/AddCliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente),
            });

            if (response.ok) {
                Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Cliente cadastrado com sucesso!', timer: 2000, showConfirmButton: false });
                form.reset();
                cidadeSelect.innerHTML = '<option value="">Aguardando Estado...</option>';
                cidadeSelect.disabled = true;
            } else {
                const errorText = await response.text();
                console.error("Erro ao cadastrar cliente:", errorText);
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Erro ao cadastrar cliente. Verifique os dados e tente novamente.' });
            }
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire({ icon: 'error', title: 'Erro de Conexão', text: 'Não foi possível conectar com a API.' });
        } finally {
            spinner.style.display = "none";
        }
    });

    carregarEstados();
});