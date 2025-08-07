document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const cardGrid = document.getElementById('card-grid');
    const categoryList = document.getElementById('category-list');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const loadingContainer = document.getElementById('loading-container');
    const body = document.body;

    // --- ÍCONE DE FALLBACK (SVG) ---
    const fallbackIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    `;

    // --- ESTADO DA APLICAÇÃO ---
    let currentCategory = 'Todos';
    let imageObserver; 

    // --- BANCO DE DADOS DE LINKS ---
    const initialLinks = [
        { name: "Awwwards", url: "https://www.awwwards.com/", category: "Padrões de UI & Inspiração" },
        { name: "Mobbin", url: "https://mobbin.com/", category: "Padrões de UI & Inspiração" },
        { name: "Framer", url: "https://www.framer.com/", category: "Ferramentas" },
        { name: "Spline", url: "https://spline.design/", category: "Ferramentas" },
        { name: "Feather Icons", url: "https://feathericons.com/", category: "Recursos & UI Kits" },
        { name: "Unsplash", url: "https://unsplash.com/", category: "Recursos & UI Kits" },
        { name: "Nielsen Norman Group", url: "https://www.nngroup.com/", category: "Artigos & Estudos de UX" },
        { name: "Laws of UX", url: "https://lawsofux.com/", category: "Artigos & Estudos de UX" },
        { name: "Baymard Institute", url: "https://baymard.com/", category: "Artigos & Estudos de UX" },
        { name: "UI-Patterns.com", url: "https://ui-patterns.com/", category: "Padrões de UI & Inspiração" },
    ];

    // --- MODO ESCURO (sem alterações) ---
    function enableDarkMode() { body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'enabled'); }
    function disableDarkMode() { body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'disabled'); }
    if (localStorage.getItem('darkMode') === 'enabled') { enableDarkMode(); }
    darkModeToggle.addEventListener('click', () => {
        localStorage.getItem('darkMode') !== 'enabled' ? enableDarkMode() : disableDarkMode();
    });

    // --- LÓGICA DE RENDERIZAÇÃO E FILTRO (sem alterações) ---
    function renderCards(linkList) {
        cardGrid.innerHTML = '';
        if (linkList.length === 0) {
            cardGrid.innerHTML = '<p class="loading-message">Nenhum resultado encontrado.</p>';
            return;
        }
        if (imageObserver) imageObserver.disconnect();
        linkList.forEach(link => {
            const cardHTML = `
                <a href="${link.url}" target="_blank" class="card-link" data-url="${link.url}">
                    <div class="card">
                        <div class="card-image-container">
                            <img data-src="${link.url}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Carregando preview de ${link.name}">
                        </div>
                        <div class="card-info"><h3>${link.name}</h3><p>${link.category}</p></div>
                    </div>
                </a>
            `;
            cardGrid.innerHTML += cardHTML;
        });
        setupImageObserver();
    }
    function filterAndRender() {
        let filteredList = initialLinks;
        if (currentCategory !== 'Todos') filteredList = filteredList.filter(link => link.category === currentCategory);
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) filteredList = filteredList.filter(link => link.name.toLowerCase().includes(searchTerm));
        renderCards(filteredList);
    }
    function renderCategories() {
        const categories = ['Todos', ...new Set(initialLinks.map(link => link.category))];
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.textContent = category;
            if (category === 'Todos') li.classList.add('active');
            li.addEventListener('click', () => {
                currentCategory = category;
                searchInput.value = '';
                filterAndRender();
                document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
            });
            categoryList.appendChild(li);
        });
    }
    searchInput.addEventListener('input', filterAndRender);

    // --- NOVA LÓGICA DE PERFORMANCE COM TIMEOUT ---
    async function loadImageForElement(imgElement) {
        const url = imgElement.getAttribute('data-src');
        const imageContainer = imgElement.parentElement;
        const cacheKey = `screenshot_${url}`;
        const cachedImage = localStorage.getItem(cacheKey);

        if (cachedImage) {
            imgElement.src = cachedImage;
            return;
        }

        // --- A MÁGICA DO TIMEOUT ACONTECE AQUI ---
        body.classList.add('is-loading');
        try {
            // Promessa de timeout: rejeita depois de 10 segundos
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout de 10s')), 10000)
            );

            // Promessa da API
            const fetchPromise = fetch(`https://api.microlink.io/?url=${url}&screenshot=true&screenshot.type=jpeg&screenshot.quality=75`);

            // Compete a API contra o timeout. O primeiro a terminar (com sucesso ou erro) vence.
            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) throw new Error('API response not OK');
            const data = await response.json();
            if (data.status !== 'success') throw new Error('API status not success');
            
            const imageUrl = data.data.screenshot?.url;
            if (imageUrl) {
                imgElement.src = imageUrl;
                localStorage.setItem(cacheKey, imageUrl);
            } else {
                throw new Error('Image URL not found in API response');
            }
        } catch (error) {
            console.error(`Falha ou Timeout para ${url}:`, error.message);
            // Se der erro ou timeout, aplica o visual de fallback
            imageContainer.innerHTML = `<div class="image-fallback">${fallbackIconSVG}</div>`;
        } finally {
            body.classList.remove('is-loading');
        }
    }

    function setupImageObserver() {
        const imagesToLoad = document.querySelectorAll('img[data-src]');
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImageForElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px 200px 0px' });
        imagesToLoad.forEach(img => imageObserver.observe(img));
    }

    // --- INICIALIZAÇÃO ---
    function initialize() {
        renderCategories();
        filterAndRender();
    }
    initialize();
});