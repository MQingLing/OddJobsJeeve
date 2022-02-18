/*customization
const text = '[ "https://assets2.lottiefiles.com/packages/lf20_72mk2fpb.json", "https://assets4.lottiefiles.com/private_files/lf30_fdnpwmcq.json" ]';
const myArr = JSON.parse(text);

$("#avatar").src = myArr[0];
*/


//Api 
$(document).ready(function () 
{
  //what kind of interface we want at the start 
  const APIKEY = "620e21dd34fd621565858705";
  
  //getPlayerInfo();
  $("#success-login").hide();

  //[STEP 1]: Create our submit form listener
  $(".play-button").on("click", function (e) {
    //prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: let's retrieve form data
    //for now we assume all information is valid
    //you are to do your own data validation
    let userName = $("#username").val();
    let passWord = $("#password").val();

    //[STEP 3]: get form values when user clicks on send
    //Adapted from restdb api
    let jsondata = {
      "username": studentName,
      "password": studentEmail,
      "highscore": 0
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://oddjobjeevegame-2add.restdb.io/rest/game-players",
      "method": "POST", //[cher] we will use post to send info
      "headers": 
      {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      
      "beforeSend": function()
      {
        //@TODO use loading bar instead
        //disable our button or show loading bar
        
        $(".play-button").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $("#username").value = '';
        $("#password").value = '';
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function(response) 
    {
      console.log(response);
      
      $(".play-button").prop( "disabled", false);
      
      //@TODO update frontend UI 
      $("#success-login").show().fadeOut(3000);

      //update our table 
      //getContacts();
    });
  });//end click 
});

//Button redirections
//redirect to homepage page
document.querySelector(".menu-button").onclick = function () 
{
    location.href = "../html/Homepage.html";
};

//redirect to game page
document.querySelector(".play-button").onclick = function () 
{
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
$('.signup-button').click(function(){
    $('#modal').css('display','block');
    $('.modal-bg').fadeIn();
});

$('#close').click(function(){
        $('.modal-bg').fadeOut();		
        $('#modal').fadeOut();
    return false;
});

