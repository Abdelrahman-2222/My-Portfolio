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
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();