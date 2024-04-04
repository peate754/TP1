var map = L.map('map').setView([46.830106, -71.226742], 13);
 
L.control.Legend({
  position: "bottomleft",
  legends: [{
    label: "Autre",
    type: "image",
    url: "https://img.icons8.com/?size=512&id=WWo2enB6MtuP&format=png",
  },{
    label: "Burger",
    type: "image",
    url: "https://img.icons8.com/?size=512&id=65024&format=png"
  }, {
    label: "Pizza",
    type: "image",
    url: "https://img.icons8.com/?size=512&id=65012&format=png"
  
  
}]
})
.addTo(map);




var osm =L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



var esri = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
  {
  //attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
).addTo(map);	


  fetch('../donnee/bar.js')
    .then(response => response.json())
    .then(data => {
        // Créer une couche GeoJSON et ajouter les données à la carte
        L.geoJSON(data).addTo(map);
        L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
              // Utiliser la propriété 'cuisine' pour déterminer le symbole
              var type = feature.properties.cuisine;

              // Choisir un symbole en fonction du type (c'est un exemple, ajustez-le selon vos besoins)
              var iconUrl = getIconUrl(type);

              // Créer et retourner le marqueur avec l'icône personnalisée
              var customIcon = L.icon({
                  iconUrl: iconUrl,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
              });

              return L.marker(latlng, { icon: customIcon });
          }
      }).addTo(map);
  })
  .catch(error => {
      console.error('Erreur lors du chargement des données GeoJSON:', error);
  });

// Ajouter une échelle à la carte
L.control.scale().addTo(map);

// Fonction pour obtenir l'URL de l'icône en fonction du type
function getIconUrl(type) {
  // Ajoutez des conditions pour chaque type et retournez l'URL de l'icône correspondante
  switch (type) {
      case 'pizza':
          return 'https://img.icons8.com/?size=512&id=65012&format=png';
      case 'burger':
          return 'https://img.icons8.com/?size=512&id=65024&format=png';
      // Ajoutez d'autres cas selon vos types
      default:
          return 'https://img.icons8.com/?size=512&id=WWo2enB6MtuP&format=png';
  }
}
var controlMaps = {
  "Service d'images d'ESRI": esri,
  "Fond de carte OSM":osm,
  };
  L.control.layers(controlMaps).addTo(map);

  function onAccuratePositionError (e) {
    addStatus(e.message, 'error');
  }

  function onAccuratePositionProgress (e) {
    var message = 'Progressing … (Accuracy: ' + e.accuracy + ')';
    addStatus(message, 'progressing');
  }

  function onAccuratePositionFound (e) {
    var message = 'Most accurate position found (Accuracy: ' + e.accuracy + ')';
    addStatus(message, 'done');
    map.setView(e.latlng, 12);
    L.marker(e.latlng).addTo(map);
  }

  function addStatus (message, className) {
    var ul = document.getElementById('status'),
      li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    ul.className = className;
    ul.appendChild(li);
  }

  map.on('accuratepositionprogress', onAccuratePositionProgress);
  map.on('accuratepositionfound', onAccuratePositionFound);
  map.on('accuratepositionerror', onAccuratePositionError);

  map.findAccuratePosition({
    maxWait: 10000,
    desiredAccuracy: 20
  });