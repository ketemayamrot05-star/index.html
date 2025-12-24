// Welcome message
function showMessage() {
  alert("African Wildlife protects nature and documents the greatest animal migration on Earth!");
}

// Smooth scrolling
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
  } else {
    header.style.boxShadow = "none";
  }
});
