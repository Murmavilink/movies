const movies = () => {
    const API_KEY = 'aa9207e0-e928-4988-878f-a6ef9e404c47';
    const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
    const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
    const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';


    const form = document.querySelector('form');
    const search = document.querySelector('.header__search');
    const moviesEl = document.querySelector('.movies');
    const modalEl = document.querySelector('.modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(search.value) {
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


    const getMovies = async (url) => {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
            // mode: 'no-cors'
        });

        return await resp.json();
    };


    const showMovies = (data) => {
        console.log(data);
        moviesEl.innerHTML = '';

        data.films.forEach(film => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

            movieEl.insertAdjacentHTML('beforeend', `
            <div class="movie__cover-inner">
                <img src="${film.posterUrlPreview}" class="movie__cover"
                    alt="${film.nameRu}">
                <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                <div class="movie__title">${film.nameRu}</div>
                <div class="movie__category">
                ${film.genres.map(genreItem => genreItem.genre).join(', ')}
                </div>
                ${+film.rating ? `<div class="movie__average movie__average--${getClassByRate(film.rating)}">${film.rating}</div>` : ''}
            </div>`);

            moviesEl.append(movieEl);
            movieEl.addEventListener('click', () => openModal(film.filmId));
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

    
    // Modal
    const openModal = async (id) => {
        const infoObj = {};
        let respData;
        let respVideoData;

        await getMovies(API_URL_MOVIE_DETAILS + id).then(data => {
            respData = data;
        });

        await getMovies(API_URL_MOVIE_DETAILS + id + '/videos').then(data => {
            respVideoData = data;
        });

        respVideoData.items.forEach((item, index) => {
                if(!item) return;

                if(index < 1) {
                    infoObj.name = item.name;
                    infoObj.url = item.url;
                }
            });

        document.body.classList.add('stop-scrolling');

        modalEl.classList.add('modal--show');
        modalEl.innerHTML = '';

        modalEl.insertAdjacentHTML('beforeend', `
        <div class="modal__card">
            <img class="modal__movie-backdrop" src="${respData.posterUrlPreview}" alt="">
            <h2>
                <span class="modal__movie-title">${respData.nameRu}</span>
                <span class="modal__movie-release-year">${respData.year}</span>
            </h2>
            <ul class="modal__movie-info">
                <div class="loader"></div>
                <li class="modal__movie-genre">Жанр - ${respData.genres.map(genreItem => genreItem.genre).join(', ')}</li>
                ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
                <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
                <li class="modal__movie-overview">Описание - ${respData.description}</li>
                ${Object.keys(infoObj).length ? `<li>${infoObj.name} <a class="modal__movie-site" target="_blank" href="${infoObj.url}">${infoObj.url}</a></li>` : ''}
            </ul>
            <button type="button" class="modal__button-close">Закрыть</button>
        </div>
    `);

    closeModal();
};

    const closeModal = () => {
        modalEl.addEventListener('click', (e) => {
            if(e.target.classList.contains('modal__button-close') || !e.target.closest('.modal__card')) {
                modalEl.classList.remove('modal--show');
                document.body.classList.remove('stop-scrolling');
            }   
        });

        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                modalEl.classList.remove('modal--show');
            }
       });
    };

};

export default movies;
