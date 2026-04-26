/**
 * Birthday Greeting Page — Interactive Scripts
 *
 * Handles:
 *  - Heart trail effect on mouse/touch move
 *  - Envelope open/close interaction
 */

// ─── Heart Trail Effect ───────────────────────────────────────────────────────

let lastHeartTime = 0;
const HEART_INTERVAL = 100; // milliseconds between hearts

document.addEventListener("mousemove", createHeart);
document.addEventListener("touchmove", createHeart);

function createHeart(e) {
    const now = Date.now();
    if (now - lastHeartTime < HEART_INTERVAL) return;
    lastHeartTime = now;

    const x = e.pageX ?? e.touches?.[0]?.pageX;
    const y = e.pageY ?? e.touches?.[0]?.pageY;

    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

// ─── Envelope Interaction ─────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
    const mailBox = document.querySelector(".mail");
    const boxMail = document.querySelector(".boxMail");
    const closeBtn = document.querySelector(".fa-xmark");

    mailBox.addEventListener("click", function () {
        mailBox.classList.toggle("active");
        boxMail.classList.add("active");
    });

    closeBtn.addEventListener("click", function () {
        boxMail.classList.remove("active");
    });
});
