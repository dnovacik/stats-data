import L from 'leaflet';

const BetterWMS = L.TileLayer.WMS.extend({
});
  
  L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);  
  };

  export default BetterWMS;