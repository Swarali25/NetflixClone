//constants
const apiKey = "f8158859954c7a223c561380de36c97f";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
  fetchMoviesList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyDLqvhQUpOkeZq4K5mgp4XI19wz0GVVf8U`,
  fetchMovieInfo: (id) =>
    `${apiEndPoint}/movie/${id}?api_key=${apiKey}`,
  fetchRelateMovieInfo: (id) =>
    `${apiEndPoint}/movie/${id}/similar?api_key=${apiKey}`,

};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndBuildSection(apiPaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => console.log(err));
}
function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path}`;

  const div = document.createElement("div");
  div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">Trending in movies | Released - ${
      movie.release_date
    }</p>
    <p class="banner_overview">${
      movie.overview && movie.overview.length > 200
        ? movie.overview.slice(0, 200).trim()
        : movie.overview
    }</p>
    <div class="action-button-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-labelledby=":r2b:" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; &nbsp;  Play</button><button class="action-button" id="action-button-more-info"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-labelledby=":r2c:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>  &nbsp; &nbsp;More Info</button>
    </div>
    `;
  div.className = "banner-content container";
  bannerCont.appendChild(div);

  setBannerSectionEventListners(movie.id);
}
function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 2).forEach((category) => {
          fetchAndBuildSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      console.table(categories);
    })
    .catch((err) => console.log(err));
}

function fetchAndBuildSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.log(err));
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      console.log(item);
      return `
    <div class="movie-item">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
        <iframe width="245px" height="150px"
src="" id="yt${item.id}"></iframe>
        <div class="movie-item-info" id="movie-item-info-yt${item.id}">
                <div class="movie-item-buttons">
                    <div class="movie-item-buttons-left">
                        <button class="movie-item-action-button" tabindex="-1" type="button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-labelledby=":rko:" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                        <button class="movie-item-action-button-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-labelledby=":rm1:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg>
                        </button>
                        <button class="movie-item-action-button-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUp" aria-labelledby=":rpu:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z" fill="currentColor"></path></svg>
                        </button>
                    </div>
                    <div class="movie-item-buttons-right">
                        <div class="movie-item-action-button-2" id="movie-item-more-info-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="ChevronDown" aria-labelledby=":rov:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z" fill="currentColor"></path></svg>
                        </div>
                    </button>
                    </div>
                </div>
                <div class="movie-item-releaseInfo">
                    <p>Released on : ${item.release_date}</p>
                    <div class="movie-item-rating">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star-border sc-e3b78b2c-4 ieNPZr" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg> ${item.vote_average}
                    </div>
                </div>
                <div class="movie-item-title">${item.title}</div>
            </div>
    </div>`;
    })
    .join("");

  const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
       ${moviesListHTML}
    </div>`;

  const div = document.createElement("div");
  div.className = "movie-section";
  div.innerHTML = moviesSectionHTML;

  //append html into movies container
  moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframeId) {
  if (!movieName) return;
  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
      console.log(youtubeUrl);

      const elements = document.getElementById(iframeId);
      elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;
    })
    .catch((err) => console.log(err));
}

function setEventListners() {
  setSettingButtonEventListners();
  setManageProfileEventListners();
  setProfilePopupEventListners();
  setHamburgerIconEventListners();
}

function setBannerSectionEventListners(movieId) {
  const moreInfoBtn = document.getElementById("action-button-more-info");
  moreInfoBtn.addEventListener("click", () => {
    console.log(movieId);
   buildMoreInfoDiv(movieId);
  });
}

