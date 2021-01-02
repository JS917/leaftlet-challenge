// Creating the map
var myMap = L.map("map", {
    center: [37.7749, -95.71],
    zoom: 3
  });
  
  // Adding a tile layer 
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "API_Key"
  }).addTo(myMap);

  // Geojson data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson";

// variable to keep geojson layer
var geojson;

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // selecting different colors from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // set radius from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
    // GeoJSON layer
    geojson = L.geoJson(data, {
      // Making circles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // the styles of circles
      style: styleInfo,
      // creating the popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " 
        + feature.properties.mag
        + "<br>Depth: " 
        + feature.geometry.coordinates[2]
        + "<br>Location: " 
        + feature.properties.place);
      }
    }).addTo(myMap);
  
    // adding the object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // Looping thhrough 
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  // Adding Legend to the map
    legend.addTo(myMap);
  });