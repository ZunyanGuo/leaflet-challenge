  // Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (response) {
    features = response.features;
    // Once we get a response, send the data.features object to the createFeatures function.
    let earthquakeMarkers = [];
    for (let i = 0; i < features.length; i++) {
        earthquakeMarkers.push(
            L.circle([features[i].geometry.coordinates[1],features[i].geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "white",
                fillColor: "red",
                radius: features[i].properties.mag *20000
                
            }))
      
      };

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let earthquake = L.layerGroup(earthquakeMarkers);

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};
// Create an overlay object.
let overlayMaps = {
    "Earthquake": earthquake
};

// Define a map object.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street, earthquake]
})
// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

});


