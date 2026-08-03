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
    // 1. Find the container we added to the HTML
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 2. Create the toast element
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    
    // 3. Add an icon based on the message type (using FontAwesome which you already have)
    let icon = '';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

    // 4. Inject the HTML into the toast
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            ${icon}
            <span>${msg}</span>
        </div>
    `;

    // 5. Add the toast to the screen
    container.appendChild(toast);

    // 6. Automatically remove the toast after 4 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        // Wait for the fade-out animation to finish before removing from DOM
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
  let cvFileName;

  if (region === "EG") {displayMessage
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
