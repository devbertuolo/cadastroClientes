document.addEventListener("DOMContentLoaded", function () {
    // --- VARIÁVEIS DE ESTADO ---
    let allClients = []; // Guarda a lista completa de clientes vinda da API
    let filteredClients = []; // Guarda a lista após aplicar o filtro de busca
    let currentPage = 1;
    const rowsPerPage = 20; // Máximo de 20 clientes por página

    // --- ELEMENTOS DO DOM ---
    const tableBody = document.getElementById("clienteTableBody");
    const paginationControls = document.getElementById("pagination-controls");
    const searchInput = document.getElementById("pesquisaNome");
    const searchButton = document.getElementById("btnPesquisar");

    // --- FUNÇÕES ---

    /**
     * Renderiza uma página específica da tabela com os dados fornecidos.
     * @param {Array} clientsToShow - A lista de clientes a ser paginada.
     * @param {number} page - O número da página a ser exibida.
     */
    function displayPage(clientsToShow, page) {
        currentPage = page;
        tableBody.innerHTML = ""; // Limpa a tabela

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = clientsToShow.slice(start, end);

        if (paginatedItems.length === 0 && page === 1) {
            tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center;">Nenhum cliente encontrado.</td></tr>`;
            return;
        }

        paginatedItems.forEach(client => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${client.id || ""}</td>
                <td>${client.nome || ""}</td>
                <td>${client.documento || ""}</td>
                <td>${client.email || ""}</td>
                <td>${client.telefone || ""}</td>
                <td>${client.sexo || ""}</td>
                <td>${client.dataNascimento ? new Date(client.dataNascimento).toLocaleDateString() : ""}</td>
                <td>${client.endereco || ""}</td>
                <td>${client.cidade || ""}</td>
                <td>${client.estado || ""}</td>
                <td>${client.cep || ""}</td>
                <td>
                    <button class="btn-editar-tabela" data-id="${client.id}">Editar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Cria e exibe os controles de paginação (botões 1, 2, 3...).
     * @param {Array} clientsToPaginate - A lista de clientes para calcular o número total de páginas.
     */
    function setupPagination(clientsToPaginate) {
        paginationControls.innerHTML = ""; // Limpa os controles existentes
        const pageCount = Math.ceil(clientsToPaginate.length / rowsPerPage);

        // Botão "Anterior"
        const prevButton = document.createElement("a");
        prevButton.href = "#";
        prevButton.innerHTML = "&lt;";
        prevButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                displayPage(clientsToPaginate, currentPage - 1);
                updatePaginationActiveState();
            }
        });
        paginationControls.appendChild(prevButton);

        // Botões de número de página
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement("a");
            pageButton.href = "#";
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", (e) => {
                e.preventDefault();
                displayPage(clientsToPaginate, i);
                updatePaginationActiveState();
            });
            paginationControls.appendChild(pageButton);
        }

        // Botão "Próximo"
        const nextButton = document.createElement("a");
        nextButton.href = "#";
        nextButton.innerHTML = "&gt;";
        nextButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage < pageCount) {
                displayPage(clientsToPaginate, currentPage + 1);
                updatePaginationActiveState();
            }
        });
        paginationControls.appendChild(nextButton);
    }
    
    /**
     * Atualiza qual botão de página está com a classe 'active'.
     */
    function updatePaginationActiveState() {
        const pageButtons = paginationControls.querySelectorAll("a");
        pageButtons.forEach(button => {
            button.classList.remove("active");
            if (parseInt(button.innerText) === currentPage) {
                button.classList.add("active");
            }
        });
    }

    /**
     * Filtra os clientes com base no texto da busca e atualiza a exibição.
     */
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredClients = allClients.filter(client => 
            client.nome && client.nome.toLowerCase().includes(searchTerm)
        );
        
        displayPage(filteredClients, 1);
        setupPagination(filteredClients);
    }
    
    /**
     * Carrega os dados iniciais da API.
     */
    async function initialLoad() {
        try {
            const response = await fetch("http://localhost:5222/Clientes");
            if (!response.ok) throw new Error("Falha ao carregar dados da API.");
            
            allClients = await response.json();
            handleSearch(); // Inicia com a lista completa (filtro vazio)
            
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
            tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center;">${error.message}</td></tr>`;
        }
    }

    // --- EVENT LISTENERS ---
    searchButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });

    // Adiciona listener para os botões de editar (delegação de evento)
    tableBody.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains('btn-editar-tabela')) {
        const id = e.target.getAttribute('data-id');
        
        // LÓGICA DE CONFIRMAÇÃO E REDIRECIONAMENTO
        if (confirm(`Deseja realmente editar os dados do cliente com ID: ${id}?`)) {
            // Se o usuário confirmar, redireciona para a nova página de edição
            window.location.href = `editClient.html?id=${id}`; 
        }
    }
});

    // --- CARGA INICIAL ---
    initialLoad();
});