# stats-data

	 	// We’ll add a tile layer to add to our map, in this case it’s a OSM tile layer.
	 	// Creating a tile layer usually involves setting the URL template for the tile images


	 	var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	 	    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	 	    osm = L.tileLayer(osmUrl, {
	 	        maxZoom: 18,
	 	        attribution: osmAttrib
	 	    });

    var wmsLayer = L.tileLayer.wms('http://45.77.64.136:8080/geoserver/gisdata/wms?', {
    layers: 'okresy',
    transparent: true,
    format: 'image/png'
});

	 	// initialize the map on the "map" div with a given center and zoom
	 	var map = L.map('map', {layers: [osm, wmsLayer]}).setView([19.04469, 72.9258], 12);



	 	// Script for adding marker on map click
	 	function onMapClick(e) {

	 	    var marker = L.marker(e.latlng, {
	 	        draggable: true,
	 	        title: "Resource location",
	 	        alt: "Resource Location",
	 	        riseOnHover: true
	 	    }).addTo(map)
	 	        .bindPopup(e.latlng.toString()).openPopup();

	 	    // Update marker on changing it's position
	 	    marker.on("dragend", function (ev) {

	 	        var chagedPos = ev.target.getLatLng();
	 	        this.bindPopup(chagedPos.toString()).openPopup();

	 	    });
	 	}

	 	map.on('click', onMapClick);
