(function () {
  function navigateToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Update active control button
    document.querySelectorAll(".controls .control").forEach((btn) => {
      if (btn.dataset.id === targetId) {
        btn.classList.add("active-btn");
      } else {
        btn.classList.remove("active-btn");
      }
    });

    // Remove active class ONLY from main sections, never from carousel items!
    document.querySelectorAll(".contai.active").forEach((section) => {
      section.classList.remove("active");
    });

    // Activate the target section
    targetSection.classList.add("active");

    // Recalculate layout & refresh Carousel when switching to portfolio section
    if (targetId === "portfolio") {
      const carouselEl = document.getElementById("portfolioCarousel");
      if (carouselEl) {
        // Ensure first slide is active if no slide is active
        const slides = carouselEl.querySelectorAll(".carousel-item");
        const hasActiveSlide = carouselEl.querySelector(".carousel-item.active");
        if (!hasActiveSlide && slides.length > 0) {
          slides[0].classList.add("active");
        }
      }
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        if (carouselEl && window.bootstrap && window.bootstrap.Carousel) {
          const instance = window.bootstrap.Carousel.getOrCreateInstance(carouselEl);
          if (instance) instance.to(0);
        }
      }, 50);
    }
  }

  [...document.querySelectorAll(".control")].forEach((button) => {
    button.addEventListener("click", function () {
      const sectionId = this.dataset.id;
      navigateToSection(sectionId);
      window.location.hash = sectionId;
    });
  });

  // Handle URL Hash on load & back/forward navigation
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash.substring(1);
    if (hash) {
      navigateToSection(hash);
    }
  });

  window.addEventListener("DOMContentLoaded", function () {
    const hash = window.location.hash.substring(1);
    if (hash) {
      navigateToSection(hash);
    }
  });

  document.querySelector(".theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
})();

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const name = document.getElementById("userName").value.trim();
      const email = document.getElementById("userEmail").value.trim();
      const subject = document.getElementById("emailSubject").value.trim();
      const message = document.getElementById("emailMessage").value.trim();

      if (!name || !email || !subject || !message) {
        displayMessage("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        displayMessage("Please enter a valid email address", "error");
        return;
      }

      displayMessage("Sending message...", "info");

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Email sent successfully") {
            displayMessage("Message sent successfully!", "success");
            document.getElementById("contactForm").reset();
          } else {
            displayMessage("Failed to send message. Please try again.", "error");
            console.error("Server error:", data);
          }
        })
        .catch((error) => {
          displayMessage("Failed to send message. Please try again.", "error");
          console.error("Fetch error:", error);
        });
    });
  }
});

function displayMessage(msg, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            ${icon}
            <span>${msg}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// Get country from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to set CV links based on region
function setCVLinks(region) {
  let cvFileName = "https://drive.google.com/file/d/1bqFnxH0GFhKA_jcCCd7t3zXwJvgayzh4/view?usp=sharing";

  document.querySelectorAll('.cv-link').forEach(link => {
    link.href = cvFileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

// Try to get region from cookie first
let userRegion = getCookie("user-region");

if (userRegion) {
  setCVLinks(userRegion);
} else {
  fetch('/api/location')
    .then(res => res.json())
    .then(data => {
      setCVLinks(data.region);
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      setCVLinks('INTERNATIONAL');
    });
}

