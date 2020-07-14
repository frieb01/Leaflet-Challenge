// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let geojson = "";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openlightmap.org/copyright'>Openlightmap</a> <strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

  let feature = data.features;

  feature.forEach(function(data){
    let color = '';
    if (data.properties.mag > 5) {
      color = "crimson";
    }
    else if (data.properties.mag > 4) {
      color = "tomato";
    }
    else if (data.properties.mag > 3) {
      color = "lightsalmon";
    }
    else if (data.properties.mag > 2) {
      color = "gold";
    }
    else if (data.properties.mag > 1) {
      color = "khaki";
    }
    else {
      color = "olive";
    }
    
    L.circle([data.geometry.coordinates[1],data.geometry.coordinates[0]], {
      fillOpacity: .75, 
      stroke: false,
      fillColor: color,
      radius: data.properties.mag * 25000
    }).bindPopup("<h3>Magnitude: " + data.properties.mag +
    "</h3><hr><p> Location: " + data.properties.place +
    "</p><p> Date: " + new Date(data.properties.time) + "</p>")
    .addTo(myMap);
  });

    // Set up the legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info-legend");
      let colors = ["#808000","#F0E68C","#FFD700","#FFA07A","#FF6347","#DC143C"];
      let labels = ["0","1","2","3","4","5"];

      for (let i = 0; i < colors.length; i++) {
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i><span>" + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "</span><br>" : "+");
      }
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
});