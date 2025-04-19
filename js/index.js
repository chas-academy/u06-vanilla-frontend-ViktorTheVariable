async function showAllMovies() {
  try {
    const adminContainer = document.getElementById('admin-container');
    adminContainer.innerHTML = '';
    
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      const isAdmin = decoded && decoded.isAdmin;
      if (isAdmin) {
        adminContainer.innerHTML = `
          <a href="create-movie.html" id="add-movie" class="has-background-success button is-large is-responsive mt-6 mb-4">
            Create New Movie
          </a>
        `;
      }
    }

    const response = await fetch('https://topwarmovies.onrender.com/api/v1/warmovies');
    const data = await response.json();
    const container = document.getElementById('data-container');
    data.forEach(movie => {
      const imageUrl = movie.media.imageUrl.startsWith('/')
        ? `https://topwarmovies.onrender.com${movie.media.imageUrl}`
        : movie.media.imageUrl;

      const card = document.createElement('div');
      card.className = 'myCard p-5 is-rounded-xl';
      card.style.backgroundImage = `url('${imageUrl}')`;

      card.innerHTML = `
        <section class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
          <h3 class="myCard-bg myCard-radius myCard-title has-text-light is-size-4 has-background-black has-text-centered px-3 is-rounded">
            ${movie.title}
          </h3>
          <h4 class="myCard-bg myCard-plot is-size-5 mt-5">Plot</h4>
          <p class="myCard-bg myCard-txt is-size-6 has-text-left">
            ${movie.plot}
          </p>
          <p class="myCard-bg myCard-radius is-size-4 my-4 px-4">
            User Rating: <span class="has-text-success">${movie.imdbRating.userRating}</span>
          </p>
          <button type="button" id="${movie._id}" class="myMain-button myButton button is-danger is-large">
            More Details &gt;
          </button>
        </section>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error);
    const container = document.getElementById('data-container');
    container.innerHTML = '<p class="has-text-danger is-size-1 has-text-centered">No movies found</p>';
  }
}

document.addEventListener('click', async function(e) {
  if (e.target.matches('.myMain-button')) {
    const movieId = e.target.id;
    const token = localStorage.getItem('token');

    const options = {
      method: 'GET'
    };
    if (token) {
      options.headers = {
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await fetch(`https://topwarmovies.onrender.com/api/v1/warmovies/${movieId}`, options);
      const data = await response.json();

      if (response.ok) {
        window.location.href = `movie.html?id=${movieId}`;
      } else {
        alert(data.message || 'Please log in to view movie details.');
      }
    } catch (err) {
      alert('Ooh noo, internal server error: try set your computer on fire and see if it works' + err.message);
    }
  }
});

showAllMovies();