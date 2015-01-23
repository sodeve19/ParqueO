var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var service;
var infowindow;
var myLatlng;
var parking_garages_link;
var markers = [];
var place;
var start;
var end;
var cheapestPark = {};
var k = 0;
var SPmarker;


//$(document).on("ready page:load", function() {
function TaxiDirections(){

  console.log("taxi js");

  directionsDisplay = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    });
  directionsDisplay.setMap(map);
  if(navigator.geolocation) { 

    navigator.geolocation.getCurrentPosition(function(position) {
      myLatlng = new google.maps.LatLng(position.coords.latitude,
                                            position.coords.longitude);
      start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      // var infowindow = new google.maps.InfoWindow({
      //   map: map,
      //   position: myLatlng,
      //   content: 'You are here'
      // });

      map.setCenter(myLatlng);

      //-- Iba un GET

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
      deleteMarkers();
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
      end = new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D);
      calcRoute();
      
      $.get("/parking_garages", { latitude: place.geometry.location.k, longitude: place.geometry.location.D } , function( data ) {
        console.log(data);

        for(var i = 0; i < data.length; i++) {
          console.log(data[i]);
          var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
          
          var marker = new google.maps.Marker({
            position: ParLatlng,
            map: map,
            icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
            animation: google.maps.Animation.DROP,
            title: data[i].name,
            price: data[i].priceperhour
          });


          console.log(data[i].priceperhour);
          
          
          if(i != 0){
            if ( data[i].priceperhour < cheapestPark.price ){
              cheapestPark.price = data[i].priceperhour;
              cheapestPark.name = data[i].name;
              cheapestPark.position = ParLatlng;
            }
          } else {
            cheapestPark.price = data[i].priceperhour;
            cheapestPark.name = data[i].name;
            cheapestPark.position = ParLatlng;
          }


          markers.push(marker);

          google.maps.event.addListener(marker, 'click', function() {
              var infowindow = new google.maps.InfoWindow({
                content: "<div>" +  this.title + "</div>" + "Precio por hora: " + this.price
              });

              infowindow.open(map, this);
              console.log(this.price);
          });//(marker, i));

        
        };

        //console.log("cheapestPark " + cheapestPark.name);
        //$('#taxi').addClass('index-z');
        
      }, "json");

    }

    map.fitBounds(bounds);

    var listener = google.maps.event.addListener(map, "idle", function() { 
      if (map.getZoom() > 16) map.setZoom(16); 
      google.maps.event.removeListener(listener); 
    });
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

}


function calcRoute() {
  // var start = document.getElementById('start').value;
  // var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };


    // console.log("Hola cheapestPark" );
    // console.log(cheapestPark.position );
    // console.log( cheapestPark.name);


  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      
      if ( k != 0){
        deleteMarker(SPmarker);
      }


      SPmarker = new google.maps.Marker({
        position: cheapestPark.position,
        map: map,
        icon: 'http://www.google.com/mapfiles/markerP.png',
        animation: google.maps.Animation.DROP,
        title: cheapestPark.name,
        price: cheapestPark.price
      });
      k = 1;

      
      $('#taxi').addClass('index-z');
      //$("<%= j render partial: 'modal' %>").modal();
      //$('#myModal').modal('show');
      document.getElementById('parqueo').innerHTML = 
        "<strong>El parqueo más barato vale: </strong>" + cheapestPark.price + " <pesos></pesos> por hora y es " + cheapestPark.name;

      //Display the distance:
      document.getElementById('distance').innerHTML = 
         "Tu destino está a " + Math.round(response.routes[0].legs[0].distance.value / 1000) + " km de distancia y tiene una duración estimada de " + Math.round(response.routes[0].legs[0].duration.value / 60 ) + " mins";

      //Display the duration:
      // document.getElementById('duration').innerHTML = 
      //    "Duración: " + Math.round(response.routes[0].legs[0].duration.value / 60 ) + " mins";

      var time = (response.routes[0].legs[0].duration.value / 60 );
      var distance = (response.routes[0].legs[0].distance.value / 78);

      var costo = (2.700 + (distance * 83));

      if (costo < 4700) {
        costo = 4700;
      }

      document.getElementById('taxi-dis').innerHTML =
        "<strong>Costo aproximado del taxi: </strong>" + Math.round(costo) + " pesos";


      directionsDisplay.setDirections(response);
    } else {
      console.log(status);
    }
  });
}

function deleteMarker(marker) {
  marker.setMap(null);
}
 


















