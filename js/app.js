import { searchMovies } from "./api.js";



let currentPage = 1;
let currentQuery = "";
let totalResults = 0;




const container = document.getElementById("movieContainer");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
//  for pagination
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumber = document.getElementById("pageNumber");

/* SEARCH */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentQuery = input.value.trim();
  currentPage = 1;

  await loadMovies();
});


async function loadMovies() {
  if (!currentQuery) return;

  container.innerHTML = `
  <div class="loading">
    Loading
  </div>
`;

  try {
    const data = await searchMovies(currentQuery, currentPage);

    totalResults = parseInt(data.totalResults);

    renderMovies(data.Search);
    
    updatePagination();

  } catch (err) {
    container.textContent = err.message;
  }
}

function updatePagination() {
  const totalPages = Math.ceil(totalResults / 10);

  pageNumber.textContent = `Page ${currentPage}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

nextBtn.addEventListener("click", async () => {
  currentPage++;
  await loadMovies();
  
});

prevBtn.addEventListener("click", async () => {
  currentPage--;
  await loadMovies();
  
});


// Movie display
function renderMovies(movies) {
  container.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("article");

    card.innerHTML = `
     <div class="card">
      <figure>
    <img src="${movie.Poster}" alt="${movie.Title}">
  </figure>

  <div class="movie-content">
    <p class="movie-title">
      ${movie.Title}
    </p>


    <div class="movie-info">
      <span class="category">${movie.Type}</span>
      <span class="category">${movie.Year}</span>

    </div>

    <button class="add-btn">💚 Add to wishlist</button>

    
      </div>
    `;

    container.appendChild(card);   // ✅ move inside
  });
}