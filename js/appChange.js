// const sections = document.querySelectorAll('.section');
// const secBtns = document.querySelectorAll('.controls');
// const sectBtn = document.querySelectorAll('.control');
// const allSections = document.querySelectorAll('.main-content');

// function pageTransitions() {
//     //button click active class
//     for (let i = 0; i < sectBtn.length; i++) {
//         sectBtn[i].addEventListener('click', function () { // don't use arrow function
//             let currentBtn = document.querySelectorAll('.active-btn');
//             currentBtn[0].className = currentBtn[0].className.replace('active-btn', '');
//             this.className += ' active-btn'; // that distance is so important
//         })
//     }

//     //sections active class

//     allSections[0].addEventListener('click', (e) => {
//         const id = e.target.dataset.id;
//         if (id) {
//             //remove selected other buttons
//             secBtns.forEach((btn) => {
//                 btn.classList.remove('active');
//             })
//             e.target.classList.add('active');

//             // hide other sections

//             sections.forEach((section) => {
//                 section.classList.remove('active');
//             })

//             const element = document.getElementById(id);
//             element.classList.add('active');
//         }
//     })

//     //Toggle theme
//     const themeBtn = document.querySelectorAll('.theme-btn');
//     themeBtn[0].addEventListener('click', () => {
//         let element = document.body;
//         element.classList.toggle('light-mode');

//     })
// }

// pageTransitions();

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
    cvFileName = "https://drive.google.com/file/d/1bhag-FVsSVY8MPmM5PUGozmuRMQ6hCCM/view?usp=sharing";
  } else {
    // International CV - for users accessing from anywhere outside Egypt
    cvFileName = "https://drive.google.com/file/d/1S0fZ8jcamG-BrBVzKkOWkrLlZHGFsuVG/view?usp=sharing";
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
