//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.

$(document).on("ready page:load", function() {

  if(navigator.geolocation) {

    map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 15
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      var myLatlng = new google.maps.LatLng(position.coords.latitude,
                                            position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: myLatlng,
        content: 'Location found using HTML5.'
      });

      map.setCenter(myLatlng);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesnt support Geolocation
    handleNoGeolocation(false);
  }

  /* var myLatlng = new google.maps.LatLng(6.209851, -75.573120);
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: myLatlng,
    zoom: 15
  });

  var request = {
    location: myLatlng,
    radius: '500',
    types: ['store']
  }; */


  $.get( "", function( data ) {
    for(var i = 0; i < data.length; i++) {
      var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
      
      var marker = new google.maps.Marker({
        position: ParLatlng,
        map: map,
        title:"Hello World!"
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(data[i]);
          infowindow.open(map, marker);
        }
      })(marker, i));

      service = new google.maps.places.PlacesService(map);
      service.search(request, callback);
    };
  }, "json");
});

var map;
var service;
var infowindow;
//var myLatlng;


/*function initialize() {
  var myLatlng = new google.maps.LatLng(6.209851, -75.573120);
  $.get( "", function( data ) {
    for(var i = 0; i < data.length; i++) {
      var myLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
      map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: myLatlng,
        zoom: 15
      });

      var request = {
        location: myLatlng,
        radius: '500',
        types: ['store']
      };

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"Hello World!"
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(data[i]);
          infowindow.open(map, marker);
        }
      })(marker, i));

      service = new google.maps.places.PlacesService(map);
      service.search(request, callback);
    };
  }, "json");
}*/

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

