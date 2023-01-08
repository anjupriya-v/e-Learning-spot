let textLength = 0;
let text =
  " Stand out with a project experience and certification in your resume";
type = () => {
  let textChar = text.charAt(textLength++);
  let paragraph = document.getElementById("typed");
  let charElement = document.createTextNode(textChar);
  paragraph.appendChild(charElement);
  if (textLength < text.length + 1) {
    setTimeout("type()", 100);
  } else {
    text = "";
  }
};
document.addEventListener("DOMContentLoaded", function () {
  type();
});
