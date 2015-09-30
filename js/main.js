console.log('Start of Javascript');

var markers = [];

var courses = [
          ['Flat Creek Club', '100 Flat Creek Road, Peachtree City, GA  30277', 33.401220, -84.581974,'Y'],
          ['Planterra Ridge Golf Club', '500 Clubhouse Drive, Peachtree City, GA  30269', 33.368640, -84.579885,'Y'],
          ['Whitewater Creek Country Club', '175 Birkdale Drive, Fayetteville, GA  30215', 33.379788, -84.506025,'Y'],
          ['Braelinn Golf Club', '500 Clubview Drive, Peachtree City, GA  30269', 33.366738, -84.541174,'Y'],
          ['White Oak Golf Course', '141 Clubview Drive, Newnan, GA  30265', 33.388039, -84.714745,'Y'],
          ['Canongate I Golf Club', '924 Shaw Road, Sharpsburg, GA  30277', 33.472314, -84.655453,'Y'],
          ['Georgia National Golf Club', '1715 Lake Dow Road, McDonough, GA  30252', 33.447990, -84.072739,'Y'],
          ['Heron Bay Golf Club', '5100 Heron Bay Boulevard, Locust Grove, GA  30248', 33.34008, -84.194749,'Y'],
          ['Sun City Peachtree Golf Club', '175 Del Webb Blvd, Griffin, GA  30223', 33.310159, -84.2373,'Y'],
          ['Orchard Hills Golf Club', '600 E. Highway 16, Newnan, GA  30223', 33.373607, -84.731265,'Y'],
          ['Summer Grove Gold Course', ' 335 Summergrove Pkwy, Newnan, GA  30223', 33.334669, -84.763384,'Y'],
    ];

var locations = courses.slice(0);

document.getElementById("searchFld").defaultValue = "";

function initialize() {
    console.log('Initialize');

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
                position: new google.maps.LatLng(locations[i][2], locations[i][3]),
                icon: 'images/red-dot.png',
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {

                    for (j = 0; j < locations.length; j++) {
                        markers[j].setIcon('images/red-dot.png');
                    }

                    var hldContent = "<b>" + locations[i][0] + "</b><br>" + locations[i][1] + "<br><a href='javascript:showPhotos(" + i + ")'>View Photos</a>";
                    infowindow.setContent(hldContent);
                    marker.setIcon('images/purple-dot.png');
                    infowindow.open(map, marker);
                }
            })(marker, i));

            markers.push(marker);

            hldHTML = hldHTML + "<li id='liCourse" + i + "'><a href='#' onclick='myClick(" + i + ");'><b>" + locations[i][0] + "</b><br><span style='font-size:11px;'>" + locations[i][1] + "</a></li>"
        }

        $(".courseList").html(hldHTML);

}

function myClick(id) {
    google.maps.event.trigger(markers[id], 'click');
    for (i = 0; i < locations.length; i++) {
        var liId = "#liCourse" + i;
        $(liId).css("border-left", "0px solid #FFF");
    }
    liId = "#liCourse" + id;
    $(liId).css("border-left", "4px solid #FFF");
}

function showPhotos(id){
    $("#flickrModal").css("display", "block");

}

function closePhotos(){
    $("#flickrModal").css("display", "none");

}

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

$(window).load(function () {
    console.log('Window Load');
    $("[data-toggle]").click(function () {
        var toggle_el = $(this).data("toggle");
        $(toggle_el).toggleClass("open-sidebar");
    });
    $(".swipe-area").swipe({
        swipeStatus: function (event, phase, direction, distance, duration, fingers) {
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

