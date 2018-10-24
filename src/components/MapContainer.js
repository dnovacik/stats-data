import React, { Component } from 'react';
import L, { Map, TileLayer } from 'leaflet';
import BetterWms from './L.TileLayer.BetterWMS';
import axios from 'axios';

class MapContainer extends Component {
    constructor() {
        super();

        this.state = {
            leafletMap: null,
            layers: [
                new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'}),
                new BetterWms('http://45.77.64.136:8080/geoserver/gisdata/wms?tiled=true', {
                    layers: ['cr_obce', 'sk_obce'],
                    transparent: true,
                    format: 'image/png',
                    opacity: 0.6
                })
            ]
        }
    }

    componentDidMount() {
        let map = new Map('map', {
            center: [48, 19],
            zoom: 12,
            layers: this.state.layers
        });

        this.setState({leafletMap: map});
    }

    handleMapClick = (event) => {
        console.log(event);
        let point = event.latlng;

        this.getFeatureInfo(point);
    }

    getFeatureInfo = (latlng) => {
        let url = this.getFeatureInfoUrl(latlng, this.state.layers);
        console.log(url);

        axios.get(url)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }

    getFeatureInfoUrl = (latlng, layers) => {
        const map = this.state.leafletMap;
        console.log(this.state.leafletMap);
        const url = 'http://45.77.64.136:8080/geoserver/gisdata/wms';

        let point = map.latLngToContainerPoint(latlng),
            size = map.getSize(),
            bounds = map.getBounds(),
            sw = bounds.getSouthWest(),
            ne = bounds.getNorthEast();

        let params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:5514',
            styles: 'hustota2',
            layers: layers,
            bbox: [sw.join(','), ne.join(',')].join(','),
            height: size.y,
            width: size.x,
            x: point.x,
            y: point.y,
            info_format: 'application/json',
            propertyName: 'hustota2'
        }

        return url + L.Util.getParamString(params, url, true);
    }

    render() {
        return (
        <div className="map-container">
            <div id="map"></div>
        </div>
        );
    }
}

export default MapContainer;