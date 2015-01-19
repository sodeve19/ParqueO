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

          markers.push(marker);

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

});