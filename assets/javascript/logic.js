$(document).ready(function(){
    //global variable declaration
    var API_KEY = "dc6zaTOxFJmzC";
    var queryStr = "https://api.giphy.com/v1/gifs/search?q=";
    var limit = 10;
    var topics = ["dog", "cat", "snake"];

    displayButtons();

    //display topic buttons
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

    function displayGif(results){
        $("#gif-div").empty();
        results.forEach(element => {
            var gif = $("<img>");
            var card = $("<div>").addClass("card").append($("<div>").addClass("card-body").append($("<h5>").addClass("card-title").text("Rating: "+element.rating)))
            gif.addClass( "gif-img", "img-fluid");
            gif.attr("src", element.images.fixed_height_still.url);
            gif.attr("data-isStill", "1");
            gif.attr("data-still", element.images.fixed_height_still.url);
            gif.attr("data-animate", element.images.fixed_height.url)
            gif.attr("alt", "gif");
            card.append(gif);
            $("#gif-div").append(card);
        });
    }
    $("#add-topic-button").on("click", function(event){
        event.preventDefault();

        var t = $("#add-topic-field").val().trim();
        if(t != ""){
            topics.push(t);
            console.log(topics);
            displayButtons();
        }

    });

    $("#change-limit-button").on("click", function(event){
        event.preventDefault();
        var num = $("#change-limit-field").val().trim();
        var reg = /\d{1}/;
        if(reg.test(num)){
            limit = num;
        }
    });

    $(document).on("click", ".topic-button", function(event){
        event.preventDefault();
        
        var queryURL = queryStr + $(this).attr("data-topic") + "&api_key=" + API_KEY + "&limit=" + limit;
        console.log(queryURL);
        //Ajax GET Request to queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(res){
            var results = res.data;
            console.log (results);
            displayGif(results);
        });

    });

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


});