import { searchMovies,fetchDetails,searchByDirector} from "./api.js";
import { fetchReviews } from "./reviews.js";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "./watchlist.js";



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

//for watchlist
const watchlistUI = document.getElementById("watchlist");
const watchCount = document.getElementById("watchCount");


const toggleGrid = document.getElementById("toggle-grid");





//time format
console.log(formatDate("2026-02-25")); 





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
     <div class="card" data-id="${movie.imdbID}">
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

    //wishlist
    card.querySelector(".add-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const added = addToWatchlist(movie);
      if (!added) {
      alert("⚠️ This movie is already in your watchlist!");
      return;
  }
      renderWatchlist();
    });
     

    //card.addEventListener("click", () => openModal(movie.imdbID));

    container.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const movieId = card.dataset.id;            

      console.log("Movie clicked (bubbled to container):", movieId);  

      openModal(movieId);    
    })
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
      //console.log(relatedFilms)

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

// close by button(close button)
document.getElementById("closeModal")
  .addEventListener("click", () => modal.close());

//close by esc button
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.open) {
    modal.close();
  }
});

//close by clicking outside of the modal

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.close();
  }
});



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


/* WATCHLIST */
function renderWatchlist() {
  watchlistUI.innerHTML = "";
  const list = getWatchlist();

  watchCount.textContent = list.length;

  list.forEach(movie => {
    const item = document.createElement("div");
    item.classList.add("watchlist-item");

    item.innerHTML = `
      <p class="watch-title">${movie.Title}</p>
      <button class="remove-btn btn" data-id="${movie.imdbID}">
         Remove
      </button>
    `;

    item.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromWatchlist(movie.imdbID);
      renderWatchlist();
    });

    watchlistUI.appendChild(item);
  });
}

//load
loadTheme();

//watchlist
renderWatchlist();


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



// Utility function at the bottom
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
}


toggleGrid.addEventListener("click", () => {
  container.classList.toggle("list-view");

  const isList = container.classList.contains("list-view");

  if (isList) {
    toggleGrid.textContent = "Grid";
  } else {
    toggleGrid.textContent = "List";
  }
  
})