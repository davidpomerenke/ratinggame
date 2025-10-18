export const createConfetti = () => {
  if (typeof window === 'undefined') return;
  
  const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    const duration = 2000 + Math.random() * 1000;
    const fallDistance = window.innerHeight + 20;
    const sway = (Math.random() - 0.5) * 100;
    
    confetti.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${sway}px, ${fallDistance}px) rotate(${360 * (Math.random() + 1)}deg)`, opacity: 0 }
    ], {
      duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
  }
};

