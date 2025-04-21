// script.js

document.addEventListener('DOMContentLoaded', function() {
  const formSteps = document.querySelectorAll('.form-step');
  const progressBar = document.querySelector('.progress-bar .progress');
  const totalSteps = formSteps.length;

  let currentStep = 0;
  let isAnimating = false;
  let formData = {}; // Object to hold form data across steps

  // Update Progress Bar
  function updateProgressBar() {
    const progressPercent = ((currentStep) / (totalSteps - 1)) * 100;
    progressBar.style.width = progressPercent + '%';
  }

  // Comments Textarea Character Counter
  const commentsTextarea = document.getElementById('comments');
  const charCounter = document.getElementById('char-counter');
  const maxChars = 150;

  if (commentsTextarea && charCounter) { // Check if elements exist
    commentsTextarea.addEventListener('input', function() {
      const remainingChars = maxChars - commentsTextarea.value.length;
      charCounter.textContent = remainingChars;

      // Enforce character limit manually
      if (remainingChars < 0) {
        commentsTextarea.value = commentsTextarea.value.substring(0, maxChars);
        charCounter.textContent = 0;
      }
    });
  } else {
      console.warn("Comments textarea or character counter element not found.");
  }

  // Function to navigate between steps with animations
  function navigateTo(stepIndex) {
    if (stepIndex < 0 || stepIndex >= totalSteps || stepIndex === currentStep || isAnimating) return;

    isAnimating = true;
    const currentElement = formSteps[currentStep];
    const nextElement = formSteps[stepIndex];

    // Prepare next element
    nextElement.classList.add('active', 'animate-in');
    nextElement.style.animationName = 'fadeIn';
    nextElement.style.zIndex = 2; // Ensure nextElement is above currentElement
    currentElement.style.zIndex = 1;

    // Start animation for current element
    currentElement.classList.add('animate-out');
    currentElement.style.animationName = 'fadeOut';

    // Clean up after current element animation ends
    currentElement.addEventListener('animationend', function handler() {
      currentElement.classList.remove('animate-out', 'active');
      currentElement.style.zIndex = ''; // Reset z-index
      currentElement.removeEventListener('animationend', handler);
    }, { once: true }); // Use { once: true } for cleanup

    // Clean up after next element animation ends
    nextElement.addEventListener('animationend', function handler() {
      nextElement.classList.remove('animate-in');
      nextElement.style.zIndex = ''; // Reset z-index
      nextElement.removeEventListener('animationend', handler);
      isAnimating = false; // Allow navigation again
    }, { once: true }); // Use { once: true } for cleanup

    currentStep = stepIndex;
    updateProgressBar();
  }

  // --- Event Listeners for Buttons ---

  // Start Feedback Button
  const startFeedbackBtn = document.getElementById('start-feedback');
  if (startFeedbackBtn) {
    startFeedbackBtn.addEventListener('click', function() {
      navigateTo(1);
    });
  }

  // Optional Name Field - Next Button 1
  const nextBtn1 = document.getElementById('next-btn-1');
  if (nextBtn1) {
    nextBtn1.addEventListener('click', function() {
      const userNameInput = document.getElementById('user-name');
      const userName = userNameInput ? userNameInput.value.trim() : '';
      formData.Name = userName || 'Anonymous'; // Store with correct key
      navigateTo(2);
    });
  }

  // Satisfaction Slider
  const satisfactionSlider = document.getElementById('satisfaction-slider');
  const satisfactionValue = document.getElementById('slider-value');
  if (satisfactionSlider && satisfactionValue) {
      satisfactionSlider.addEventListener('input', function() {
        satisfactionValue.textContent = satisfactionSlider.value;
        updateSliderBackground(satisfactionSlider);
      });
  }

  // Satisfaction - Next Button 2
  const nextBtn2 = document.getElementById('next-btn-2');
  if (nextBtn2 && satisfactionSlider) {
      nextBtn2.addEventListener('click', function() {
        formData.Satisfaction = parseInt(satisfactionSlider.value); // Store with correct key
        navigateTo(3);
      });
  }

  // Satisfaction - Previous Button 2
  const prevBtn2 = document.getElementById('prev-btn-2');
  if (prevBtn2) {
    prevBtn2.addEventListener('click', function() {
      navigateTo(1);
    });
  }

  // Communication Slider
  const communicationSlider = document.getElementById('communication-slider');
  const communicationValue = document.getElementById('communication-value');
    if (communicationSlider && communicationValue) {
      communicationSlider.addEventListener('input', function() {
        communicationValue.textContent = communicationSlider.value;
        updateSliderBackground(communicationSlider);
      });
  }

  // Communication - Next Button 3
  const nextBtn3 = document.getElementById('next-btn-3');
    if (nextBtn3 && communicationSlider) {
      nextBtn3.addEventListener('click', function() {
        formData.Communication = parseInt(communicationSlider.value); // Store with correct key
        navigateTo(4);
      });
  }

  // Communication - Previous Button 3
  const prevBtn3 = document.getElementById('prev-btn-3');
  if (prevBtn3) {
    prevBtn3.addEventListener('click', function() {
      navigateTo(2);
    });
  }

  // Recommendation Slider
  const recommendationSlider = document.getElementById('recommendation-slider');
  const recommendationValue = document.getElementById('recommendation-value');
  if (recommendationSlider && recommendationValue) {
      recommendationSlider.addEventListener('input', function() {
        recommendationValue.textContent = recommendationSlider.value;
        updateSliderBackground(recommendationSlider);
      });
  }

  // Recommendation - Next Button 4
  const nextBtn4 = document.getElementById('next-btn-4');
  if (nextBtn4 && recommendationSlider) {
      nextBtn4.addEventListener('click', function() {
        formData.Recommendation = parseInt(recommendationSlider.value); // Store with correct key
        navigateTo(5);
      });
  }

  // Recommendation - Previous Button 4
  const prevBtn4 = document.getElementById('prev-btn-4');
  if (prevBtn4) {
    prevBtn4.addEventListener('click', function() {
      navigateTo(3);
    });
  }

  // Comments - Previous Button 5
  const prevBtn5 = document.getElementById('prev-btn-5');
  if (prevBtn5) {
    prevBtn5.addEventListener('click', function() {
      navigateTo(4);
    });
  }

  // --- Submit Button ---
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      // Get Comments
      const comments = commentsTextarea ? commentsTextarea.value.trim() : '';
      formData.Comments = comments || 'No additional comments.'; // Store with correct key

      // Get Timestamp
      function getFormattedTimestamp() {
        const now = new Date();
        // Consider ISO format for better sheet compatibility:
        // return now.toISOString();
        const date = now.toLocaleDateString('en-US'); // Adjust locale as needed
        return `${date}`;
      }
      const timestamp = getFormattedTimestamp();

      // *** Prepare the FINAL data object ***
      // Keys MUST EXACTLY match your Google Sheet header row (case-sensitive!)
      const dataToSubmit = {
        Timestamp: timestamp,
        Name: formData.Name, // Use data stored in formData
        Satisfaction: formData.Satisfaction, // Use data stored in formData (should be a number)
        Communication: formData.Communication, // Use data stored in formData (should be a number)
        Recommendation: formData.Recommendation, // Use data stored in formData (should be a number)
        Comments: formData.Comments // Use data stored in formData
      };

      // --- Log data before sending for debugging ---
      console.log("Data being sent to SheetDB:", JSON.stringify(dataToSubmit, null, 2));

      // Disable the button to prevent multiple submissions
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';

      // --- Send data to SheetDB API ---
      fetch('https://sheetdb.io/api/v1/0v3iog12vgca3', { // Your SheetDB API endpoint
        method: 'POST',
        headers: {
            'Accept': 'application/json', // Added Accept header
            'Content-Type': 'application/json'
        },
        // *** Use the correctly prepared dataToSubmit object ***
        body: JSON.stringify(dataToSubmit)
      })
      .then(response => { // Better response handling
          if (!response.ok) {
              // If response status is not 2xx, try to parse error JSON from body
              return response.json().then(errData => {
                  // Throw an error using SheetDB's message if available
                  throw new Error(errData.error || `SheetDB request failed! Status: ${response.status}`);
              }).catch(() => {
                  // If parsing error JSON fails, throw generic error
                  throw new Error(`SheetDB request failed! Status: ${response.status}`);
              });
          }
          return response.json(); // Parse success JSON (SheetDB often returns { "created": 1 })
      })
      .then(data => {
        console.log("SheetDB Success:", data); // Log SheetDB's success response
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit';

        // --- Logic for navigating based on ratings ---
        // Make sure formData has the correct keys now
        const { Satisfaction, Communication, Recommendation } = formData;
        const allHighRatings = [Satisfaction, Communication, Recommendation].every(value => typeof value === 'number' && value >= 4);

        if (allHighRatings) {
          navigateTo(6); // Go to review prompt with big button
        } else {
          navigateTo(7); // Go to thank-you page with small button
        }
        // --- ---
      })
      .catch(error => {
        console.error('Error submitting to SheetDB:', error);
        // Display the specific error message caught
        alert('An error occurred while submitting feedback: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit';
      });
    });
  }

  // --- Review Step Buttons ---
  const leaveReviewBtn = document.getElementById('leave-review');
  const leaveReviewBtn2 = document.getElementById('leave-review-2'); // Small button on thank-you page
  const closeFormBtn = document.getElementById('close-form');
  const closeFormBtn2 = document.getElementById('close-form-2');

  function leaveReview() {
    window.open('https://g.page/r/CWJwPJMJtmfkEAI/review', '_blank'); // Open in new tab is safer
  }

  if (leaveReviewBtn) {
      leaveReviewBtn.addEventListener('click', leaveReview);
  }
  if (leaveReviewBtn2) {
      leaveReviewBtn2.addEventListener('click', leaveReview);
  }

  function closeWindowSafely() {
      // Attempt to close, but browser might prevent it unless opened by script
      window.close();
      // Optional: Provide feedback if close fails (difficult to detect reliably)
      // console.log("Attempted to close window. Browser restrictions may apply.");
  }

  if (closeFormBtn) {
      closeFormBtn.addEventListener('click', closeWindowSafely);
  }
  if (closeFormBtn2) {
      closeFormBtn2.addEventListener('click', closeWindowSafely);
  }

  // --- Initialization ---

  // Initialize sliders with dynamic backgrounds
  function initializeSliders() {
    if (satisfactionSlider) updateSliderBackground(satisfactionSlider);
    if (communicationSlider) updateSliderBackground(communicationSlider);
    if (recommendationSlider) updateSliderBackground(recommendationSlider);
  }

  // Update Slider Background Function
  function updateSliderBackground(slider) {
    if (!slider) return;
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    // Ensure percentage is within 0-100 bounds
    const safePercentage = Math.max(0, Math.min(100, percentage));
    slider.style.background = `linear-gradient(to right, #ff6b6b 0%, #ff6b6b ${safePercentage}%, #ccc ${safePercentage}%, #ccc 100%)`;
  }

  // Initialize form state
  if (formSteps.length > 0) {
      formSteps[0].classList.add('active'); // Ensure the first step is visible
  }
  initializeSliders();
  updateProgressBar();

  // Add null checks for all getElementById calls
  function checkElement(id) {
      if (!document.getElementById(id)) {
          console.warn(`Element with ID "${id}" not found.`);
      }
  }
  ['start-feedback', 'user-name', 'next-btn-1', 'satisfaction-slider', 'slider-value', 'next-btn-2', 'prev-btn-2', 'communication-slider', 'communication-value', 'next-btn-3', 'prev-btn-3', 'recommendation-slider', 'recommendation-value', 'next-btn-4', 'prev-btn-4', 'comments', 'char-counter', 'submit-btn', 'prev-btn-5', 'leave-review', 'leave-review-2', 'close-form', 'close-form-2'].forEach(checkElement);

}); // End DOMContentLoaded
