document.addEventListener("DOMContentLoaded", function () {
    let allClients = [];
    let filteredClients = [];
    let currentPage = 1;
    const rowsPerPage = 20;
    let sortColumn = 'id';
    let sortDirection = 'asc';

    const tableBody = document.getElementById("clienteTableBody");
    const paginationControls = document.getElementById("pagination-controls");
    const searchInput = document.getElementById("pesquisaNome");
    const searchButton = document.getElementById("btnPesquisar");
    const spinner = document.getElementById("spinner-overlay");
    const tableHead = document.querySelector("thead");

    function displayPage(clientsToShow, page) {
        currentPage = page;
        tableBody.innerHTML = "";
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
                <td><button class="btn-editar-tabela" data-id="${client.id}">Editar</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function setupPagination(clientsToPaginate) {
        paginationControls.innerHTML = "";
        const pageCount = Math.ceil(clientsToPaginate.length / rowsPerPage);
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

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement("a");
            pageButton.href = "#";
            pageButton.innerText = i;
            if (i === currentPage) { pageButton.classList.add("active"); }
            pageButton.addEventListener("click", (e) => {
                e.preventDefault();
                displayPage(clientsToPaginate, i);
                updatePaginationActiveState();
            });
            paginationControls.appendChild(pageButton);
        }

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
    
    function updatePaginationActiveState() {
        const pageButtons = paginationControls.querySelectorAll("a");
        pageButtons.forEach(button => {
            button.classList.remove("active");
            if (parseInt(button.innerText) === currentPage) {
                button.classList.add("active");
            }
        });
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredClients = allClients.filter(client => client.nome && client.nome.toLowerCase().includes(searchTerm));
        sortData(); 
    }
    
    function sortData() {
        filteredClients.sort((a, b) => {
            const valA = a[sortColumn];
            const valB = b[sortColumn];
            
            let comparison = 0;
            if (valA > valB) {
                comparison = 1;
            } else if (valA < valB) {
                comparison = -1;
            }

            return sortDirection === 'desc' ? comparison * -1 : comparison;
        });

        displayPage(filteredClients, 1);
        setupPagination(filteredClients);
        updateHeaderStyles();
    }

    function updateHeaderStyles() {
        document.querySelectorAll("th[data-sort-by]").forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });

        const activeHeader = document.querySelector(`th[data-sort-by="${sortColumn}"]`);
        if (activeHeader) {
            activeHeader.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    }

    async function initialLoad() {
        spinner.style.display = "flex";
        try {
            const response = await fetch("http://localhost:5222/Clientes");
            if (!response.ok) throw new Error("Falha ao carregar dados da API.");
            
            allClients = await response.json();
            handleSearch();
            
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
            Swal.fire({ icon: 'error', title: 'Erro de Conexão', text: error.message });
            tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center;">${error.message}</td></tr>`;
        } finally {
            spinner.style.display = "none";
        }
    }

    searchButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", (e) => { if (e.key === "Enter") { handleSearch(); } });

    tableBody.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains('btn-editar-tabela')) {
            const id = e.target.getAttribute('data-id');
            Swal.fire({
                title: 'Editar Cliente',
                text: `Deseja realmente editar os dados do cliente com ID: ${id}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#aaa',
                confirmButtonText: 'Sim, editar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `editClient.html?id=${id}`; 
                }
            });
        }
    });

    tableHead.addEventListener("click", (e) => {
        const header = e.target.closest("th[data-sort-by]");
        if (!header) return;

        const column = header.getAttribute("data-sort-by");
        
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        sortData();
    });

    initialLoad();
});