let menuIcon = document.querySelector("#menu");
let navBar = document.querySelector(".navbar");
menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navBar.classList.toggle("active");
};

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scroll > 100);

  menuIcon.classList.remove("bx-x");
  navBar.classList.remove("active");
};
ScrollReveal({
  reset: false,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(
  ".home-img, .acmp-container, .portfolio-box, .contact form",
  { origin: "bottom" }
);
ScrollReveal().reveal(".home-content h1 ,.about-img", { origin: "left" });
ScrollReveal().reveal(".home-content p ,.about-content", {
  origin: "right",
});

const typed = new Typed(".multiple-text", {
  strings: ["FrontEnd Developer", "Backend Developer", "Full Stack Developer"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

let aboutDetails = document.querySelector("#about-details");
let readAbout = document.querySelector("#read-more");
readAbout.addEventListener("click", () => {
  aboutDetails.classList.toggle("visible");
  if (aboutDetails.classList.contains("visible")) {
    readAbout.innerHTML = "Read less";
  } else {
    readAbout.innerHTML = "Read more";
  }
});
