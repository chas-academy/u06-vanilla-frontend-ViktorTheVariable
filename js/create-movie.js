document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#create-form');
  const textareas = document.querySelectorAll('#movie-actors, #movie-writers, #movie-country, #movie-language');

  textareas.forEach(t => {
    t.addEventListener('input', () => validateField(t));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    textareas.forEach(t => {
      if(!validateField(t)) isValid = false;
    });

    isValid ? form.submit() : alert('Please fix the errors before submitting the form.');
  });

  const validateField = (textarea) => {
    const value = textarea.value.trim();
    const errorDisplay = textarea.nextElementSibling;
    
    errorDisplay.style.display = 'none';
    textarea.classList.remove('is-danger');

    if (/(^|,)\s*,/.test(value)) {
      showError(textarea, 'Only one , in a row allowed');
      return false;
    }

    if(value.length > 255) {
      showError(textarea, 'Max 255 letters total');
      return false;
    }

    const entries = value.split(',').map(e => e.trim());
    
    for(const entry of entries) {
      const words = entry.split(/\s+/).filter(w => w.length > 0);
      
      if(words.length > 2) {
        showError(textarea, `Max 2 words per entry`);
        return false;
      }

      for(const word of words) {
        if(word.length > 15) {
          showError(textarea, `Max 15 characters per word`);
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