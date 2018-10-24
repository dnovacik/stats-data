import L from 'leaflet';
import axios from 'axios';

const BetterWMS = L.TileLayer.WMS.extend({
  
    onAdd: function (map) {
      // Triggered when the layer is added to a map.
      //   Register a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onAdd.call(this, map);
      map.on('click', this.getFeatureInfo, this);
    },
    
    onRemove: function (map) {
      // Triggered when the layer is removed from a map.
      //   Unregister a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onRemove.call(this, map);
      map.off('click', this.getFeatureInfo, this);
    },
    
    getFeatureInfo: function (evt) {
      // Make an AJAX request to the server and hope for the best
      var url = this.getFeatureInfoUrl(evt.latlng),
          showResults = L.Util.bind(this.showGetFeatureInfo, this);
      axios.get(url)
      .then(res => {
          console.log(res);
          var err = typeof res.data === 'string' ? null : res.data;
          showResults(err, evt.latlng, res.data)
      })
      .catch(err => {
          console.log(err);
          showResults(err);
      });
    },
    
    getFeatureInfoUrl: function (latlng) {
      // Construct a GetFeatureInfo request URL given a point
      var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
          size = this._map.getSize(),
          
          params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:3857',
            styles: this.wmsParams.styles,
            transparent: true,
            version: '1.1.0',      
            format: 'application/json', // same as below
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: this.wmsParams.layers,
            query_layers: this.wmsParams.layers,
            info_format: 'text/html' //can try application/json new geoserver can work with it
          };
      
      params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
      params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

      var url = this._url + L.Util.getParamString(params, this._url, false);
console.log(url);
      return url;
    },
    
    showGetFeatureInfo: function (err, latlng, content) {
      if (err) { console.log(err); return; } // do nothing if there's an error
      
      // Otherwise show the content in a popup, or something.
      L.popup({ maxWidth: 800})
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this._map);
    }
  });
  
  L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);  
  };

  export default BetterWMS;