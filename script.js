const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const sortSelect = document.getElementById("sort");

// Get initial movies
getMovies(API_URL);

let moviesCollection = [];

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  moviesCollection = data.results;

  console.log(data.results);

  // Initial render
  sortItems("releaseDate");
}

function showMovies(movies) {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date } = movie;
    const rating = vote_average.toFixed(1);

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${
      rating === "0.0" ? "-" : rating
    }</span>
            </div>
            <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <h3>Release Date</h3>
            ${release_date}
        </div>
        `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else if (vote <= 5 && vote > 0) {
    return "red";
  } else {
    return "white";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);

    search.value = "";
    sortSelect.value = "releaseDate";
  } else {
    window.location.reload();
  }
});

// Sorting Movies
function sortItems(criteria) {
  const sorted = [...moviesCollection].sort((a, b) => {
    if (criteria === "title") {
      return a.title.localeCompare(b.title);
    } else if (criteria === "releaseDate") {
      return new Date(b.release_date) - new Date(a.release_date); // Newest first
    } else {
      return b[criteria] - a[criteria]; // Descending
    }
  });
  showMovies(sorted);
}

sortSelect.addEventListener("change", (e) => {
  sortItems(e.target.value);
});