function buildMoreInfoDiv(movieId) {
  console.log("buildMoreInfoDiv(movieId)");
  console.log(movieId);
  const moreInfoDiv = document.createElement("div");
  let movieInfo ;
  console.log(apiPaths.fetchMovieInfo(movieId));
  fetch(apiPaths.fetchMovieInfo(movieId))
    .then((res) => res.json())
    .then((res)=>{
        movieInfo = res;
    })
    .then(()=>{
        fetch(apiPaths.fetchRelateMovieInfo(movieId))
        .then((res)=> res.json())
        .then((res)=>{
            let productionCompanies = "";
            movieInfo.production_companies.slice(0,2).forEach((item) => {
              productionCompanies += item.name + ",";
            });
            let genres = "";
            movieInfo.genres.forEach((item) => {
              genres += item.name + ",";
            });

            //relatives movies list
            const relatedMoviesList = 
            res.results.slice(0,9).map((item)=>{
                return `
                <div class="related-movie">
                            <img src="${imgPath}${item.backdrop_path}" alt="" class="related-movie-bgImage">
                            <div class="related-movie-more-info">
                                <div class="related-movie-releaseDetails">
                                    <div class="releated-movie-upperDiv">
                                        <p>${item.release_date.substring(0,4)}</p>
                                        <div class="related-movie-item-rating">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star-border sc-e3b78b2c-4 ieNPZr" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg> ${item.vote_average}
                                        </div>
                                        <button class="movie-item-action-button-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-labelledby=":rm1:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg>
                                        </button>
                                    </div>
                                    <p id="title">${item.title.length > 40 ? item.title+".." : item.title}</p>
                                    <div class="more-info-movie-overview">
                                        ${item.overview.slice(0,80)}
                                    </div>
                                </div>
                            </div>
                        </div>
                `
            }).join("");
            
            const moreInfoHTMLElement = 
            `<div class="more-info-section" id="more-info-section">
              <div class="more-info-banner-section">
                  <img class="more-info-banner" src="${imgPath}${
                      movieInfo.backdrop_path
            }" alt="">
                  <div class="more-info-title">
                      <h2>${movieInfo.tagline}</h2>
                  </div>
                  <div class="more-info-close-btn movie-item-action-button-2" id="more-info-close-button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="X" aria-labelledby=":rai:" data-uia="previewModal-closebtn" role="button" aria-label="close" tabindex="0"><title id=":rai:">close</title><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z" fill="currentColor"></path></svg>
                  </div>
      
                  <div class="more-info-banner-inner-overlay">
                      <div class="more-info-button-left-cont">
                          <div class="action-button-cont">
                              <button class="action-button" id="more-info-action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-labelledby=":r2b:" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; &nbsp;  Play</button>
                              <button class="movie-item-action-button-2">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-labelledby=":rm1:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg>
                              </button>
                              <button class="movie-item-action-button-2">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="ThumbsUp" aria-labelledby=":rpu:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z" fill="currentColor"></path></svg>
                              </button>
                          </div>
                      </div>
                      <div class="more-info-button-right-cont movie-item-action-button-2">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="VolumeOff" aria-labelledby=":r8f:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path></svg>
                      </div>
                  </div>
          </div>
        
          <div class="more-info-movie-content" id="more-info-movie-content">
              <div class="more-info-movie-details">
                  <div class="more-info-movie-details-left">
                  <p>Duration - 225 Mins Released on : ${movieInfo.release_date}</p>
                  <div class="more-info-movie-releaseDetails">
                      <div class="movie-item-rating">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star-border sc-e3b78b2c-4 ieNPZr" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg> ${
                              movieInfo.vote_average
                          }
                      </div>
                      <div class="more-info-movie-overview">
                          ${movieInfo.overview.slice(0, 200)}
                      </div>
                  </div>
                 </div>
                 <div class="more-info-movie-details-right">
                    <p><span>Production Companies : </span>${productionCompanies} </p>
                    <p><span>Geners : </span>${genres}</p>
                  </div>
              </div>
              <div class="more-info-related-movies">
                <h2>More Like This</h2>
                <div class="related-movies-section">
                    ${relatedMoviesList}
                </div>
             </div>

          </div>
          </div>`;
      
            moreInfoDiv.innerHTML = moreInfoHTMLElement;
            document.body.appendChild(moreInfoDiv);
      
            setMoreInfoCloseButtonEventListners();
        })

    })
}

