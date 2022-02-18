/*customization
const text = '[ "https://assets2.lottiefiles.com/packages/lf20_72mk2fpb.json", "https://assets4.lottiefiles.com/private_files/lf30_fdnpwmcq.json" ]';
const myArr = JSON.parse(text);

$("#avatar").src = myArr[0];
*/

//Api 

//Button redirections
//redirect to homepage page
document.querySelector(".menu-button").onclick = function () 
{
    location.href = "../html/Homepage.html";
};

//redirect to game page
document.querySelector(".play-button").onclick = function () {
    location.href = "../../game.html";
};

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