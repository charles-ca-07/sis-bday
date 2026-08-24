const scenes = [...document.querySelectorAll('.scene')];
const audio = document.querySelector('#birthday-audio');
const musicControl = document.querySelector('#music-control');
const musicLabel = document.querySelector('#music-label');
const countdown = document.querySelector('#countdown');
const cakeButton = document.querySelector('#cake-button');
const cakeSuccess = document.querySelector('#cake-success');
const letter = document.querySelector('#letter');
const message = "You are not just a sister,you are a big support for me, and ne yepavum happya erukanum I'll pray for that, If u ever feel low or alone just text me and I'll do my best to make u happy kutta payale,Stay blessed and happy always with ur loved one da ma❤️,yepdiyo 18 agita ne 😂🥂but don't worry kulla payale you will never be taller than me hehh..and Once again Happy birthdayyy thangachiiiii❤️🎂"
let activeScene = 0;
let musicStarted = false;
let cakeCut = false;
let slideTimer;
const photos = ['images/photo1.jpeg','images/photo2.jpeg','images/photo3.jpg','images/photo4.jpeg','images/photo5.webp'];
const captions = ['The moments that make everything brighter.', 'A lifetime of laughter in one frame.', 'The kind of memories we keep forever.', 'My favorite person, in every season.', 'Here is to every chapter still to come.'];

function showScene(index) {
  if (index < 0 || index >= scenes.length || index === activeScene) return;
  scenes[activeScene].classList.remove('is-active');
  scenes[activeScene].classList.add('leaving');
  window.setTimeout(() => scenes[activeScene].classList.remove('leaving'), 1300);
  activeScene = index;
  scenes[activeScene].classList.add('is-active');
  if (index === 3) startTypewriter();
  if (index === 4) startSlideshow();
}

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  audio.play().then(() => updateMusicButton()).catch(() => { musicStarted = false; });
}
function updateMusicButton() {
  const playing = !audio.paused && !audio.muted;
  musicLabel.textContent = playing ? 'Music on' : 'Music off';
  musicControl.querySelector('.music-icon').textContent = playing ? '♫' : '♪';
  musicControl.setAttribute('aria-label', playing ? 'Mute birthday music' : 'Play birthday music');
}
musicControl.addEventListener('click', () => {
  if (audio.paused) { musicStarted = true; audio.play().catch(() => {}); }
  else audio.muted = !audio.muted;
  updateMusicButton();
});
['pointerdown', 'keydown'].forEach(eventName => document.addEventListener(eventName, startMusic, { once: true }));

document.querySelector('#celebrate-next').addEventListener('click', () => showScene(2));
document.querySelector('#message-next').addEventListener('click', () => showScene(4));

function runCountdown(number) {
  if (number === 0) { showScene(1); return; }
  countdown.innerHTML = `<span>${number}</span>`;
  window.setTimeout(() => runCountdown(number - 1), 1000);
}
window.setTimeout(() => runCountdown(3), 1100);

cakeButton.addEventListener('click', () => {
  if (cakeCut) return;
  cakeCut = true;
  cakeButton.classList.add('cut');
  cakeSuccess.classList.add('show');
  burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
  window.setTimeout(() => showScene(3), 3000);
});

let typed = false;
function startTypewriter() {
  if (typed) return;
  typed = true;
  let position = 0;
  const type = () => {
    letter.textContent = message.slice(0, position++);
    if (position <= message.length) window.setTimeout(type, position < 30 ? 35 : 16);
  };
  type();
}

function startSlideshow() {
  if (slideTimer) return;
  const image = document.querySelector('#memory-image');
  const placeholder = document.querySelector('#photo-placeholder');
  const counter = document.querySelector('#slide-counter');
  const progress = document.querySelector('#slide-progress');
  const caption = document.querySelector('#memory-caption');
  let current = 0;
  const render = () => {
    image.classList.remove('loaded');
    placeholder.style.opacity = '1';
    placeholder.querySelector('small').textContent = `photo${current + 1}.jpg`;
    counter.innerHTML = `${current + 1} <small>/ 5</small>`;
    caption.textContent = captions[current];
    progress.style.transition = 'none';
    progress.style.width = '0%';
    image.onload = () => {
      placeholder.style.opacity = '0';
      window.setTimeout(() => {
        image.classList.add('loaded');
        progress.style.transition = 'width 3s linear';
        progress.style.width = '100%';
      }, 100);
    };
    image.onerror = () => {
      console.error('Image not found:', image.src);
      placeholder.style.opacity = '1';
    };
    image.src = photos[current];
  };
  render();
  slideTimer = window.setInterval(() => {
    current += 1;
    if (current >= photos.length) { window.clearInterval(slideTimer); slideTimer = null; showScene(5); return; }
    render();
  }, 3000);
}

const canvas = document.querySelector('#particle-canvas');
const context = canvas.getContext('2d');
const particles = [];
function resizeCanvas() { canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight * devicePixelRatio; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
function seedParticles() { for (let index = 0; index < 65; index += 1) particles.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.7 + .3, a: Math.random(), speed: Math.random() * .3 + .1 }); }
function animateParticles() { context.clearRect(0, 0, innerWidth, innerHeight); particles.forEach(particle => { particle.y -= particle.speed; particle.a += .012; if (particle.y < -5) particle.y = innerHeight + 5; context.globalAlpha = .25 + Math.sin(particle.a) * .25; context.fillStyle = '#ffd7b0'; context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2); context.fill(); }); requestAnimationFrame(animateParticles); }
resizeCanvas(); seedParticles(); animateParticles(); window.addEventListener('resize', resizeCanvas);

function burstConfetti(originX, originY) {
  for (let index = 0; index < 90; index += 1) {
    const confetti = document.createElement('i');
    confetti.className = 'confetti-piece';
    confetti.style.cssText = `left:${originX}px;top:${originY}px;background:${['#f77caa','#f5c66c','#a38bd8','#ffbd87'][index % 4]};transform:rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);
    const angle = Math.random() * Math.PI * 2; const distance = 70 + Math.random() * 320;
    confetti.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) rotate(600deg)`, opacity: 0 }], { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.1,.7,.3,1)' }).finished.then(() => confetti.remove());
  }
}
