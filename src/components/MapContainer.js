import React, {
    Component
} from 'react';
import L, {
    Map,
    TileLayer
} from 'leaflet';
import BetterWms from './L.TileLayer.BetterWMS';
import axios from 'axios';

class MapContainer extends Component {
    constructor() {
        super();

        this.state = {
            leafletMap: null,
            wmsLayers: ['cr_obce', 'sk_obce', 'sk_obce_v_zas'],
            layers: [
                new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
                }),
                new BetterWms('http://45.77.64.136:8080/geoserver/gisdata/wms?tiled=true', {
                    layers: ['cr_obce', 'sk_obce', 'sk_obce_v_zas'],
                    transparent: true,
                    format: 'image/png',
                    opacity: 0.6,
                    crossOrigin: true
                })
            ]
        }
    }

    // wait for leaflet map initialization and set to state, then bind all wanted events in callback
    componentDidMount() {
        let map = new Map('map', {
            center: [48, 19],
            zoom: 12,
            layers: this.state.layers
        });

        this.setState({ leafletMap: map }, () => {
            this.state.leafletMap.on('click', this.handleMapClick);
        });
    }

    handleMapClick = (event) => {
        this.getFeatureInfo(event.latlng);
    }

    getFeatureInfo = (latlng) => {
        let url = this.getFeatureInfoUrl(latlng);

        axios.get(url)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }

    getFeatureInfoUrl = (latlng) => {
        const map = this.state.leafletMap;
        const serverUrl = 'http://45.77.64.136:8080/geoserver/gisdata/wms';

        var crs = map.options.crs,
            sw = crs.project(map.getBounds().getSouthWest()),
            ne = crs.project(map.getBounds().getNorthEast()),
            point = map.latLngToContainerPoint(latlng, map.getZoom()),
            size = map.getSize(),

            params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: crs.code,
                // styles: this.wmsParams.styles,
                transparent: true,
                version: '1.1.0',
                format: 'application/json',
                bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
                height: size.y,
                width: size.x,
                layers: this.state.wmsLayers,
                query_layers: this.state.wmsLayers,
                info_format: 'application/json',
                feature_count: this.state.wmsLayers.length
            };

        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

        var url = serverUrl + L.Util.getParamString(params, serverUrl, false);

        return url;
    }

    render() {
        return (
            <div className="map-container">
                <div id = "map"></div>
            </div>
        );
    }
}


export default MapContainer;