function buildSimilarMoviesSection(movieId){
    fetch(fetchRelateMovieInfo(movieId))
    .then((res => res.json()))
    .then((res)=>{
        const relatedMoviesList = 
        res.results.map((item)=>{
            return `
            <div class="related-movie">
                        <img src="https://occ-0-8302-2164.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABf4RnltrL0vAhXlVKCQsUj817FhHx-dN8mRuU7yhF1-U1P5PrO_f3ZUTDE6d5ph7MeOEUfOENZbsOZlQHw733-UoDhBVPQl7DF1S.webp?r=f39" alt="" class="related-movie-bgImage">
                        <div class="related-movie-more-info">
                            <div class="related-movie-releaseDetails">
                                <div class="releated-movie-upperDiv">
                                    <p>2022</p>
                                    <div class="related-movie-item-rating">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star-border sc-e3b78b2c-4 ieNPZr" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg> 8.45
                                    </div>
                                    <button class="movie-item-action-button-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Plus" aria-labelledby=":rm1:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg>
                                    </button>
                                </div>
                                <div class="more-info-movie-overview">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore, consectetur porro eligendi consequatur cumque numquam placeat laboriosam impedit nulla quae.
                                </div>
                            </div>
                        </div>
                    </div>
            `
        }).join("");

        const relatedMoviesHTMLElement =
        `<h2>More Like This</h2>
        <div class="related-movies-section">
            ${relatedMoviesList}
        </div>   
        `

        const RelatedMoviesDiv = document.createElement("div");
        div.className ="more-info-related-movies";
        RelatedMoviesDiv.innerHTML = relatedMoviesHTMLElement;

        const moreInfoDiv = document.getElementById("more-info-movie-content")
        moreInfoDiv.appendChild(RelatedMoviesDiv);


    })
}

function setMoreInfoCloseButtonEventListners() {
  const closeBtn = document.getElementById("more-info-close-button");
  const moreInfoPopup = document.getElementById("more-info-section");
  closeBtn.addEventListener("click", (e) => {
    console.log("close button clicked")
    e.preventDefault();
    if (e.target.id == "more-info-close-button") {
      moreInfoPopup.style.display = "none";
    }
  },true);
}
function setSettingButtonEventListners() {
  //settings button event listner to open/close setting popup
  const settingBtn = document.getElementById("settings-btn");
  settingBtn.addEventListener("mouseenter", () => {
    document.getElementById("settings-popup").style.display = "block";
  });
  const settingPopup = document.getElementById("settings-popup");
  settingPopup.addEventListener("mouseleave", (event) => {
    console.log(event.target.value);
    document.getElementById("settings-popup").style.display = "none";
  });
}

function setManageProfileEventListners() {
  //manage profile button event listner to open manage profile popup
  const manageProfilebtn = document.getElementById("manage-profile");
  const headerSection = document.getElementById("header");
  const bannerSection = document.getElementById("banner-section");
  const moviesSection = document.getElementById("movies-cont");

  manageProfilebtn.addEventListener("click", () => {
    document.getElementById("profile-section").style.display = "flex";
    headerSection.style.display = "none";
    bannerSection.style.display = "none";
    moviesSection.style.display = "none";
  });
}

function setProfilePopupEventListners() {
  //submit - done  button event listner to open who is watching profile popup
  const submitbtn = document.getElementById("profile-button");
  const profileSectionHeading = document.getElementById(
    "profile-section-heading"
  );
  const profileSectionSvg = document.querySelectorAll(".profile-icon-svg");
  const manageProfileBtn = document.getElementById("manage-profile-button");
  submitbtn.addEventListener("click", () => {
    profileSectionHeading.innerText = "Who's watching?";
    profileSectionSvg.forEach((icon) => {
      icon.style.display = "none";
    });
    submitbtn.style.display = "none";
    manageProfileBtn.style.display = "block";
  });

  const userProfileBtn = document.getElementById("user-profile");
  userProfileBtn.addEventListener("click", () => {
    if (manageProfileBtn.style.display == "block") {
      location.reload();
    }
  });
}

function setHamburgerIconEventListners() {
  const Hamburgerbtn = document.getElementById("hamburger-icon");
  const VerticalContainer = document.getElementById("vertical-cont");
  window.addEventListener("click", (event) => {
    if (Hamburgerbtn.contains(event.target)) {
      console.log(event, "!");
      VerticalContainer.style.display = "block";
    } else if (!VerticalContainer.contains(event.target)) {
      console.log(event);
      VerticalContainer.style.display = "none";
    }
  });
}
window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    //headers or update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
  setEventListners();
});
