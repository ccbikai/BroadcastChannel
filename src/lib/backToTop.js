function setupBackToTop() {
  const backToTopButton = document.querySelector('#back-to-top')

  // Toggle button visibility based on scroll position
  const toggleBackToTopButton = () => {
    backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none'
  }

  // Attach scroll event listener to window
  window.addEventListener('scroll', toggleBackToTopButton)
  toggleBackToTopButton() // Initial check for button visibility

  // Smooth scroll to top when button is clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

// Initialize the functionality once page is fully loaded
document.addEventListener('DOMContentLoaded', setupBackToTop)
