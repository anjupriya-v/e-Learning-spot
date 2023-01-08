window.onscroll = () => {
  const nav = document.getElementsByClassName("navbar")[0];
  const navButton = document.getElementsByClassName("navButton")[0];
  if (this.scrollY <= 10) {
    nav.className =
      "navbar navbar-expand-lg navbar-light bg-transparent fixed-top ";
    navButton.className = "navbar-toggler navButton";
  } else {
    nav.className = " navbar navbar-expand-lg navbar-light  fixed-top  scroll";
    navButton.className = "navbar-toggler navButton navToggleButton";
  }
};
