const API_KEY = "c3d73756";
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;


export async function searchMovies(query,page = 1) {
  const res = await fetch(`${BASE_URL}&s=${query}&page=${page}`);
  const data = await res.json();
  if (data.Response === "False") {
    throw new Error(data.Error)};
  return data;
}


// Movie details
export async function fetchDetails(id) {
  const res = await fetch(`${BASE_URL}&i=${id}&plot=full`);
  if (!res.ok) {
    throw new Error("Failed to fetch details")};
  return res.json();
}


//movies get by directorName

export async function searchByDirector(directorName) {
  const res = await fetch(`${BASE_URL}&s=${directorName}`);
  const data = await res.json();

  if (data.Response === "False") {
    return []; // return empty array instead of error
  }

  return data.Search;
}
