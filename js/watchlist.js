let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

export function addToWatchlist(movie) {
    const alreadyExists = watchlist.some((m) => m.imdbID === movie.imdbID);

  if (alreadyExists) {
    return false; 
  }
  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  return true;
}

export function removeFromWatchlist(id) {
  watchlist = watchlist.filter(m => m.imdbID !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  
}

export function getWatchlist() {
  return watchlist;
}