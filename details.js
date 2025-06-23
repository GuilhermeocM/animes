const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get('id');

const titleEl = document.getElementById('title');
const synopsisEl = document.getElementById('synopsis');
const imgEl = document.getElementById('anime-img');
const trailerEl = document.getElementById('trailer');

async function loadAnimeDetails() {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        const anime = data.data;


        titleEl.textContent = anime.title;
        synopsisEl.textContent = anime.synopsis;
        imgEl.src = anime.images.jpg.image_url;
        imgEl.alt = anime.title;

        if (anime.trailer && anime.trailer.embed_url) {
            trailerEl.innerHTML = `
                <iframe src="${anime.trailer.embed_url}" 
                        frameborder="0" 
                        allowfullscreen></iframe>
            `;
        } else {
            trailerEl.innerHTML = '<p>Trailer não disponível.</p>';
        }

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        titleEl.textContent = 'Erro ao carregar detalhes';
    }
}

loadAnimeDetails();
