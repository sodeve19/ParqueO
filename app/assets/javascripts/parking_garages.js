//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.

$(document).ready(function() {
  initialize();
});

var map;
var service;
var infowindow;



function initialize() {
  var myLatlng = new google.maps.LatLng(6.209377,-75.571609);

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

  service = new google.maps.places.PlacesService(map);
  service.search(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

