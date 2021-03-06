//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.

var map;
var service;
var infowindow;
var myLatlng;
var parking_garages_link;
var markers = [];
//var markers_my_pos = [];
var place;
var h = 0;
var newLatlng;
var myPositionCURRENT;


function ParkingLots(){

//$(document).on("ready page:load", function() {

  console.log("parking_garages java");

  map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 16
    });

  if(navigator.geolocation) { 

    navigator.geolocation.getCurrentPosition(function(position) {
      myLatlng = new google.maps.LatLng(position.coords.latitude,
                                            position.coords.longitude);
      parking_garages_link = "/parking_garages?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude;
  
      // var infowindow = new google.maps.InfoWindow({
      //   map: map,
      //   position: myLatlng,
      //   content: 'You are here'
      // });

      var myPosition = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: 'http://maps.google.com/mapfiles/arrow.png',
        title:'You are here'
      });


      map.setCenter(myLatlng);

      // ------- AÑADO GET
      $.get("/parking_garages", { latitude: position.coords.latitude, longitude: position.coords.longitude } , function( data ) {
        console.log("PRIMER GET");
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
              //console.log(this.title);
          });//(marker, i));
        };

        console.log("cheapestPark " + cheapestPark.name);
        $('#parque-panel').addClass('index-z');
        $('#parque').append("El parqueadero más barato es <strong>" + cheapestPark.name + "</strong> y vale <strong>" + cheapestPark.price + "</strong> pesos");

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
      // console.log(place.geometry.location.k);

      // console.log(place.geometry.location.D);

      $.get("/parking_garages", { latitude: place.geometry.location.k, longitude: place.geometry.location.D } , function( data ) {
        console.log("GET");
        console.log(data);

        for(var i = 0; i < data.length; i++) {
          console.log(data[i]);
          var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
          
          var marker = new google.maps.Marker({
            position: ParLatlng,
            map: map,
            icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
            animation: google.maps.Animation.DROP,
            title: data[i].name
          });

          markers.push(marker);

          google.maps.event.addListener(marker, 'click', function() {
              var infowindow = new google.maps.InfoWindow({
                content: this.title
              });

              infowindow.open(map, this);
              console.log(this.title);
          });
        };

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
//});

  


}

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

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  console.log("markers =" + markers + "!!!");
  markers = [];
}

function updatePosition() {

  if(navigator.geolocation) { 

    navigator.geolocation.getCurrentPosition(function(position) {
      //console.log(position);
      newLatlng = new google.maps.LatLng(position.coords.latitude,
                                            position.coords.longitude);
    
      $.get("/parking_garages", { latitude: position.coords.latitude, longitude: position.coords.longitude } , function( data ) {
        //console.log("GET EN CURRENT LOCATION");
        for(var i = 0; i < data.length; i++) {
          console.log(data[i]);
          var ParLatlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
          
          var marker = new google.maps.Marker({
            position: ParLatlng,
            map: map,
            icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
            //animation: google.maps.Animation.DROP,
            title: data[i].name,
            price: data[i].priceperhour
          });

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
              //console.log(this.title);
          });//(marker, i));
        };

        console.log("cheapestPark " + cheapestPark.name);
        //$('#parque-panel').addClass('index-z');
        $('#parque').html("El parqueadero más barato es <strong>" + cheapestPark.name + "</strong> y vale <strong>" + cheapestPark.price + "</strong> pesos");

      }, "json");


    });

  };
    //console.log("UPDATE " + position.coords.latitude);

    // if ( h != 0 ) {
    //   deleteMarker(myPositionCURRENT);
    //   //deleteMarkers_mypos(myPositionCURRENT);
    // }

    myPositionCURRENT = new google.maps.Marker({
      position: newLatlng,
      map: map,
      icon: 'http://maps.google.com/mapfiles/arrow.png',
      title:'You are here'
    });

    if(self.uniqueMarker && self.uniqueMarker.setMap)
    //Delete old marker from map.
      self.uniqueMarker.setMap(null);
      self.uniqueMarker = myPositionCURRENT;
      // google.maps.event.addListener(marker, 'click', function() {
      //   if (confirm('Do you want to add inspection details for this property?') === true) {
      //       Appery.navigateTo('AddDetails');
      //   }
      // });

    //markers_my_pos.push(myPositionCURRENT);
    console.log(myPositionCURRENT.position);
    h = 1;
  
}

//google.maps.event.addDomListener(window, 'load', initialize);

