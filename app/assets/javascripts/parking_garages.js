//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
var map;
var service;
var infowindow;
var myLatlng;
var parking_garages_link;
var markers = [];

$(document).on("ready page:load", function() {

  map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    });

  if(navigator.geolocation) { 

    navigator.geolocation.getCurrentPosition(function(position) {
      myLatlng = new google.maps.LatLng(position.coords.latitude,
                                            position.coords.longitude);
      parking_garages_link = "/parking_garages?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude;
  
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: myLatlng,
        content: 'You are here'
      });

      map.setCenter(myLatlng);

      // ------- AÑADO GET
      $.get("/parking_garages", { latitude: position.coords.latitude, longitude: position.coords.longitude } , function( data ) {
        console.log(data);
        for(var i = 0; i < data.length; i++) {
          console.log(data[i]);
          var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
          
          var marker = new google.maps.Marker({
            position: ParLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            title:"Hello World!"
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(data[i]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        };
      }, "json");
      
      // ------- FIN GET



    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesnt support Geolocation
    handleNoGeolocation(false);
  };

  //--------- INPUT SEARCH INIT
  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });



  //--------- END OF INPUT SEARCH

  var request = {
    location: myLatlng,
    radius: '500',
    types: ['store']
  }; 
  // console.log("hola sorel!!!")
  // $.get(parking_garages_link, function( data ) {
  //   console.log(data);
  //   for(var i = 0; i < data.length; i++) {
  //     console.log(i);
  //     var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
      
  //     var marker = new google.maps.Marker({
  //       position: ParLatlng,
  //       map: map,
  //       animation: google.maps.Animation.DROP,
  //       title:"Hello World!"
  //     });

  //     google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //       return function() {
  //         infowindow.setContent(data[i]);
  //         infowindow.open(map, marker);
  //       }
  //     })(marker, i));

  //     service = new google.maps.places.PlacesService(map);
  //     service.search(request, callback);
  //   };
  // }, "json");
});



function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

//google.maps.event.addDomListener(window, 'load', initialize);

