const movieList = document.querySelector('.movie__wrapper');
const tableBtn = document.querySelector('.icon-table');
const listBtn = document.querySelector('.icon-list');
const sortSelect = document.querySelector('#sort');
const modal = document.querySelector('#movie__popup-wrapper');
const favList = document.querySelector('.favorite-list');
let globalData = [];
let movies;

fetch('https://my-json-server.typicode.com/moviedb-tech/movies/list')
  .then(function (response) {
    return response.json();
  })
  .catch(err => alert(err))
  .then(function (data) {
    globalData = data;
    renderList(data);
    renderModal();
    renderSort();
    createFavList();
    isEmptyFavorite()
});

//favorite
function createFavList() {
    let favs = document.querySelectorAll('.favorite-icon');

    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        let addedMovie = movieList.querySelector(`.movie-item[data-name="${localStorage.getItem(key)}"]`);
        if(addedMovie) {
            addedMovie.classList.add('added');
        }
        favList.innerHTML += `<li class='favorite-list__item' data-id='${key}' data-name='${localStorage.getItem(key)}'><span>${localStorage.getItem(key)}</span><span class="favorite-del"></span></li>`;
        deleteLi();
    }

    for(let i = 0; i < favs.length; i++) {
        favs[i].addEventListener('click', function() {
            let name = this.closest('.movie-item').getAttribute('data-name');
            let id = this.closest('.movie-item').getAttribute('data-id');
            if (!this.closest('.movie-item').classList.contains('added') && localStorage.getItem(id) !== name) {
                this.closest('.movie-item').classList.add('added');
                localStorage.setItem(id, name);
                favList.innerHTML += `<li class="favorite-list__item"  data-id="${id}" data-name="${name}"><span>${name}</span><span class="favorite-del"></span></li>`;
            } else {
                this.closest('.movie-item').classList.remove('added');
                localStorage.removeItem(id);
                let li = favList.querySelector(`.favorite-list__item[data-name="${name}"]`);
                if(li) {
                    favList.removeChild(li);
                }
            }
            deleteLi();
        });
    }
};

function deleteLi() {
    let deleteItem = document.querySelectorAll('.favorite-list .favorite-del');
    for(let i = 0; i < deleteItem.length; i++) {
        deleteItem[i].addEventListener('click', function() {
            let name = this.closest('.favorite-list__item').getAttribute('data-name');
            let id = this.closest('.favorite-list__item').getAttribute('data-id');
            this.closest('.favorite-list__item').remove();
            localStorage.removeItem(id);
            if(movieList.querySelector(`.movie-item[data-name="${name}"]`)) {
                movieList.querySelector(`.movie-item[data-name="${name}"]`).classList.remove('added');
            }
            isEmptyFavorite();
        });
    }
};


// options for sorting
function renderSort() {
    let genres = new Set(globalData.map(movie => movie.genres.map(genre => genre.toLowerCase())).flat());
    for (let genre of genres) {
        document.querySelector('#sort').innerHTML += (`<option value="${genre}">${genre}</option>`);
    }
}

// render movies cards
function renderList(data) {
    for(let i = 0; i < data.length; i++) {
        let movieItem = document.createElement('a');
        movieItem.classList.add('movie-item');
        movieItem.setAttribute('data-id', data[i].id);
        movieItem.setAttribute('data-name', data[i].name);
        let html =  `
            <div class="favorite-icon">
                <svg class="star" baseProfile="tiny" height="30px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"/></svg>
            </div>
          <div class="movie-item__img">
              <img src="${data[i].img}" alt="${data[i].name}">
          </div>
          <div class="movie-info__wrapper">
              <div class="movie-item__info">
                  <span class="info-name">
                      ${data[i].name}
                  </span>
                  <span class="info-year">
                    ${data[i].year}
                  </span>
              </div>
              <div class="movie-item__extra">
                  <div class="extra-descr">
                      ${data[i].description}
                  </div>
                  <div class="extra-genre">`;
                  data[i].genres.forEach(genre => {
                      html += `
                          <span class="extra-genre__item">
                              ${genre}
                          </span>`;
                  });
                  html += `
                      </div>
                  </div>
              </div>`;
          movieItem.innerHTML = html;
          movieList.append(movieItem);
      }
};

