import { getMovies } from "./getMovies";
import { openModal } from "./openModal";

const movies = () => {
    const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
    const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
    const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

    const form = document.querySelector('form');
    const search = document.querySelector('.header__search');
    const moviesEl = document.querySelector('.movies');
    const modalEl = document.querySelector('.modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (search.value) {
            getMovies(API_URL_SEARCH + search.value).then(data => {
                showMovies(data);
            });
        } else {
            getMovies(API_URL_POPULAR).then(data => {
                showMovies(data);
            });
        }

        search.value = '';
    });


    const showMovies = (data) => {
        moviesEl.innerHTML = '';

        data.films.forEach(film => {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.style.cursor = 'pointer';

            movieEl.insertAdjacentHTML('beforeend', `
            <div class="movie__cover-inner">
                <img src="${film.posterUrlPreview}" class="movie__cover"
                    alt="${film.nameRu}">
                <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                <h3 class="movie__title">${film.nameRu}</h3>
                <div class="movie__id">${film.filmId}</div>
                <div class="movie__category">
                ${film.genres.map(genreItem => genreItem.genre).join(', ')}
                </div>
                ${+film.rating ? `<div class="movie__average movie__average--${getClassByRate(film.rating)}">${film.rating}</div>` : ''}
            </div>`);

            moviesEl.append(movieEl);
        });
    };

    const getClassByRate = (rating) => {
        if (rating >= 7) {
            return 'green';
        } else if (rating > 5) {
            return 'orange';
        } else {
            return 'red';
        }
    };

    getMovies(API_URL_POPULAR).then(data => {
        showMovies(data);
    });



    moviesEl.addEventListener('click', (e) => {
        if(e.target.closest('.movie')) {
            const id = e.target.closest('.movie').querySelector('.movie__id').textContent;
            openModal({ id: id, movieDetails: API_URL_MOVIE_DETAILS, modal: modalEl });
        }
    });
    

};

export default movies;
