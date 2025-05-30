 document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#create-form');
    const textareas = document.querySelectorAll('#movie-actors, #movie-writers, #movie-country, #movie-language');
    
    
    textareas.forEach(t => {
      t.addEventListener('input', () => validateField(t));
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      textareas.forEach(t => {
        if(!validateField(t)) isValid = false;
      });
  
      if (!isValid) {
        alert('Please fix the errors before submitting the form.');
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in!');
        return;
      }
  
      const isAdmin = parseJwt(token)?.isAdmin;
      if (!isAdmin) {
        alert('You do not have admin privileges!');
        return;
      }
  
      const getArrayField = (selector) => {
        const rawValue = document.querySelector(selector).value;
        const array = rawValue
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        return array.length > 0 ? array : undefined;
      };
  
      const getNestedObject = (selectorPrefix) => {
        const userRating = parseFloat(document.querySelector(`${selectorPrefix}-user`).value) || undefined;
        const expertRating = parseFloat(document.querySelector(`${selectorPrefix}-expert`).value) || undefined;
        if (userRating === undefined && expertRating === undefined) {
          return undefined;
        }
        return { userRating, expertRating };
      };
      
      const getMedia = () => {
        const imageUrl = document.querySelector('#movie-image').value.trim() || undefined;
        const trailerUrl = document.querySelector('#movie-trailer').value.trim() || undefined;
        if (imageUrl === undefined && trailerUrl === undefined) {
          return undefined;
        }
        return { imageUrl, trailerUrl };
      };
  
      const formData = {
        title: document.querySelector('#movie-title').value,
        plot: document.querySelector('#movie-description').value || undefined,
        releaseYear: parseInt(document.querySelector('#movie-year').value, 10) || undefined,
        director: document.querySelector('#movie-director').value || undefined,
        writers: getArrayField('#movie-writers'),
        actors: getArrayField('#movie-actors'),
        length: document.querySelector('#movie-length').value || undefined,
        warType: document.querySelector('#movie-war').value || undefined,
        language: getArrayField('#movie-language'),
        country: getArrayField('#movie-country'),
        imdbRating: getNestedObject('#movie'),
        media: getMedia()
      };
  
      try {
        const response = await fetch(`https://topwarmovies.onrender.com/api/v1/warmovies/${movieId}`, {
            method: 'PUT',  // eller PATCH beroende på API
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
  
        if (!response.ok) {
          const errorBody = await response.json();
          console.error('Error response:', errorBody);
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${JSON.stringify(errorBody)}`);
        }
  
        const responseData = await response.json();
        console.log('Success:', responseData);
        alert('Movie updated successfully!');
        form.reset();
        window.location.href = '/index.html';
  
      } catch (error) {
        console.error('Fetch error:', error);
        alert(`An unexpected error occurred: ${error.message}. Who knows what went wrong.`);
      }
    });

    const populateForm = async () => {
        try {
            const response = await fetch(`https://topwarmovies.onrender.com/api/v1/warmovies/${movieId}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
          if (!response.ok) throw new Error('Failed to fetch movie data');
          
          const movie = await response.json();

          const titleContainer = document.querySelector('#movie-title-header');
          const header = document.createElement('h2');
          header.classList.add('myMain-title', 'is-size-2-fullhd', 'is-size-3-desktop', 'is-size-4');
          header.textContent =`Update: ${movie.title}`;
          titleContainer.innerHTML = '';
          titleContainer.appendChild(header);
          
          document.querySelector('#movie-title').value = movie.title;
          document.querySelector('#movie-description').value = movie.plot || '';
          document.querySelector('#movie-year').value = movie.releaseYear || '';
          document.querySelector('#movie-director').value = movie.director || '';
          document.querySelector('#movie-writers').value = movie.writers?.join(', ') || '';
          document.querySelector('#movie-actors').value = movie.actors?.join(', ') || '';
          document.querySelector('#movie-length').value = movie.length || '';
          document.querySelector('#movie-war').value = movie.warType || '';
          document.querySelector('#movie-language').value = movie.language?.join(', ') || '';
          document.querySelector('#movie-country').value = movie.country?.join(', ') || '';
          document.querySelector('#movie-image').value = movie.media?.imageUrl || '';
          document.querySelector('#movie-trailer').value = movie.media?.trailerUrl || '';
          
          if (movie.imdbRating) {
            document.querySelector('#movie-user').value = movie.imdbRating.userRating || '';
            document.querySelector('#movie-expert').value = movie.imdbRating.expertRating || '';
          }
          
        } catch (error) {
          console.error('Form population error:', error);
          alert('Failed to load movie data');
        }
      };
    
      populateForm();
  
    const validateField = (textarea) => {
      const value = textarea.value.trim();
      const errorDisplay = textarea.nextElementSibling;
      
      errorDisplay.style.display = 'none';
      textarea.classList.remove('is-danger');
  
      if (/(^|,)\s*,/.test(value)) {
        showError(textarea, 'Only one comma allowed in a row');
        return false;
      }
  
      if(value.length > 255) {
        showError(textarea, 'Maximum 255 characters allowed');
        return false;
      }
  
      const entries = value.split(',').map(e => e.trim());
      
      for(const entry of entries) {
        const words = entry.split(/\s+/).filter(w => w.length > 0);
        
        if(words.length > 2) {
          showError(textarea, 'Maximum 2 words per entry');
          return false;
        }
  
        for(const word of words) {
          if(word.length > 15) {
            showError(textarea, 'Maximum 15 characters per word');
            return false;
          }
        }
      }
  
      return true;
    };
  
    const showError = (textarea, message) => {
      textarea.classList.add('is-danger');
      const errorDisplay = textarea.nextElementSibling;
      errorDisplay.textContent = message;
      errorDisplay.style.display = 'block';
    };
  });
  
  function showCreateMovie() {
      const adminContainer = document.getElementById('admin-container');
  
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        const isAdmin = decoded && decoded.isAdmin;
        if (isAdmin) {
          return;
        } else {
          adminContainer.innerHTML = `
            <p class="has-text-danger is-size-1 has-text-centered">You are not authorized to access this page.</p>
          `;
        }
      } else {
        adminContainer.innerHTML = `
          <p class="has-text-danger is-size-1 has-text-centered">You are not logged in.</p>
        `;
      }
    }
  
    showCreateMovie();