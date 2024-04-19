//constants
const apiKey = "f8158859954c7a223c561380de36c97f";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    fetchAllCategories : `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`
}

// Boots up the app
function init(){
    fetchAndBuildAllSections();
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res=>{
        const categories= res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndBuildSection(apiPaths.fetchMoviesList(category.id),category);
            })
        }
        console.table(categories)})
    .catch((err)=>console.log(err));
}

function fetchAndBuildSection(fetchUrl,category){
    console.log(fetchUrl, category);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies)&& movies.length){
            buildMoviesSection(movies,category.name);
        }
      })
      .catch((err) => console.log(err));

}

function buildMoviesSection(list,categoryName){
  console.log(list,categoryName);

  const moviesCont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item =>{
    return `
    <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
    `
  })

  const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
       ${moviesListHTML}
    </div>`

  console.log(moviesListHTML);
  console.log(moviesSectionHTML);

  const div= document.createElement(('div'));
  div.className = "movie-section";
  div.innerHTML = moviesSectionHTML;

  //append html into movies container
  moviesCont.append(div);

 
}
window.addEventListener('load', init);