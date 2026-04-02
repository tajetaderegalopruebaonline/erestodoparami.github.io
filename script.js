// Referencias
const overlay = document.getElementById("overlay");
const heartBtn = document.getElementById("heartBtn");
const closeBtn = document.getElementById("closeBtn");
const typedEl = document.getElementById("typed");
const dedicatoriaEl = document.getElementById("typedDedicatoria");
const sigEl = document.getElementById("sig");
const confettiCanvas = document.getElementById("confetti");
const bgMusic = document.getElementById("bgMusic");

// Mensajes
const mensaje = "Desde que entraste en mi vida, los días tienen más color, las noches más estrellas y mi corazón más motivos para sonreír. ❤️";
const dedicatoria = "Esta tarjeta es solo un reflejo de lo mucho que significas para mí.\nEres mi inspiración, mi alegría y mi razón de soñar cada día.\nGracias por existir y llenar mi vida de magia. 💖";
const firma = "- Con todo mi amor";

// Efecto máquina de escribir
let typewriterTimers = [];

function runTypewriter(el, text, speed = 50, callback) {
  el.textContent = "";
  let i = 0;

  // Limpiar timers anteriores
  typewriterTimers.forEach(t => clearTimeout(t));
  typewriterTimers = [];

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      const t = setTimeout(type, speed);
      typewriterTimers.push(t);
    } else if (callback) {
      callback();
    }
  }
  type();
}

// Confeti
let confettiAnimation;

function startConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const width = confettiCanvas.width;
  const height = confettiCanvas.height;

  const confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 0.5 + 0.5,
      color: `hsl(${Math.random() * 360},100%,50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let f of confetti) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, 2 * Math.PI);
      ctx.fillStyle = f.color;
      ctx.fill();
      f.y += f.d * 4;
      if (f.y > height) f.y = 0;
    }
    confettiAnimation = requestAnimationFrame(draw);
  }

  cancelAnimationFrame(confettiAnimation);
  draw();
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnimation);
  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// Abrir overlay
heartBtn.addEventListener("click", () => {
  // Limpiar textos y timers previos
  typedEl.textContent = "";
  dedicatoriaEl.textContent = "";
  sigEl.textContent = "";
  typewriterTimers.forEach(t => clearTimeout(t));
  typewriterTimers = [];

  // Reiniciar música
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Abrir overlay
  overlay.classList.add("open");

  // Reproducir música
  bgMusic.play();

  // Iniciar confeti
  startConfetti();

  // Iniciar máquina de escribir
  runTypewriter(typedEl, mensaje, 65, () => {
    runTypewriter(dedicatoriaEl, dedicatoria, 60, () => {
      runTypewriter(sigEl, firma, 70);
    });
  });
});

// Cerrar overlay
closeBtn.addEventListener("click", () => {
  overlay.classList.remove("open");

  // Detener música
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Detener confeti
  stopConfetti();

  // Limpiar timers
  typewriterTimers.forEach(t => clearTimeout(t));
  typewriterTimers = [];
});

const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 1; // empezamos en el primer clon
let startX = 0;
let currentX = 0;
let isDragging = false;
let autoSlide;

// 🚀 Clonamos primer y último para efecto infinito
const firstClone = images[0].cloneNode(true);
const lastClone = images[images.length - 1].cloneNode(true);

slides.appendChild(firstClone);
slides.insertBefore(lastClone, images[0]);

const allImages = document.querySelectorAll('.slides img');

// Ajuste inicial
slides.style.transform = `translateX(${-index * 100}%)`;

// 👉 Función para mostrar slide
function showSlide(i, withTransition = true) {
  index = i;
  slides.style.transition = withTransition ? "transform 0.5s ease" : "none";
  slides.style.transform = `translateX(${-index * 100}%)`;
}

// 🔁 Cuando termine transición, corregimos clones
slides.addEventListener("transitionend", () => {
  if (allImages[index].isSameNode(firstClone)) {
    index = 1;
    showSlide(index, false);
  }
  if (allImages[index].isSameNode(lastClone)) {
    index = allImages.length - 2;
    showSlide(index, false);
  }
});

// ⬅️➡️ Botones
prevBtn.addEventListener('click', () => showSlide(index - 1));
nextBtn.addEventListener('click', () => showSlide(index + 1));

// 🎬 Autoplay
function startAuto() {
  autoSlide = setInterval(() => showSlide(index + 1), 4000);
}
function stopAuto() {
  clearInterval(autoSlide);
}
startAuto();

// 📱 Swipe táctil con arrastre
slides.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  currentX = startX;
  isDragging = true;
  stopAuto();
  slides.style.transition = "none";
});

slides.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  slides.style.transform = `translateX(${-index * 100 + diff / slides.clientWidth * 100}%)`;
});

slides.addEventListener("touchend", () => {
  if (!isDragging) return;
  isDragging = false;

  const diff = currentX - startX;
  if (Math.abs(diff) > slides.clientWidth / 4) {
    if (diff > 0) {
      showSlide(index - 1);
    } else {
      showSlide(index + 1);
    }
  } else {
    showSlide(index);
  }

  startAuto();
});

function addSpinEffect(btn) {
  btn.addEventListener("click", () => {
    btn.classList.remove("spin"); // reset por si ya la tenía
    void btn.offsetWidth;         // forzar reflow para reiniciar animación
    btn.classList.add("spin");    // aplicar la animación
  });
}

addSpinEffect(prevBtn);
addSpinEffect(nextBtn);

const surpriseMessages = [
  "Prometo amarte hoy, mañana y siempre 💍💖",
  "Eres el milagro más bonito de mi vida ✨",
  "Mi lugar favorito es a tu lado ❤️",
  "Amarte es mi mejor decisión 💕",
  "Te elegiría incluso en otra vida 🌹",
  "Mi corazón siempre será tuyo 💌"
];

let typingInterval;

function createHearts(count = 10) {
  const msg = document.getElementById("surpriseMsg");
  const rect = msg.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.textContent = "💖";

    // posición inicial cerca del texto
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    heart.style.left = x + (Math.random() * 40 - 20) + "px";
    heart.style.top = y + (Math.random() * 20 - 10) + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2200);
  }
}


function typeWriter(element, text, speed = 60) {
  let i = 0;
  element.textContent = "";
  element.classList.remove("hidden");

  clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);

      // 💗 corazones al terminar
      createHearts(12);
    }
  }, speed);
}

function showSurprise() {
  const msg = document.getElementById("surpriseMsg");
  const btn = document.querySelector(".surprise-btn");

  const randomText =
    surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];

  btn.style.display = "none";

  typeWriter(msg, randomText, 55);

  setTimeout(() => {
    btn.style.display = "inline-block";
  }, 6000);
}

function createBackgroundHeart() {
  const heart = document.createElement("div");
  heart.classList.add("bg-heart");

  const icons = ["💖", "💗", "💕", "💘", "❤️"];
  heart.textContent = icons[Math.floor(Math.random() * icons.length)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 7 + Math.random() * 6 + "s";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 13000);
}

// intervalo adaptable (no satura móviles)
setInterval(createBackgroundHeart, 900);
