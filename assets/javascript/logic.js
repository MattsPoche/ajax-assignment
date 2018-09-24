$(document).ready(function(){
    //global variable declaration
    var API_KEY = "dc6zaTOxFJmzC";
    var queryStr = "https://api.giphy.com/v1/gifs/search?q=";
    var limit = 10;
    var topics = ["dog", "cat", "snake"];
    var favorites = [];

    displayButtons();

    //Create new topic buttons and add to page
    function displayButtons(){
        $("#topic-buttons").empty();
        for(var i = 0; i < topics.length; i++){
            var tbutton = $("<button>");
            tbutton.addClass("topic-button btn btn-primary");
            tbutton.text(topics[i]);
            tbutton.attr("type", "button");
            tbutton.attr("data-topic", topics[i]);
            $("#topic-buttons").append(tbutton);
        }
    }
    //display gifs and releated information from query result on the page
    function displayGif(results){
        $("#gif-div").empty();
        results.forEach(element => {
            var gif = $("<img>");
            var card = $("<div>").addClass("card").append($("<div>").addClass("card-body").append($("<h5>").addClass("card-title").text("Rating: "+element.rating)))
            var fbutton = $("<button>").addClass("btn btn-primary addTo-favorite-button").text("Add to Favorites");
            gif.addClass( "gif-img", "img-fluid");
            gif.attr("src", element.images.fixed_height_still.url);
            gif.attr("data-isStill", "1");
            gif.attr("data-still", element.images.fixed_height_still.url);
            gif.attr("data-animate", element.images.fixed_height.url)
            gif.attr("data-rating", element.rating);
            gif.attr("alt", "gif");
            card.append(gif);
            card.append(fbutton);
            $("#gif-div").append(card);
        });
    }
    //display favorites on the page
    function displayFavorites(){
        $("#gif-div").empty();
        for(var i = 0; i < favorites.length; i++){
            var element = favorites[i];
            var gif = $("<img>");
            var card = $("<div>").addClass("card").append($("<div>").addClass("card-body").append($("<h5>").addClass("card-title").text("Rating: "+element.rating)))
            var fbutton = $("<button>").addClass("btn btn-primary remove-favorite-button").text("Remove from Favorites");
            gif.addClass( "gif-img", "img-fluid");
            gif.attr("src", element.still);
            gif.attr("data-isStill", "1");
            gif.attr("data-still", element.still);
            gif.attr("data-animate", element.animate);
            gif.attr("data-rating", element.rating);
            gif.attr("data-index", i);
            gif.attr("alt", "gif");
            card.append(gif);
            card.append(fbutton);
            $("#gif-div").append(card);
        }
    }
    //when add-topic-button is clicked, add new topic to topics array and run displayButtons
    $("#add-topic-button").on("click", function(event){
        event.preventDefault();

        var t = $("#add-topic-field").val().trim();
        if(t != ""){
            topics.push(t);
            displayButtons();
        }

    });
    //on click, change the number of resultes returned by  query
    $("#change-limit-button").on("click", function(event){
        event.preventDefault();
        var num = $("#change-limit-field").val().trim();
        //regular expression
        var reg = /\d{1}/;
        //num must be a numeric value
        if(reg.test(num)){
            limit = num;
        }
    });
    //on click run displayFavorites
    $("#show-favorite-button").on("click", function(event){
        event.preventDefault();
        displayFavorites();
    });
    //on click, querry Giphy for topic 
    $(document).on("click", ".topic-button", function(event){
        event.preventDefault();
        
        var queryURL = queryStr + $(this).attr("data-topic") + "&api_key=" + API_KEY + "&limit=" + limit;
        //Ajax GET Request to queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(res){
            var results = res.data;
            displayGif(results);
        });

    });
    //when gif is clicked, toggle src attribute to an animated gif or a still gif
    $(document).on("click", ".gif-img", function(event){
        event.preventDefault();

        if($(this).attr("data-isStill") === "1"){
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-isStill", "0");
        }else{
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-isStill", "1");
        }
    });
    //on click add to favorites
    $(document).on("click", ".addTo-favorite-button", function(event){
        event.preventDefault();

        var gif = $(this).parent().find("img");

        //add an anonymous object that represents the favorited gif to the favorites array
        favorites.push({
            "animate": $(gif).attr("data-animate"),
            "still": $(gif).attr("data-still"),
            "rating": $(gif).attr("data-rating")
        });
    });
    //on click removes gif from the favorites array and calls displayFavorites

    $(document).on("click", ".remove-favorite-button", function(event){
        event.preventDefault();

        var gif = $(this).parent().find("img");
        favorites.splice(gif.attr("data-index"), 1);
        displayFavorites();        
    });


});