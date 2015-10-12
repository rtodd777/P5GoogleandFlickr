// Global Variables
var viewModal = {
	modalTitle: ko.observable(),
	modalImage: ko.observable(),
	modalLinks: ko.observable(),
	newStyles: ko.observable(),
	newStyle2: ko.observable()
};


var markers = [];
var hldHTML;
var cleanHTML;

var locations = courses.slice(0);

document.getElementById("searchFld").defaultValue = "";

// Initialize the Map with the Markers and the List
function initialize() {
	console.log('Initialize');

	$("#flickrModal").hide();

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: new google.maps.LatLng(33.444735, -84.453223),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	var marker, i;
	var hldHTML = "<ul>";

	for (i = 0; i < locations.length; i++) {

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
			icon: 'images/red-dot.png',
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
		    return function () {

		        for (j = 0; j < locations.length; j++) {
		            markers[j].setIcon('images/red-dot.png');
		        }

		        var hldContent = "<div class='infoTitle'>" + locations[i].name + "</div><div class='infoAddress'>" + locations[i].address + "<br><a href='javascript:showPhotos(" + i + ")'>View Photos</a></div>";
		        infowindow.setContent(hldContent);
		        marker.setIcon('images/purple-dot.png');
		        infowindow.open(map, marker);
		        myClick(i, "N");
		    };
		})(marker, i));

		markers.push(marker);

		hldHTML = hldHTML + "<li id='liCourse" + i + "'><a href='#' onclick='myClick(" + i + ");'><span class='lstTitle'>" + locations[i].name + "</span><br><span class='lstAddress'>" + locations[i].address + "</span></a></li>";
	}

    viewModal.modalLinks(hldHTML);

}

// Click the Golf Course and Highlight the List Element with the Left Border
function myClick(id, clickChk) {
	if (clickChk != "N") {
		google.maps.event.trigger(markers[id], 'click');
	}

    // Turn Off all of the List Highlights
	for (i = 0; i < locations.length; i++) {
		var liId = "#liCourse" + i;
		viewModal.newStyle2("border-left", "2px solid #FFF");
//		$(liId).css("border-left", "0px solid #FFF");
	}

    // Turn on the Specific Item Highlight
	liId = "#liCourse" + id;
	viewModal.newStyle2("border-left", "4px solid #FFF");
//	$(liId).css("border-left", "4px solid #FFF");
}

// More Photos was Clicked, Pull in the Photos from Flickr
function showPhotos(id) {
	var hldHTML = "<h1>Flicker Photos: " + locations[id].name + "</h1>";
	viewModal.modalTitle(hldHTML);

	var hldTitle = locations[id].name;
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c43c5ecda12e41d036d137b1ebb239b8&tags=golf&text=" + hldTitle + "&safe_search=2&per_page=20";
	var src;
	var imgCounter = 0;
	hldHTML = "<ul class='row'>";
	$.getJSON(url + "&format=json&jsoncallback=?", function (data) {
	    $.each(data.photos.photo, function (i, item) {
	        src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
	        hldHTML = hldHTML + "<li class='col-lg-2 col-md-2 col-sm-3 col-xs-4'><img class='img-responsive' src='" + src + "' alt='" + item.title + "' /></li>";
	        imgCounter++;
	        if (i == 10) return false;
	    })
	    if (imgCounter == 0) {
	        hldHTML = hldHTML + "<li class='col-lg-2 col-md-2 col-sm-3 col-xs-4'><img class='img-responsive' src='images/noimages.jpg' alt='No Images Available' /></li>";
	    };
	    hldHTML = hldHTML + "</ul>";
	    viewModal.modalImage(hldHTML);
	    $("#flickrModal").slideDown('slow');
	}).fail(function () {
	        console.log("Error in the JSON Flickr Request");
	    });

}

// Close the Modal Window
function closePhotos() {
	$("#flickrModal").hide();
}

// Search the Course Listing (Filters the List)
function searchCourses() {
	var hldText = document.getElementById("searchFld").value;
	hldText = hldText.toLowerCase();
	locations = [];
	var aryPointer = 0;

	for (i = 0; i < courses.length; i++) {
		for (j = 0; j < 2; j++) {
			hldArray = courses[i][j];
			hldArray = hldArray.toLowerCase();
			if (hldArray.indexOf(hldText) != -1) {
				locations[aryPointer] = courses[i];
				aryPointer = aryPointer + 1;
				break;
			}
		}
	}
	deleteMarkers();
	initialize();
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}

// Some follow up activites with the Slider
$(window).load(function() {
	$("[data-toggle]").click(function() {
		var toggle_el = $(this).data("toggle");
		$(toggle_el).toggleClass("open-sidebar");
	});
	$(".swipe-area").swipe({
		swipeStatus: function(event, phase, direction, distance, duration, fingers) {
			if (phase == "move" && direction == "right") {
				$(".container").addClass("open-sidebar");
				return false;
			}
			if (phase == "move" && direction == "left") {
				$(".container").removeClass("open-sidebar");
				return false;
			}
		}
	});
});

ko.applyBindings(viewModal);
