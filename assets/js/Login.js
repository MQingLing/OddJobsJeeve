//Api for sign up
$(document).ready(function () 
{
  //what kind of interface we want at the start 
  const APIKEY = "620e21dd34fd621565858705";
  
  getPlayerInfo();
  $("#success-login").hide();
  $('#modal').hide();
  $('.modal-bg').hide();	

  //[STEP 1]: Create our submit form listener
  $("#submit-button").on("click", function (e) {
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
      "username": userName,
      "password": passWord,
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
        
        $("#submit-button").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $(".sign-up-form").trigger("reset");
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function(response) 
    {
      console.log(response);
      
      $("#submit-button").prop( "disabled", false);
      
      //@TODO update frontend UI 
      $("#success-login").show().fadeOut(3000);

      //update our table 
      getPlayerInfo();
    });
  });//end click
  
  //[STEP] 6
  //let's create a function to allow you to retrieve all the information in your contacts
  //by default we only retrieve 10 results
  function getPlayerInfo(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://oddjobjeevegame-2add.restdb.io/rest/game-players",
      "method": "GET", //[cher] we will use GET to retrieve info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    }
    //[STEP 8]: Make our AJAX calls
    //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
    //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
    $.ajax(settings).done(function (response) {
      
      let content = "";

      for (var i = 0; i < response.length && i < limit; i++) {
        //console.log(response[i]);
        //[METHOD 1]
        //let's run our loop and slowly append content
        //we can use the normal string append += method
        /*
        content += "<tr><td>" + response[i].name + "</td>" +
          "<td>" + response[i].email + "</td>" +
          "<td>" + response[i].message + "</td>
          "<td>Del</td><td>Update</td</tr>";
        */

        //[METHOD 2]
        //using our template literal method using backticks
        //take note that we can't use += for template literal strings
        //we use ${content} because -> content += content 
        //we want to add on previous content at the same time
        content = `${content}<tr id='${response[i]._id}'>
        <td>${response[i].username}</td>
        <td>${response[i].password}</td>
        <td>${response[i].highscore}</td>
        <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' 
        data-sName='${response[i].username}' 
        data-sEmail='${response[i].password}'
        data-sId='${response[i].highscore}'>Update</a></td></tr>`;
      }

      //[STEP 9]: Update our HTML content
      //let's dump the content into our table body
    });
  }
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
    location.href = "../../assets/html/Level.html";
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

