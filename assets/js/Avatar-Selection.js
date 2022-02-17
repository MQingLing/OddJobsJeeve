<<<<<<< HEAD

//redirect to homepage page
document.querySelector(".menu-button").onclick = function () {
    location.href = "../html/Homepage.html";
};

//redirect to game page
document.querySelector(".play-button").onclick = function () {
    location.href = "../../game.html";
};
=======
//redirect to main page
document.querySelector(".submit-button").onclick = function () {
    location.href = "../html/Level.html";
};

//random color generator
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  
  function setRandomColor() {
    $("#colorpad").css("background-color", getRandomColor());
  }
>>>>>>> 0913792d6ff2dc977d258d4e3312595faf97eec3
