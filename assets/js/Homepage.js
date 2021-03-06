//music player elements
var waitSong = document.getElementById("waitSong");
var music_icon = document.getElementById("music_icon");
waitSong.loop = true;

//music player interactability
music_icon.onclick = function()
{
    if(waitSong.paused)
    {
        waitSong.play();
        music_icon.className = "fas fa-volume-up";
    }
    else
    {
        waitSong.pause();
        music_icon.className = "fas fa-volume-mute";
    }
}

//logo elements
var logo = document.querySelector(".logo img");
var hey = document.getElementById("hey_sfx");

logo.classList.toggle('wiggle');

//logo interactability
logo.onclick = function()
{
    hey.play();
    logo.classList.remove('wiggle'); //if click, stop wiggle
    logo.classList.toggle('wiggleinterrupt');

    setTimeout(function() //only start wiggling again after 1.1s
    {
        logo.classList.remove('wiggleinterrupt');
        logo.classList.toggle('wiggle');
    },1100);
}

//redirect to avatar selection page
var startButton = document.querySelector(".start_button")

startButton.onclick = function () 
{
    location.href = "assets/html/Login.html";
}

//redirect to tutorial page
var startButton = document.querySelector(".intructions_button")

startButton.onclick = function () 
{
    location.href = "assets/html/tutorial.html";
}