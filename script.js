// ============================================================
//  CONFIG  —  edit these later
// ============================================================
const CONFIG = {
  password: "amber",

  // birthday — midnight Paris time (CEST, UTC+2 in May)
  birthday: new Date("2026-05-04T00:00:00+02:00"),
};
// ============================================================

// ---------- PETALS ----------
(function makePetals() {
  const layer = document.querySelector(".petals");
  const symbols = ["🌸", "🌷", "💗", "🌺", "✿"];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = symbols[i % symbols.length];
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (8 + Math.random() * 12) + "s";
    p.style.animationDelay = (Math.random() * -20) + "s";
    p.style.fontSize = (16 + Math.random() * 18) + "px";
    p.style.opacity = 0.4 + Math.random() * 0.5;
    layer.appendChild(p);
  }
})();

// ---------- PASSWORD GATE (Y2K WINDOWS) ----------
const gate = document.getElementById("gate");
const site = document.getElementById("site");
const form = document.getElementById("gate-form");
const input = document.getElementById("gate-input");
const errorEl = document.getElementById("gate-error");

const winInfo = document.getElementById("win-info");
const winInfoText = document.getElementById("win-info-text");
const winLogin = document.getElementById("win-login");

const FAKE_MESSAGES = {
  mycomputer: "Access denied. Only Ambre.exe is authorised on this device.",
  recycle:    "The Recycle Bin is empty. (you don't throw anything away, do you?)",
  documents:  "Cannot open 'My Documents' — the only document here is dedicated to Ambre 💕",
  ie:         "Internet Explorer has stopped responding. (classic.)",
  msn:        "You have 0 new messages. Try clicking the gift 🎀.",
  winamp:     "Winamp is loading… just kidding. Click the gift 🎀 to enter.",
  paint:      "Paint cannot start: insufficient cuteness. Required: Ambre. Found: missing.",
  notepad:    "untitled.txt — 'note to self: ambre is the prettiest girl ever' ✨",
};

function openInfo(message) {
  winInfoText.textContent = message;
  winInfo.classList.remove("hidden");
}
function openLogin() {
  winLogin.classList.remove("hidden");
  setTimeout(() => input.focus(), 50);
}
function closeWindow(el) { el.classList.add("hidden"); }

document.querySelectorAll(".win-icon").forEach((btn) => {
  btn.addEventListener("click", () => {
    const app = btn.dataset.app;
    if (app === "clickme") openLogin();
    else openInfo(FAKE_MESSAGES[app] || "This program is unavailable.");
  });
});

document.querySelectorAll(".win-window .win-close, .win-window [data-close]").forEach((el) => {
  el.addEventListener("click", () => closeWindow(el.closest(".win-window")));
});

document.querySelector(".win-start")?.addEventListener("click", () => {
  openInfo("Start menu is locked until Ambre logs in. 🎀");
});

(function liveClock() {
  const el = document.getElementById("win-clock");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 30000);
})();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const tryPwd = input.value.trim().toLowerCase();
  if (tryPwd === CONFIG.password.toLowerCase()) {
    unlock();
  } else {
    errorEl.classList.add("show");
    input.value = "";
    input.focus();
    winLogin.animate(
      [{ transform: "translate(-50%, -50%) translateX(0)" }, { transform: "translate(-50%, -50%) translateX(-10px)" }, { transform: "translate(-50%, -50%) translateX(10px)" }, { transform: "translate(-50%, -50%) translateX(0)" }],
      { duration: 300 }
    );
  }
});

function unlock() {
  gate.style.transition = "opacity 0.6s";
  gate.style.opacity = "0";
  setTimeout(() => {
    gate.classList.add("hidden");
    showIntro();
  }, 600);
}