// list/table view type
listBtn.addEventListener('click', function () {
    if(!this.classList.contains('active')) {
        this.classList.add('active');
        tableBtn.classList.remove('active');
        movieList.classList.add('list-layout');
    }
});

tableBtn.addEventListener('click', function () {
    if(!this.classList.contains('active')) {
        this.classList.add('active');
        listBtn.classList.remove('active');
        movieList.classList.remove('list-layout');
    }
});

// sort by genres
sortSelect.addEventListener('change', function() {
    let sortVal = this.value.toLowerCase();
    let sortList = globalData.filter( i => i.genres.some(j => j.toLowerCase() === sortVal) );
    movieList.innerHTML = '';
    sortVal === 'all' ? renderList(globalData) : renderList(sortList);
    renderModal();
    favList.innerHTML = '';
    createFavList();
});

// modal details for movie
function renderModal() {
    let movies = Array.from(document.querySelectorAll('.movie-item'));
    for (let i = 0; i < movies.length; i++) {
            movies[i].addEventListener('click', function(e) {
                let movieId = +this.getAttribute('data-id');
                let movieName = this.getAttribute('data-name');
                let added;
                if(localStorage.getItem(movieId)) {
                    added = 'added';
                } else {
                    added = '';
                }
                let movieItem = globalData.filter( i => i.id === movieId );
                let html = `
                    <div class="movie__popup movie-item ${added}" data-id="${movieId}" data-name="${movieName}">
                        <div class="close-btn"></div>
                        <div class="movie__right">
                            <div class="movie-img">
                                <img src="${movieItem[0].img}" alt="${movieItem[0].name}">
                            </div>
                            <div class="movie-year__wrap">
                                <div class="favorite-icon">
                                    <svg class="star" baseProfile="tiny" height="30px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"/></svg>
                                </div>
                                <span class="movie-year">${movieItem[0].year}</span>
                            </div>
                            <div class="movie-genre">`;
                            movieItem[0].genres.forEach(genre => {
                                html += `
                                    <span>${genre}</span>`;
                            });
                            html += `
                                </div>
                            </div>
                            <div class="movie__left">
                                <h2 class="h2">${movieItem[0].name}</h2>
                                <div class="movie-descr">
                                    ${movieItem[0].description}
                                </div>
                                <div class="movie-director">
                                    <span>Director:</span>
                                    <span>${movieItem[0].director}</span>
                                </div>
                                <div class="movie-stars">
                                    <span>Starring:</span>
                                    <span>${movieItem[0].starring.join(', ')}</span>
                                </div>
                        </div>
                    </div>`;

            if(!e.target.closest('.favorite-icon')) {
                modal.innerHTML = html;
                document.querySelector('.movie__popup .close-btn').addEventListener('click', () => {
                    modal.classList.remove('active');
                    let id = this.closest('.movie-item').getAttribute('data-id');
                    let item = movieList.querySelector(`.movie-item[data-id="${id}"]`);
                    if (item.classList.contains('added')) {
                        item.classList.remove('added');
                    } else {
                        item.classList.add('added');
                    }
                });
                modal.classList.add('active');
                document.querySelector('.movie-year__wrap .favorite-icon').addEventListener('click', function() {
                    let movieItem = this.closest('.movie-item');
                    let name = movieItem.getAttribute('data-name');
                    let id = movieItem.getAttribute('data-id');
                    if (!movieItem.classList.contains('added') && localStorage.getItem(id) !== name) {
                        movieItem.classList.add('added');
                        localStorage.setItem(id, name);
                        favList.innerHTML += `<li class="favorite-list__item"  data-id="${id}" data-name="${name}"><span>${name}</span><span class="favorite-del">X</span></li>`;
                    } else {
                        movieItem.classList.remove('added');
                        localStorage.removeItem(id);
                        let li = favList.querySelector(`.favorite-list__item[data-name="${name}"]`);
                        if(li) {
                            favList.removeChild(li);
                        }
                    }
                    deleteLi();
                });
            }
        });
    }
}

const favMob = document.querySelector('.favorite-mob');
const favMobClose = document.querySelector('.favorite .close');
favMob.addEventListener('click', function() {
    document.querySelector('.favorite').classList.add('active');
});
favMobClose.addEventListener('click', function() {
    document.querySelector('.favorite').classList.remove('active');
});








  
