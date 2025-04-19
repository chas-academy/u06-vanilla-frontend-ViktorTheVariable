  async function showMovieDetails(movieId) {
    const container = document.getElementById('data-container');
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = parseJwt(token);
            const isAdmin = decoded && decoded.isAdmin;

            const response = await fetch(`https://topwarmovies.onrender.com/api/v1/warmovies/${movieId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            const data = await response.json();

            const imageUrl = data.media.imageUrl.startsWith('/')
                ? `https://topwarmovies.onrender.com${data.media.imageUrl}`
                : data.media.imageUrl;

            const adminButtons = isAdmin ? `
            <div id="admin-container" class="myMain-gap is-flex is-flex-direction-column is-align-items-center">
                <a href="update-movie.html?id=${movieId}" id="update-movie" class="has-background-warning button is-large is-responsive">Update Movie</a>
                <button type="button" id="${movieId}" class="delete-movie-btn has-background-danger button is-large is-responsive">Delete Movie</button>
            </div>
        ` : '';

            container.innerHTML = `
                <div class="myMain is-flex is-justify-content-center">
                    <h2 class="myMain-title is-size-2-fullhd is-size-3-desktop is-size-4">${data.title}</h2>
                </div>
                <div class="fixed-grid has-1-cols has-2-cols-tablet has-3-cols-widescreen section">
                    <div class="myMain-gap grid">
                        <div id="image-container" class="myMovie-gap is-flex is-justify-content-center is-align-items-center">
                            <div class="is-128x128">
                                <img id="movie-image" src="${imageUrl}" alt="${data.title}" width="128" height="128">
                            </div>
                            <div class="myMovie-gap is-flex is-flex-direction-column is-align-items-center">
                                <p id="user-rating" class="myDetail-text is-size-5-widescreen is-size-6-tablet is-size-7">User Rating: <span>${data.imdbRating.userRating}</span></p>
                                <p id="expert-rating" class="myDetail-text is-size-5-widescreen is-size-6-tablet is-size-7">Expert Rating: <span>${data.imdbRating.expertRating}</span></p>
                                <p id="length" class="myDetail-text is-size-5-widescreen is-size-6-tablet is-size-7">Length: <span>${data.length}</span></p>
                                <p id="release-year" class="myDetail-text is-size-5-widescreen is-size-6-tablet is-size-7">Release Year: <span>${data.releaseYear}</span></p>
                            </div>
                        </div>
                        <div id="plot-container" class="is-flex is-flex-direction-column is-align-items-center">
                            <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Plot</h4>
                            <p class="myPlot myPlot-text is-size-5-tablet is-size-6">
                                ${data.plot}
                            </p>
                        </div>
                        <div id="trailer-container" class="is-flex is-flex-direction-column is-align-items-center">
                            <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Trailer</h4>
                            <iframe width="280" height="158" 
                                src="${data.media.trailerUrl}" 
                                title="YouTube video player" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                            </iframe>
                        </div>
                        <div id="director-container" class="myMain-gap is-flex is-flex-direction-column is-align-items-center">
                            <p class="myDetail-text is-size-4-fullhd is-size-5-tablet is-size-6">Director: ${data.director}</p>
                            <p class="myDetail-text is-size-4-fullhd is-size-5-tablet is-size-6">WarType: ${data.warType}</p>
                        </div>
                        <div id="cast-container" class="myMain-gap is-flex is-flex-direction-column is-align-items-center">
                            <div id="actors-container" class="is-flex is-flex-direction-column is-align-items-center">
                                <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Actors</h4>
                                ${(data.actors || []).map(actor =>
                                    `<p class="myCast-text is-size-4-tablet is-size-5">${actor}</p>`
                                ).join('')}
                            </div>
                            <div id="writers-container" class="is-flex is-flex-direction-column is-align-items-center">
                                <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Writers</h4>
                                ${(data.writers || []).map(writer =>
                                    `<p class="myCast-text is-size-4-tablet is-size-5">${writer}</p>`
                                ).join('')}
                            </div>
                        </div>
                        <div id="production-container" class="myMain-gap is-flex is-flex-direction-column is-align-items-center">
                            <div id="contry-container" class="is-flex is-flex-direction-column is-align-items-center">
                                <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Filming Locations</h4>
                                ${(data.country || []).map(country =>
                                    `<p class="myCast-text is-size-4-tablet is-size-5">${country}</p>`
                                ).join('')}
                            </div>
                            <div id="language-container" class="is-flex is-flex-direction-column is-align-items-center">
                                <h4 class="myPlot myPlot-title is-size-4-tablet is-size-5">Spoken Languages</h4>
                                ${(data.language || []).map(language =>
                                    `<p class="myCast-text is-size-4-tablet is-size-5">${language}</p>`
                                ).join('')}
                            </div>
                        </div>
                        ${adminButtons}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        container.innerHTML = '<p class="has-text-danger is-size-1 has-text-centered">Please log in to watch movie details</p>';
    }
}

if (movieId) {
    showMovieDetails(movieId);
}
else {
    document.getElementById('data-container').innerHTML = '<p class="has-text-danger is-size-1 has-text-centered">Please go back to "home" and choose a movie.</p>';
}

document.addEventListener('click', async function(e) {
    if (e.target.matches('.delete-movie-btn')) {
      const movieId = e.target.id;
      const token = localStorage.getItem('token');
  
      if (!movieId || !token) {
        alert('Missing movie ID or not logged in.');
        return;
      }
  
      if (!confirm('Are you sure you want to delete this movie?')) {
        return;
      }
  
      try {
        const response = await fetch(`https://topwarmovies.onrender.com/api/v1/warmovies/${movieId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
  
        if (response.ok) {
          alert('Movie deleted successfully');
          window.location.href = 'index.html';
        } else {
          alert('Failed to delete movie: ' + (data.message || 'Please log in as admin to delete movie.'));
        }
      } catch (error) {
        alert('Error deleting movie: ' + error.message);
      }
    }
  });