function showIntro() {
  const intro = document.getElementById("intro");
  intro.classList.remove("hidden");
  fireConfetti();

  const song = document.getElementById("bday-song");
  song.volume = 0.7;
  song.play().catch(() => {});

  // make the song feel ~1 min — wrap back to the start at 60s
  song.addEventListener("timeupdate", () => {
    if (song.currentTime >= 60) song.currentTime = 0;
  });

  const video = document.getElementById("intro-video");
  video.play().catch(() => {});

  const btn = document.getElementById("continue-btn");
  setTimeout(() => btn.classList.add("ready"), 35000);

  // 19s in: title + name pop, iOS emojis swap to custom, balloons rain (10s)
  setTimeout(() => {
    document.querySelector(".intro-title").classList.add("celebrate");
    document.querySelector(".intro-name").classList.add("celebrate");
    swapToCustomEmojis();
    startBalloonRain();
    fireConfetti();
  }, 19000);

  btn.addEventListener(
    "click",
    () => fadeAndContinue(intro, song),
    { once: true }
  );

  // DEV: skip button — bypasses the 35s wait
  const skip = document.getElementById("dev-skip-btn");
  if (skip) {
    skip.addEventListener(
      "click",
      () => fadeAndContinue(intro, song),
      { once: true }
    );
  }
}

function swapToCustomEmojis() {
  const decos = document.querySelectorAll(".intro .deco");
  decos.forEach((d, i) => {
    setTimeout(() => {
      sparkleBurst(d);
      setTimeout(() => {
        const num = String((i % 18) + 1).padStart(2, "0");
        const img = document.createElement("img");
        img.src = `emojis-clean/e${num}.png`;
        img.alt = "";
        img.className = "deco-img";
        d.textContent = "";
        d.appendChild(img);
        d.classList.add("deco-custom");
      }, 200);
    }, i * 25);
  });
}

function sparkleBurst(target) {
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const symbols = ["✨", "·", "⋆", "✦"];
  for (let k = 0; k < 6; k++) {
    const s = document.createElement("span");
    s.className = "sparkle-burst";
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = cx + "px";
    s.style.top = cy + "px";
    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 28;
    s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    s.style.fontSize = (12 + Math.random() * 10) + "px";
    s.style.animationDelay = Math.random() * 0.08 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

function startBalloonRain() {
  const layer = document.createElement("div");
  layer.className = "balloon-rain";
  document.body.appendChild(layer);
  for (let i = 0; i < 50; i++) {
    const b = document.createElement("span");
    b.className = "balloon-fall";
    b.textContent = "🎈";
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = (2.5 + Math.random() * 1.5) + "s";
    b.style.animationDelay = (Math.random() * 1) + "s";
    b.style.fontSize = (28 + Math.random() * 24) + "px";
    layer.appendChild(b);
  }
  // fade + remove after ~5s total
  setTimeout(() => {
    layer.style.transition = "opacity 0.8s ease";
    layer.style.opacity = "0";
    setTimeout(() => layer.remove(), 800);
  }, 4200);
}

function fadeAndContinue(intro, song) {
  const startVol = song.volume;
  const fadeMs = 800;
  const steps = 20;
  let i = 0;
  const fade = setInterval(() => {
    i++;
    song.volume = Math.max(0, startVol * (1 - i / steps));
    if (i >= steps) {
      clearInterval(fade);
      song.pause();
    }
  }, fadeMs / steps);

  intro.style.transition = "opacity 0.8s";
  intro.style.opacity = "0";
  setTimeout(() => {
    intro.classList.add("hidden");
    site.classList.remove("hidden");
    startCountdown();
    fireConfetti();
    revealOnScroll();
    scatterMainPageDecos();
    startBalloonRain();
    autoplaySongOnScroll();
  }, 800);
}

function autoplaySongOnScroll() {
  const song = document.getElementById("song");
  const section = document.querySelector(".song-section");
  if (!song || !section) return;
  let played = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !played) {
          song.volume = 0.8;
          song.play()
            .then(() => { played = true; })
            .catch(() => {});
        }
      });
    },
    { threshold: 0.55 }
  );
  io.observe(section);
}

