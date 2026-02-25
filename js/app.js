import { searchMovies,fetchDetails,searchByDirector} from "./api.js";
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

// for theme toggle
const themeToggleBtn = document.getElementById("themeToggle-id");

//for filter
const typeFilter = document.getElementById("typeFilter");











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


      //director data pass
      const relatedFilms = await searchByDirector(details.Director);
      console.log(relatedFilms)

    renderModal(details, reviews,relatedFilms);

  } catch (err) {
    modalContent.innerHTML = "Failed to load data";
  }
}


function renderModal(details, reviews,relatedFilms = []) {
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

     <hr/>

   <div class="director-movies">
    <h3 class="related-heading">Other Movies by ${details.Director}</h3>
    <ul class="related-films">
      ${
        relatedFilms.length === 0
          ? "<li>No other movies found.</li>"
          : relatedFilms.map((film,index) => `<li class="list-items">${index+1}. ${film.Title} (${film.Year})</li>`).join("")
      }
    </ul>
   </div>

  </div>
`;
}

document.getElementById("closeModal")
  .addEventListener("click", () => modal.close());


//Toggle theme 


// Load saved theme after the page loads
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggleBtn.textContent = "☀️"; 
  } else {
    document.body.classList.remove("dark");
    themeToggleBtn.textContent = "🌙"; 
  }
}

// Toggle theme 
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    localStorage.setItem("theme", "dark");
    themeToggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggleBtn.textContent = "🌙";
  }
});




//load
loadTheme();


// for filter

typeFilter.addEventListener("change", () => {
  filterMovies(typeFilter.value);
});

function filterMovies(type) {
  const cards = document.querySelectorAll(".card");
  

  cards.forEach(card => {
    const category = card.querySelector(".category").textContent.toLowerCase();
    //console.log(category)

    if (type === "all" || category === type) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}
