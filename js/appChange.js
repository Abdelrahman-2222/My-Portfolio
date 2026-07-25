(function () {
  [...document.querySelectorAll(".control")].forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelector(".active-btn").classList.remove("active-btn");
      this.classList.add("active-btn");
      document.querySelector(".active").classList.remove("active");
      document.getElementById(button.dataset.id).classList.add("active");
    });
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

      const name = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;
      const subject = document.getElementById("emailSubject").value;
      const message = document.getElementById("emailMessage").value;

      if (!name || !email || !subject || !message) {
        displayMessage("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        displayMessage("Please enter a valid email address", "error");
        return;
      }

      displayMessage("Sending...", "info");

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
  // Simple inline alert logic (you can style this as needed)
  alert(`${type.toUpperCase()}: ${msg}`);
}


// Get country from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to set CV links based on region
function setCVLinks(region) {
  let cvFileName;

  if (region === "EG") {
    // Egyptian CV - for users accessing from Egypt
    cvFileName = "https://drive.google.com/file/d/1bqFnxH0GFhKA_jcCCd7t3zXwJvgayzh4/view?usp=sharing";
  } else {
    // International CV - for users accessing from anywhere outside Egypt
    cvFileName = "https://drive.google.com/file/d/1bqFnxH0GFhKA_jcCCd7t3zXwJvgayzh4/view?usp=sharing";
  }

  document.querySelectorAll('.cv-link').forEach(link => {
    link.href = cvFileName;
  });
}

// Try to get region from cookie first
let userRegion = getCookie("user-region");

if (userRegion) {
  setCVLinks(userRegion);
} else {
  // If no cookie, fetch from API
  fetch('/api/location')
    .then(res => res.json())
    .then(data => {
      setCVLinks(data.region);
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      setCVLinks('INTERNATIONAL'); // Fallback to international CV
    });
}
