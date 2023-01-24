import { getMovies } from "./getMovies";

export const openModal = async ({id, movieDetails, modal}) => {

    const infoObj = {};
    let respData;
    let respVideoData;

    await getMovies(movieDetails + id).then(data => {
        respData = data;
    });

    await getMovies(movieDetails + id + '/videos').then(data => {
        respVideoData = data;
    });

    respVideoData.items.forEach((item, index) => {
        if (!item) return;

        if (index < 1) {
            infoObj.name = item.name;
            infoObj.url = item.url;
        }
    });

    // Проверка описание фильма
    const stringValidation = (str, num) => {
        if(screen.width <= 620) {
            return str.trim().length > num ? str.substring(0, num).trim() + '...': str;
        } else {
            return str;
        }
    };


    document.body.classList.add('stop-scrolling');

    modal.classList.add('modal--show');
    modal.innerHTML = '';

    modal.insertAdjacentHTML('beforeend', `
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
                    <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${stringValidation(respData.webUrl, 20)}</a></li>
                    <li class="modal__movie-overview">Описание - ${stringValidation(respData.description, 200)}</li>
                    ${Object.keys(infoObj).length ? `<li>${infoObj.name} <a class="modal__movie-site" target="_blank" href="${infoObj.url}">${stringValidation(infoObj.url, 20)}</a></li>` : ''}
                </ul>
                <button type="button" class="modal__button-close">Закрыть</button>
            </div>`);

    const closeModal = () => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__button-close') || !e.target.closest('.modal__card')) {
                modal.classList.remove('modal--show');
                document.body.classList.remove('stop-scrolling');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('modal--show');
            }
        });
    };

    closeModal();
};
