var app = {
    
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        alert("onDeviceReady: function() {...");
        this.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(
            this.onGeolocationSuccess,
            this.onGeolocationError,
            { timeout: 120000 });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    },

    onGeolocationSuccess: function(position) {
        alert("onGeolocationSuccess: function(position) {...");
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');

        document.getElementById("lat").value = position.coords.latitude;
        document.getElementById("lng").value = position.coords.longitude;
    },
    
    onGeolocationError: function(err) {
        alert("onGeolocationError:function(position) {...");
        alert(err.code +" "+err.message);
    }
};
var Latitude = undefined;
var Longitude = undefined;

// Get geo coordinates

function getPicturesLocation() {

    navigator.geolocation.getCurrentPosition
    (onPicturesSuccess, onPicturesError, { enableHighAccuracy: true });

}

// Success callback for get geo coordinates

var onPicturesSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getPictures(Latitude, Longitude);
}

// Get pictures by using coordinates

function getPictures(latitude, longitude) {

    $('#pictures').empty();

    var queryString =
    "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=Your_API_Key&lat="
    + latitude + "&lon=" + longitude + "&format=json&jsoncallback=?";

    $.getJSON(queryString, function (results) {
        $.each(results.photos.photo, function (index, item) {

            var photoURL = "http://farm" + item.farm + ".static.flickr.com/" +
                item.server + "/" + item.id + "_" + item.secret + "_m.jpg";

            $('#pictures').append($("<img />").attr("src", photoURL));

           });
        }
    );
}

// Success callback for watching your changing position

var onPicturesWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getPictures(updatedLatitude, updatedLongitude);
    }
}

// Error callback

function onPicturesError(error) {

    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchPicturePosition() {

    return navigator.geolocation.watchPosition
    (onPicturesWatchSuccess, onPicturesError, { enableHighAccuracy: true });
}
app.initialize();