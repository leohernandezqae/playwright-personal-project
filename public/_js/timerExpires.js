import { checkAuth, getTokenRemainingTime } from './auth.js';

checkAuth(); // initial check

const timerEl = document.getElementById("sessionTimer");

function startCountdown() {
  const interval = setInterval(() => {
    const remaining = Math.floor(getTokenRemainingTime());
    if (remaining <= 0) {
      clearInterval(interval);
      timerEl.textContent = "Session expired!";
      checkAuth(); // redirect
    } else {
      timerEl.textContent = `Session expires in: ${remaining}s`;
    }
  }, 1000);
}

startCountdown();
