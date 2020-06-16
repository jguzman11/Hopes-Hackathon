// Run function checkItem on click of 'submit' button
document.getElementById('submit').addEventListener('click', checkItem);

// RegExp for userInput Variable
function stringCheck(str){
  var remove = /[\W_]/g;
  var lowerStr = str.toLowerCase().replace(remove, '');
  return lowerStr;
}

// Function to create HTML element
const createNode = (element) => {
  return document.createElement(element);
};

// Function to insert HTML elements appropriately
const append = (parent, child) => {
  return parent.appendChild(child);
};

/* Function that converts user input, uses that input to fetch the appropriate
API, and assign the returned objects data to the correct HTML elements */
function checkItem(event){
  reset();
  const userInput = document.getElementById('searchbar').value;
  let endPoint = stringCheck(userInput);
  event.preventDefault();
  fetch(`http://localhost:5000/api/items/${endPoint}`)
  .then((res) => res.json())
  .then((data) => {
    const array = [data];
    return array.map((item) =>{
      let itemBox = createNode('div');
      let name = createNode('h3');
      let description = createNode('p');
  
      name.innerText = `${item.name}`;
      description.innerText = `${item.description}`;
  
      append(resultBox, itemBox);
      append(itemBox, name);
      append(itemBox, description);
    
    });
         
  })
  .catch((err) => {
    alert('No matching results! Please try again.');
    console.log(err);
  });
}

// Function to reset the innerHTML set up by the previous function
function reset(){
  document.getElementById('resultBox').innerHTML = '';
}


/// THIS IS ME

  
/*********** GOOGLE MAP AND PLACES API CODE ****************/
  // infoWindow that allows us to use the geoLocation API
var map, infoWindow;

// Initialize map values 
// with this function that contain an OBJECT
function createMap () {
  var options = {
    // sets Center of map // default
    center: { lat: 43.654, lng: -79.383 },
    // how close we are zoomed in
    zoom: 10
  };

  /* Create a new map and set the 'options' properties based on the geolocation api 
  from google */
  // call the Map Constructor to Get the Map to Render
  map = new google.maps.Map(document.getElementById('map'), options);
  // this is a reference which is included with our API
  infoWindow = new google.maps.InfoWindow;

  // if user has Location Enabled on thier device we can use it
  // checks within the browser to see if geoLO is available
  if (navigator.geolocation) {
    // 
    navigator.geolocation.getCurrentPosition(function (p) {
     // why?- we need to get our object into the format of a coordinate that Google maps expects
      var position = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };

      // here We set the position of (infoW) to be this Position that we just created
      infoWindow.setPosition(position);
      infoWindow.setContent('Your location!');
      // opens map
      infoWindow.open(map);
      map.setCenter(position);
    }, 
    // second call back just in case of an error 
    function () {
      handleLocationError('Geolocation service failed', map.getCenter());
    });
  } else { 
    // this just stays in the center because we have no Location
    handleLocationError('No geolocation available.', map.getCenter());
  }



// Enabled PLACES API library in our Script to allow us to search up a place

  // Takes in User input and sets the search value on the Places API
  // initialize that input
  var input = document.getElementById('search');

  // we initialize the searchBox here and this is a google maps CONSTRUCTOR 
  var searchBox = new google.maps.places.SearchBox(input);

  // Makes Search results show Near You spots
  // Set the bounds on the search box to the same of the map
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  // NOW  we want to see the SEARCH results Soo.
  // Empty array of Map Markers is initialized/ search results
  var markers = [];
  
  // fires when the user selects a prediction from the list 
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    // if no other places were found [empty]
    if (places.length == 0)
    // then we just want to return
      return;
      
      // CALLBACK gets rid of the MARKERS placed when you Search
      // (m) is our current marker and .setMAP(null) gets rid of Map Reference..
    markers.forEach(function (m) { m.setMap(null); });
    // reset the markers Array back to an empty array
    markers = [];

    // bounds Object, is the COORDINATES boundaries of our map 
    var bounds = new google.maps.LatLngBounds();

    // check to see if we have Data to be given a position on the map
    places.forEach(function(p) {
      if (!p.geometry)
      // return back
        return;

      // Constructor- Placing new map markers into the Markers Array if  new locoation
      // this accepts an Array of options
      markers.push(new google.maps.Marker({
        //attributes
        map: map,
        title: p.name, 
        // geo obj, loc attribute
        position: p.geometry.location
      }));

      // Expand and contract the zoom level of map depending on marker placement
      if (p.geometry.viewport)
        bounds.union(p.geometry.viewport);
      else
        bounds.extend(p.geometry.location);
    });
    // call fitBounds pass it those bounds to put them into effect
    map.fitBounds(bounds);
  });
  
}

// handles the error 
function handleLocationError (content, position) {
  infoWindow.setPosition(position);
  infoWindow.setContent(content);
  infoWindow.open(map);
}






  