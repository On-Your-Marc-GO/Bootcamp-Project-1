$(document).ready(function () {
  
  // GET ARTIST INFO FROM FORM AND RESET IT
  function getArtistInfo() {
    artistName = $(".onlyArtistInput").val().trim();
    $(".home-page").removeClass("active");
    $(".searchInfo").addClass("hide");
    $(".songInfoDiv").addClass("hide");
    $(".artistInfoDiv").removeClass("hide");
    getSimilarArtists();
    $(".onlyArtistInput").val("");
  }

  // SEARCH FOR SIMILAR ARTISTS BY ARTIST NAME - LASTFM API
  function getSimilarArtists() {
    var apiKey = "da538ed1310540e471c7324ad05cf95f";
    var queryURL = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName}&api_key=${apiKey}&format=json`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (data) {
      renderSimilarArtists(data);
    });
  }

  // GET ARTIST INFO PUSH IT TO ARRAY
  function renderSimilarArtists(data) {
    for (var i = 0; i < 100; i++) {
      var similarArtist = data.similarartists.artist[i].name;
      similarResultsArr.push(similarArtist);
    }
    getNapsterArtistInfo();
  }

  // ARTIST INFO TO GET MORE ARTIST DETAILS - NAPSTER API
  function getNapsterArtistInfo() {
    for (var i = 0; i < similarResultsArr.length; i++) {
      var simArtistName = similarResultsArr[i];
      simArtistName = simArtistName.replace(/\W+/g, "-").toLowerCase();
      var apiKey = "ZmJjMTczNmQtZjM2Yy00ZDI4LWJmOGYtZTE4MDRhNjQyZGMw";
      var queryURL = `http://api.napster.com/v2.2/artists/${simArtistName}?apikey=${apiKey}`;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (data) {
        if (data.artists.length === 1 && data.artists[0].bios) {
          renderArtistInfo(data);
        }
      });
    }
  }

  // USING NAPSTER ARTIST DATA, RENDER RELEVANT INFO ON PAGE
  function renderArtistInfo(data) {
    $('.userArtistChoice').text(artistName.toUpperCase());
    var artistCardDiv = $("<div>");
    artistCardDiv.addClass("card col s6");
    var artistInfoDiv = $("<div>");
    artistInfoDiv.addClass("card-content");
    var artistInfoBio = $("<p>");
    artistInfoBio.html(data.artists[0].bios[0].bio);
    var artistTopSongsDiv = $("<div>");
    artistTopSongsDiv.addClass("card-action");
    var artistTopSongsButton = $("<button>");
    artistTopSongsButton.addClass("btn waves-effect waves-light topSongsBtn");
    artistTopSongsButton.attr("data-artist", data.artists[0].id);
    artistTopSongsButton.text("Top Songs");
    artistInfoDiv.append(artistInfoBio);
    artistTopSongsDiv.append(artistTopSongsButton);
    artistCardDiv.append(artistInfoDiv);
    artistCardDiv.append(artistTopSongsDiv);

    var artistID = data.artists[0].id;
    var apiKey = "ZmJjMTczNmQtZjM2Yy00ZDI4LWJmOGYtZTE4MDRhNjQyZGMw";
    var queryURL = `http://api.napster.com/v2.2/artists/${artistID}/images?apikey=${apiKey}`;
    
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (imageData) {
      var artistCardImgDiv = $("<div>");
      artistCardImgDiv.addClass("card-image");
      var artistImg = $("<img>"); 
      var artistImgName = $("<span>");
      artistImgName.addClass("card-title");
      artistImgName.text(data.artists[0].name); 
      if (imageData.images.length >= 4) {
        artistImg.attr("src", imageData.images[3].url);
      } else if (imageData.images.length > 0 && imageData.images.length < 4) {
        artistImg.attr("src", imageData.images[1].url);
      } else {
        artistImg.attr("src", "assets/pics/rectangleplaceholder.png");
      }
      artistCardImgDiv.append(artistImg);
      artistCardImgDiv.append(artistImgName);
      artistCardDiv.prepend(artistCardImgDiv);
      $(".userArtistDiv").append(artistCardDiv);
    });
  }

  // GET TOP SONGS BY ARTIST ID - NAPSTER API
  function getTopSongs() {
    var apiKey = "ZmJjMTczNmQtZjM2Yy00ZDI4LWJmOGYtZTE4MDRhNjQyZGMw";
    var artistID = $(this).attr("data-artist");
    var queryURL = `http://api.napster.com/v2.2/artists/${artistID}/tracks/top?apikey=${apiKey}`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (data) {
      renderTopSongs(data);
    });
  }

  // USING NAPSTER DATA, RENDER TOP SONGS ON PAGE
  function renderTopSongs(data) {
    console.log(data);
    $(".songInfoDiv").addClass("hide");
    $(".searchInfo").addClass("hide");
    $(".lyricInfo").addClass("hide");
    $(".artistInfoDiv").addClass("hide");
    $(".topSongsInfoDiv").removeClass("hide");
  }

  // EVENT LISTENERS
  $(".submitArtistBtn").click(function (event) {
    event.preventDefault();
    if ($(".onlyArtistInput").val() === "") {
      M.toast({ html: "Must include artist or band name", classes: "toast" });
      return;
    } else {
      getArtistInfo();
    }
  });

  $("#artistR2").click(function () {
    $(".songForm").addClass("hide");
    $(".artistForm").removeClass("hide");
  });


  $(".returnArtistsBtn").click(function () {
    $(".artistInfoDiv").removeClass("hide");
    $(".topSongInfoDiv").addClass("hide");
    $(".searchInfo").addClass("hide");
    $(".lyricInfo").addClass("hide");
  });

  $(document).on("click", ".topSongsBtn", getTopSongs);

})