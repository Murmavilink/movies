const movies = () => {

    const API_KEY = 'aa9207e0-e928-4988-878f-a6ef9e404c47';
    const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
    const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';


    const form = document.querySelector('form');
    const search = document.querySelector('.header__search');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        search.value === '' ? getMovies(API_URL_POPULAR) 
        : getMovies(API_URL_SEARCH + search.value);

        search.value = '';
    });


    const getMovies = async (url) => {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        const respData = await resp.json();

        showMovies(respData);
    };


    const showMovies = (data) => {
        const moviesEl = document.querySelector('.movies');
 
        moviesEl.innerHTML = '';

        data.films.forEach(film => {

            moviesEl.insertAdjacentHTML('beforeend', `
            <div class="movie">
                <div class="movie__cover-inner">
                <img src="${film.posterUrlPreview}" class="movie__cover"
                    alt="${film.nameRu}">
                <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                <div class="movie__title">${film.nameRu}</div>
                <div class="movie__category">
                ${film.genres.map(genre => genre.genre).join(', ')}
                </div>
                ${+film.rating ? `<div class="movie__average movie__average--${getClassByRate(film.rating)}">${film.rating}</div>`: ''}
                </div>
            </div>`);
        });
    };


    const getClassByRate = (rating) => {
        if(rating >= 7) {
            return 'green';
        } else if(rating > 5) {
            return 'orange';
        } else {
            return 'red';
        }
    };


    getMovies(API_URL_POPULAR);
};

export default movies;
