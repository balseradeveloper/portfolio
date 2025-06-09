
  const nav = document.querySelector('.navbar');
  const leftBtn = document.querySelector('.nav-arrow.left');
  const rightBtn = document.querySelector('.nav-arrow.right');

  leftBtn.addEventListener('click', () => {
    nav.scrollBy({ left: -150, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    nav.scrollBy({ left: 150, behavior: 'smooth' });
  });

