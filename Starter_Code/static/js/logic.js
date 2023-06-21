  // Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(mag){
  return mag *15000
};
function choosecolor(depth){
  if (depth > -10 && depth <= 10){return "rgb(95, 255, 0)";
  }else if (depth > 10 && depth <= 30){return "rgb(200, 255, 0)";
  }else if (depth > 30 && depth <= 50){return "rgb(240, 220, 0)";
  }else if (depth > 50 && depth <= 70){return "rgb(255, 155, 0)";
  }else if (depth > 70 && depth<= 90){return "rgb(255, 120, 60)";
  }else if (depth > 90){return "rgb(255, 70, 60)"};

};
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
                color: "black",
                fillColor: choosecolor(features[i].geometry.coordinates[2]),
                radius: markerSize(features[i].properties.mag)
                
            }).bindPopup(`<h1>${features[i].properties.place}</h1> <hr> <h3>Depth: ${features[i].geometry.coordinates[2]} km</h3>`))
      
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
  
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'legend');
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Set the background color
    div.style.padding = '15px'; // Increase the padding
    div.style.borderRadius = '5px'; // Increase the border radius

    

    let depthRanges = [
      { label: '-10-10 ', color: 'rgb(95, 255, 0)' },
      { label: '10-30 ', color: 'rgb(200, 255, 0)' },
      { label: '30-50 ', color: 'rgb(240, 220, 0)' },
      { label: '50-70 ', color: 'rgb(255, 155, 0)' },
      { label: '70-90 ', color: 'rgb(255, 120, 60)' },
      { label: '90+ ', color: 'rgb(255, 70, 60)' }
    ];

    depthRanges.forEach(function (range) {
      
      let legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = `
        <div class="legend-color" style="background-color: ${range.color}"></div>
        <div>${range.label}</div>
      `;
    
      div.appendChild(legendItem);
    });

    return div;
  };

  legend.addTo(myMap);

});



