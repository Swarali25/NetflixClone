//constants
const apiKey = "f8158859954c7a223c561380de36c97f";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    fetchAllCategories : `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending:`${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube : (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyDLqvhQUpOkeZq4K5mgp4XI19wz0GVVf8U`
}

// Boots up the app
function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndBuildSection(apiPaths.fetchTrending,"Trending Now")
    .then((list)=>{
        const randomIndex = parseInt(Math.random()*list.length); 
        buildBannerSection(list[randomIndex])
    })
    .catch((err)=> console.log(err))
}
function buildBannerSection(movie){
    const bannerCont = document.getElementById(("banner-section"));
    bannerCont.style.backgroundImage =`url(${imgPath}${movie.backdrop_path}`;

    const div = document.createElement("div")
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">Trending in movies | Released - ${movie.release_date}</p>
    <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim() : movie.overview}</p>
    <div class="action-button-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-labelledby=":r2b:" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; &nbsp;  Play</button><button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-labelledby=":r2c:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>  &nbsp; &nbsp;More Info</button>
    `
    div.className="banner-content container";
    bannerCont.appendChild(div);

}
function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res=>{
        const categories= res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndBuildSection(apiPaths.fetchMoviesList(category.id),category.name);
            })
        }
        console.table(categories)})
    .catch((err)=>console.log(err));
}

function fetchAndBuildSection(fetchUrl,categoryName){
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies)&& movies.length){
            buildMoviesSection(movies,categoryName);
        }
        return movies;
        
      })
      .catch((err) => console.log(err));

}

function buildMoviesSection(list,categoryName){
  console.log(list,categoryName);

  const moviesCont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item =>{
    return `
    <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onClick="searchMovieTrailer('${item.title}')">
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

function searchMovieTrailer(movieName){
  if(!movieName) return;
  fetch(apiPaths.searchOnYoutube(movieName))
  .then(res => res.json())
  .then(res => {
    const bestResult = res.items[0];
    const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
    console.log(youtubeUrl)
    window.open(youtubeUrl,"_blank");
  })
  .catch(err => console.log(err))
}
window.addEventListener('load', function(){
    init();
    window.addEventListener('scroll', function(){
        //headers or update
        const header = document.getElementById(('header'));
        if(window.scrollY  > 5 ) header.classList.add('black-bg')
        else header.classList.remove('black-bg')
    })
});