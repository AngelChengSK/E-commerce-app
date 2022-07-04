const navBar = document.querySelector('[data-nav-bar]');

window.onscroll = () => {
  if (!navBar.classList.contains('homepage')) return;
  
  if (window.pageYOffset > 0) {
    navBar.classList.add('white-background');
  } else {
    navBar.classList.remove('white-background');
  }
};
