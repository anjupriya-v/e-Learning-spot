function profileUpdate(form) {
  form.action = "/profile";
  form.method = "post";
  document.getElementsByClassName("successDiv")[0].style.display = "block";
  setTimeout(() => {
    document.getElementsByClassName("successDiv")[0].style.display = "none";
  }, 6000);
  return true;
}
