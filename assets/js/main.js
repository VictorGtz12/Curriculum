const revealElements = document.querySelectorAll(".reveal");
const printButton = document.getElementById("print-cv");

if (printButton) {
    printButton.addEventListener("click", () => window.print());
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const canvas = document.getElementById("network-bg");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let animationFrame;

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createParticles();
}

function createParticles() {
    const count = Math.max(28, Math.min(72, Math.floor(window.innerWidth / 22)));
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.6 + 0.6
    }));
}

function drawNetwork() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
        if (!prefersReducedMotion) {
            particle.x += particle.vx;
            particle.y += particle.vy;
        }

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(98, 213, 200, 0.42)";
        ctx.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
            const next = particles[nextIndex];
            const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

            if (distance < 132) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(next.x, next.y);
                ctx.strokeStyle = `rgba(120, 168, 255, ${0.12 * (1 - distance / 132)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });

    animationFrame = requestAnimationFrame(drawNetwork);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawNetwork();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrame);
    } else {
        drawNetwork();
    }
});
