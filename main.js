const topContainer = document.getElementById('anime-container');
const alphabeticalContainer = document.getElementById('anime-alphabetical');

const homeMenu = document.getElementById('menu-home');
const movieMenu = document.getElementById('menu-movie');
const serialMenu = document.getElementById('menu-serial');

// Lista que armazena os animes carregados no momento
let currentAnimes = [];

// Buscar animes de acordo com o filtro
async function fetchAnimes({ type = '', order = 'popularity', limit = 20 } = {}) {
    let url = `https://api.jikan.moe/v4/anime?order_by=${order}&limit=${limit}`;
    if (type) {
        url += `&type=${type}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

// Criar card de anime
function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';

    card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <div class="rating">${anime.score ? anime.score : 'N/A'} ⭐</div>
        <div class="title">${anime.title}</div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `details.html?id=${anime.mal_id}`;
    });

    return card;
}

// Renderizar animes nos containers
function renderAnimes(container, animes) {
    container.innerHTML = '';
    animes.forEach(anime => {
        const card = createAnimeCard(anime);
        container.appendChild(card);
    });
}

// Carregar animes na tela (top + alfabética)
async function loadAnimes(params = {}) {
    try {
        currentAnimes = await fetchAnimes(params);

        // 🔧 Correção para seção "Melhores avaliações"
        const animesComNota = currentAnimes.filter(anime => anime.score !== null);
        animesComNota.sort((a, b) => b.score - a.score);
        renderAnimes(topContainer, animesComNota);

        // 🔤 Ordenação alfabética permanece igual
        const sorted = [...currentAnimes].sort((a, b) => a.title.localeCompare(b.title));
        renderAnimes(alphabeticalContainer, sorted);
    } catch (error) {
        console.error('Erro ao carregar animes:', error);
    }
}

// Eventos dos menus
homeMenu.addEventListener('click', () => {
    setActiveMenu(homeMenu);
    loadAnimes();
});

movieMenu.addEventListener('click', () => {
    setActiveMenu(movieMenu);
    loadAnimes({ type: 'movie' });
});

serialMenu.addEventListener('click', () => {
    setActiveMenu(serialMenu);
    loadAnimes({ type: 'tv' });
});

// Ativar o menu selecionado
function setActiveMenu(active) {
    [homeMenu, movieMenu, serialMenu].forEach(menu => {
        menu.classList.remove('active');
    });
    active.classList.add('active');
}

// Carregar Home padrão ao iniciar
loadAnimes();