// script.js

document.addEventListener('DOMContentLoaded', function() {
  const formSteps = document.querySelectorAll('.form-step');
  const progressBar = document.querySelector('.progress-bar .progress');
  const totalSteps = formSteps.length;

  let currentStep = 0;
  let isAnimating = false;
  let formData = {};

  // Update Progress Bar
  function updateProgressBar() {
    const progressPercent = ((currentStep) / (totalSteps - 1)) * 100;
    progressBar.style.width = progressPercent + '%';
  }

  const commentsTextarea = document.getElementById('comments');
  const charCounter = document.getElementById('char-counter');
  const maxChars = 150;

  commentsTextarea.addEventListener('input', function() {
    const remainingChars = maxChars - commentsTextarea.value.length;
    charCounter.textContent = remainingChars;

    // Enforce character limit manually (for older browsers)
    if (remainingChars < 0) {
      commentsTextarea.value = commentsTextarea.value.substring(0, maxChars);
      charCounter.textContent = 0;
    }
  });

  // Function to navigate between steps with animations
  function navigateTo(stepIndex) {
    if (stepIndex === currentStep || isAnimating) return;

    isAnimating = true;
    const currentElement = formSteps[currentStep];
    const nextElement = formSteps[stepIndex];

    // Prepare next element
    nextElement.classList.add('active', 'animate-in');
    nextElement.style.animationName = 'fadeIn';

    // Set z-index to ensure nextElement is above currentElement
    nextElement.style.zIndex = 2;
    currentElement.style.zIndex = 1;

    // Start animation for current element
    currentElement.classList.add('animate-out');
    currentElement.style.animationName = 'fadeOut';

    currentElement.addEventListener('animationend', function handler() {
      currentElement.classList.remove('animate-out', 'active');
      currentElement.style.zIndex = '';
      currentElement.removeEventListener('animationend', handler);
    });

    nextElement.addEventListener('animationend', function handler() {
      nextElement.classList.remove('animate-in');
      nextElement.style.zIndex = '';
      nextElement.removeEventListener('animationend', handler);
      isAnimating = false;
    });

    currentStep = stepIndex;
    updateProgressBar();
  }

  // Start Feedback Button
  const startFeedbackBtn = document.getElementById('start-feedback');
  startFeedbackBtn.addEventListener('click', function() {
    navigateTo(1);
  });

  // Step Navigation Buttons
  const nextBtn1 = document.getElementById('next-btn-1');
  const nextBtn2 = document.getElementById('next-btn-2');
  const nextBtn3 = document.getElementById('next-btn-3');
  const nextBtn4 = document.getElementById('next-btn-4');
  const prevBtn2 = document.getElementById('prev-btn-2');
  const prevBtn3 = document.getElementById('prev-btn-3');
  const prevBtn4 = document.getElementById('prev-btn-4');
  const prevBtn5 = document.getElementById('prev-btn-5');

  // Optional Name Field
  nextBtn1.addEventListener('click', function() {
    const userName = document.getElementById('user-name').value.trim();
    formData.name = userName || 'Anonymous';
    navigateTo(2);
  });

  // Satisfaction Slider
  const satisfactionSlider = document.getElementById('satisfaction-slider');
  const satisfactionValue = document.getElementById('slider-value');
  satisfactionSlider.addEventListener('input', function() {
    satisfactionValue.textContent = satisfactionSlider.value;
    updateSliderBackground(satisfactionSlider);
  });

  nextBtn2.addEventListener('click', function() {
    formData.satisfaction = parseInt(satisfactionSlider.value);
    navigateTo(3);
  });

  prevBtn2.addEventListener('click', function() {
    navigateTo(1);
  });

  // Communication Slider
  const communicationSlider = document.getElementById('communication-slider');
  const communicationValue = document.getElementById('communication-value');
  communicationSlider.addEventListener('input', function() {
    communicationValue.textContent = communicationSlider.value;
    updateSliderBackground(communicationSlider);
  });

  nextBtn3.addEventListener('click', function() {
    formData.communication = parseInt(communicationSlider.value);
    navigateTo(4);
  });

  prevBtn3.addEventListener('click', function() {
    navigateTo(2);
  });

  // Recommendation Slider
  const recommendationSlider = document.getElementById('recommendation-slider');
  const recommendationValue = document.getElementById('recommendation-value');
  recommendationSlider.addEventListener('input', function() {
    recommendationValue.textContent = recommendationSlider.value;
    updateSliderBackground(recommendationSlider);
  });

  nextBtn4.addEventListener('click', function() {
    formData.recommendation = parseInt(recommendationSlider.value);
    navigateTo(5);
  });

  prevBtn4.addEventListener('click', function() {
    navigateTo(3);
  });

  // Submit Button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', function() {
    const comments = document.getElementById('comments').value.trim();
    formData.comments = comments || 'No additional comments.';

    function getFormattedTimestamp() {
      const now = new Date();
      const date = now.toLocaleDateString('en-US'); // Adjust locale as needed
      return `${date}`;
    }
    
    const timestamp = getFormattedTimestamp();

    const dataToSubmit = {
      Timestamp: timestamp,
      Name: formData.name || 'Anonymous',
      Satisfaction: formData.satisfaction || '',
      Communication: formData.communication || '',
      Recommendation: formData.recommendation || '',
      Comments: formData.comments || ''
    };

    // Disable the button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';

    // Send data to the backend API
    fetch('https://sheetdb.io/api/v1/0v3iog12vgca3', { // Replace with your actual GAS Web App URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [dataToSubmit] })
    })
    .then(response => response.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit';

      if (data.error) {
        alert('Error: ' + data.error);
      } else {
        // Logic for navigating based on ratings
        const { satisfaction, communication, recommendation } = formData;
        const allHighRatings = [satisfaction, communication, recommendation].every(value => value >= 4);
        
        if (allHighRatings) {
          navigateTo(6); // Go to review prompt with big button
        } else {
          navigateTo(7); // Go to thank-you page with small button
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit';
    });
  });

  prevBtn5.addEventListener('click', function() {
    navigateTo(4);
  });

  // Review Step Buttons
  const leaveReviewBtn = document.getElementById('leave-review');
  const leaveReviewBtn2 = document.getElementById('leave-review-2'); // Small button on thank-you page
  const closeFormBtn = document.getElementById('close-form');
  const closeFormBtn2 = document.getElementById('close-form-2');

  function leaveReview() {
    window.open('https://g.page/r/CWJwPJMJtmfkEAI/review'); // Replace with your review URL
  }

  leaveReviewBtn.addEventListener('click', function() {
    leaveReview();
  });

  leaveReviewBtn2.addEventListener('click', function() {
    leaveReview();
  });

  closeFormBtn.addEventListener('click', function() {
    window.close(); // Note: May not work as expected due to browser restrictions
  });

  closeFormBtn2.addEventListener('click', function() {
    window.close(); // Note: May not work as expected due to browser restrictions
  });

  // Initialize sliders with dynamic backgrounds
  function initializeSliders() {
    updateSliderBackground(satisfactionSlider);
    updateSliderBackground(communicationSlider);
    updateSliderBackground(recommendationSlider);
  }

  // Update Slider Background Function
  function updateSliderBackground(slider) {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #ff6b6b 0%, #ff6b6b ${percentage}%, #ccc ${percentage}%, #ccc 100%)`;
  }

  // Initialize form
  formSteps[0].classList.add('active'); // Ensure the first step is visible on page load
  initializeSliders();
  updateProgressBar();
});
