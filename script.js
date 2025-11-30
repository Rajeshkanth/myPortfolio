const HIDDEN = "hidden";

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

const API_BASE = "https://spotify-backend-kwl2.onrender.com";

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = (R.toString(16).length == 1 ? "0" : "") + R.toString(16);
  const GG = (G.toString(16).length == 1 ? "0" : "") + G.toString(16);
  const BB = (B.toString(16).length == 1 ? "0" : "") + B.toString(16);

  return "#" + RR + GG + BB;
}

const addClassList = (element, className) => {
  element.classList.add(className);
};

const removeClassList = (element, className) => {
  element.classList.remove(className);
};

async function loadNowPlaying() {
  try {
    const response = await fetch(`${API_BASE}/now-playing`);
    const data = await response.json();

    const cover = document.getElementById("np-cover");
    const title = document.getElementById("np-title");
    const artist = document.getElementById("np-artist");
    const status = document.getElementById("np-status");
    const player = document.getElementById("np-player");
    const equalizer = document.getElementById("np-eq");
    const card = document.getElementById("now-playing-card");
    const listenBtn = document.getElementById("listenBtn");

    if (!card || !listenBtn || !player) return;

    const wantsPlayer = sessionStorage.getItem("showPlayer") === "true";

    if (!data.isPlaying) {
      status.textContent = "Not playing anything right now";
      addClassList(equalizer, "is-hidden");
      // show card + button, hide iframe
      removeClassList(card, HIDDEN);
      addClassList(listenBtn, HIDDEN);
      addClassList(player, HIDDEN);
      player.innerHTML = "";

      sessionStorage.removeItem("showPlayer");
      return;
    }

    // --- Playing state ---
    title.textContent = data.title;
    artist.textContent = data.artist;
    status.textContent = "Listening now";
    removeClassList(equalizer, "is-hidden");

    if (data.albumImageUrl) {
      cover.src = data.albumImageUrl;
      cover.style.display = "block";
    }

    if (wantsPlayer) {
      addClassList(card, HIDDEN);
      addClassList(listenBtn, HIDDEN);
      removeClassList(player, HIDDEN);
    } else {
      removeClassList(card, HIDDEN);
      removeClassList(listenBtn, HIDDEN);
      addClassList(player, HIDDEN);
    }

    if (data.trackId) {
      const previous = sessionStorage.getItem("trackId");
      const hasIframe = !!player.querySelector("iframe");

      if (previous !== data.trackId || !hasIframe) {
        sessionStorage.setItem("trackId", data.trackId);

        player.innerHTML = `
          <iframe
            style="border-radius:12px"
            src="https://open.spotify.com/embed/track/${data.trackId}?utm_source=generator"
            width="100%"
            height="80"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        `;
      }

      // Dynamic background color
      if (window.Vibrant && data.albumImageUrl) {
        Vibrant.from(data.albumImageUrl).getPalette((err, palette) => {
          if (err || !palette) return;

          const swatch =
            palette.Vibrant ||
            palette.Muted ||
            palette.DarkVibrant ||
            palette.DarkMuted ||
            palette.LightVibrant;

          if (!swatch) {
            console.warn("No usable swatch from Vibrant");
            return;
          }

          const mainColor = swatch.hex;
          document.getElementById(
            "now-playing-card"
          ).style.background = `linear-gradient(135deg, ${shadeColor(
            mainColor,
            -40
          )}, ${shadeColor(mainColor, -40)})`;
        });
      }
    } else {
      player.innerHTML = "";
    }
  } catch (err) {
    console.error(err);
  }
}

loadNowPlaying();

setInterval(loadNowPlaying, 10000);

const listenBtn = document.getElementById("listenBtn");
const npPlayer = document.getElementById("np-player");
const npCard = document.getElementById("now-playing-card");
const stopBtn = document.getElementById("stop");

if (listenBtn && npPlayer && npCard) {
  listenBtn.addEventListener("click", () => {
    sessionStorage.setItem("showPlayer", "true");

    addClassList(npCard, HIDDEN);
    addClassList(listenBtn, HIDDEN);
    removeClassList(npPlayer, HIDDEN);
    removeClassList(stopBtn, HIDDEN);
  });
}

if (stopBtn && npCard && listenBtn) {
  stopBtn.addEventListener("click", () => {
    sessionStorage.removeItem("showPlayer");
    removeClassList(npCard, HIDDEN);
    removeClassList(listenBtn, HIDDEN);
    addClassList(npPlayer, HIDDEN);
    addClassList(stopBtn, HIDDEN);
  });
}

window.addEventListener("load", () => {
  if (sessionStorage.getItem("showPlayer")) {
    removeClassList(stopBtn, HIDDEN);
  }
});


// analytics 

document.querySelectorAll(".social-media a").forEach(link => {
  link.addEventListener("click", () => {
    const platform = link.className || link.href;
    gtag("event", "social_click", {
      platform: platform
    });
  });
});

document.querySelectorAll(".portfolio-box").forEach((card, index) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h4")?.innerText || `project-${index+1}`;

    gtag("event", "project_click", {
      project_name: title
    });
  });
});

let fired = false;
window.addEventListener("scroll", () => {
  const sec = document.getElementById("portfolio");
  if (!sec) return;

  if (!fired && sec.getBoundingClientRect().top < window.innerHeight) {
    fired = true;
    gtag("event", "section_view", { section: "portfolio" });
  }
});

document.getElementById("cv-btn")?.addEventListener("click", () => {
  gtag("event", "cv downloaded");
});