function scatterMainPageDecos() {
  const site = document.querySelector(".site");
  if (!site || site.dataset.decoed) return;
  site.dataset.decoed = "true";

  const animations = [
    "heartFloatDeco 5s ease-in-out infinite",
    "balloonFloat 6s ease-in-out infinite",
    "cornerFloat 4s ease-in-out infinite",
    "spinBow 5s ease-in-out infinite",
    "giftWiggle 3s ease-in-out infinite",
  ];
  const numDecos = 220;
  for (let k = 0; k < numDecos; k++) {
    const span = document.createElement("span");
    span.className = "site-deco";
    const num = String((k % 18) + 1).padStart(2, "0");
    const img = document.createElement("img");
    img.src = `emojis-clean/e${num}.png`;
    img.alt = "";
    img.className = "deco-img";
    img.style.animationDelay = (Math.random() * 1.6) + "s";
    span.appendChild(img);

    span.style.top = (Math.random() * 96 + 2) + "%";

    const r = Math.random();
    if (r < 0.42) {
      span.style.left = (Math.random() * 9) + "%";
    } else if (r < 0.84) {
      span.style.right = (Math.random() * 9) + "%";
    } else {
      // a few sprinkled mid — lower opacity so they don't fight content
      span.style.left = (15 + Math.random() * 70) + "%";
      span.style.opacity = "0.35";
    }

    span.style.fontSize = (22 + Math.random() * 28) + "px";
    span.style.animation = animations[Math.floor(Math.random() * animations.length)];
    span.style.animationDelay = (Math.random() * 5) + "s";

    site.appendChild(span);
  }
}

// ---------- COUNTDOWN ----------
function startCountdown() {
  const el = document.getElementById("countdown");
  function tick() {
    const now = new Date();
    let target = new Date(CONFIG.birthday);

    // compare in Paris time so "today" matches Ambre's local day
    const parisFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric", month: "2-digit", day: "2-digit",
    });
    const sameDay = parisFmt.format(now) === parisFmt.format(target);

    if (sameDay) {
      el.innerHTML = `<div class="countdown-cell" style="min-width:auto;padding:18px 28px;"><span class="countdown-num">today is the day 🎂</span></div>`;
      return;
    }

    let diff = target - now;
    if (diff < 0) {
      // birthday passed — keep showing love
      el.innerHTML = `<div class="countdown-cell" style="min-width:auto;padding:18px 28px;"><span class="countdown-num">always yours 💕</span></div>`;
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    el.innerHTML = `
      <div class="countdown-cell"><span class="countdown-num">${days}</span><span class="countdown-label">days</span></div>
      <div class="countdown-cell"><span class="countdown-num">${hours}</span><span class="countdown-label">hours</span></div>
      <div class="countdown-cell"><span class="countdown-num">${mins}</span><span class="countdown-label">mins</span></div>
      <div class="countdown-cell"><span class="countdown-num">${secs}</span><span class="countdown-label">secs</span></div>
    `;
  }
  tick();
  setInterval(tick, 1000);
}

// ---------- ENVELOPE ----------
const env = document.getElementById("envelope");
env.addEventListener("click", () => env.classList.toggle("open"));

// ---------- REASON CARDS ----------
document.querySelectorAll(".reason-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

// ---------- TRIP REVEAL ----------
const revealBox = document.getElementById("reveal-box");
revealBox.addEventListener("click", () => {
  if (!revealBox.classList.contains("opened")) {
    revealBox.classList.add("opened");
    fireConfetti();
  }
});

// ---------- SCROLL REVEAL ----------
function revealOnScroll() {
  const sections = document.querySelectorAll(".section");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.15 }
  );
  sections.forEach((s) => io.observe(s));
}

// ---------- CONFETTI ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const palette = ["#f4a8c0", "#e89bb5", "#fbc8d8", "#ffd9e4", "#fff", "#d97a99"];
let pieces = [];

function fireConfetti() {
  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: innerHeight / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 14 - 4,
      g: 0.3,
      size: 6 + Math.random() * 6,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      shape: Math.random() < 0.5 ? "circle" : "rect",
      life: 200 + Math.random() * 80,
    });
  }
  if (!animating) loop();
}

let animating = false;
function loop() {
  animating = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life--;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
    }
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.life > 0 && p.y < canvas.height + 50);

  if (pieces.length) {
    requestAnimationFrame(loop);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
