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

//redirect to main page
document.querySelector(".menu-button").onclick = function () {
    location.href = "../../index.html";
};