import { searchMovies,fetchDetails} from "./api.js";
import { fetchReviews } from "./reviews.js";



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

//for modal
const modal = document.getElementById("movieModal");
const modalContent = document.getElementById("modalContent");

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
    
    container.appendChild(card);   

    card.addEventListener("click", () => openModal(movie.imdbID));
  });
}

async function openModal(id) {
  modalContent.innerHTML = `<div class="loading">Loading details...</div>`;
   modal.showModal();

   try {
    const [details, reviews] = await Promise.all([
      fetchDetails(id),
      fetchReviews(id)
    ]);

    renderModal(details, reviews);

  } catch (err) {
    modalContent.innerHTML = "Failed to load data";
  }
}


function renderModal(details, reviews) {
  modalContent.innerHTML = `
  <div class="modal-wrapper">

    <div class="modal-header">
      

      <div class="modal-main">
        <h2 class="modal-title">${details.Title}</h2>
        <p class="modal-plot">${details.Plot}</p>

        <div class="modal-meta">
          <div><span class="key">Language:</span> <span>${details.Language}</span></div>
          <div><span class="key">Actors:</span> <span>${details.Actors}</span></div>
          <div><span class="key">Director:</span> <span>${details.Director}</span></div>
          <div><span class="key">Year:</span> <span>${details.Year}</span></div>
          <div><span class="key">Genre:</span> <span>${details.Genre}</span></div>
          <div><span class="key">IMDB Rating:</span> ⭐ ${details.imdbRating}</div>
        </div>
      </div>
    </div>

    <hr/>

    <h3 class="review-heading">Reviews</h3>

    <div class="reviews">
      ${
        reviews.length === 0
          ? "<p class='no-review'>No reviews yet.</p>"
          : reviews.map(r => `
              <div class="review-card">
                <div class="review-top">
                  <strong>${r.name}</strong>
                  <span class="rating">⭐ ${r.rating}</span>
                </div>
                <p>${r.comment}</p>
              </div>
            `).join("")
      }
    </div>

  </div>
`;
}

document.getElementById("closeModal")
  .addEventListener("click", () => modal.close());



