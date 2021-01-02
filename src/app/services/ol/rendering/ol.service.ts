import { Injectable } from "@angular/core";
import { Map, View, Feature } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke } from 'ol/style';
import Polygon from 'ol/geom/Polygon';
import 'ol/ol.css';

import { WebGlPolygonLayer } from "../webglLayer";

import { bboxPolygon } from 'turf';
import * as Stats from 'stats-js';


export type LayerType = 'standard' | 'webgl';


@Injectable({
    providedIn: 'root'
})
export class OlService {

    map: Map;
    dataLayer: VectorLayer;

    init(mapContainer: HTMLDivElement, fpsDiv: HTMLDivElement, dataLayerType: LayerType) {

        const bg = new TileLayer({
            source: new OSM()
        });
        
        const view = new View({
            center: [0, 0],
            zoom: 4,
            projection: 'EPSG:4326'
        });

        const map = new Map({
            target: mapContainer,
            layers: [bg],
            view: view
        });
        

        var stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.dom.style.position = "relative";
        stats.dom.style.width = '80%';
        fpsDiv.appendChild( stats.dom );
        const renderer = map.getRenderer();
        const oldRenderFunction = renderer.renderFrame.bind(renderer);
        map.getRenderer().renderFrame = function(frameState: any) {
           stats.begin();
            oldRenderFunction(frameState);
            stats.end();
        };

        const data = this.getData(100, 100);
        const dataLayer = this.createDataLayer(data, dataLayerType);
        map.addLayer(dataLayer);

        this.map = map;
        this.dataLayer = dataLayer;
    }


    public updateData(X: number, Y: number) {
        const newData = this.getData(X, Y);
        this.updateDataLayer(newData, this.dataLayer);
    }


    private getData(X: number, Y: number) {
        const features = [];
        const start = [0, 0];
        const w = 0.125;
        for (let i = 0; i < X; i++) {
            for (let j = 0; j < Y; j++) {
                const bbox = [
                    start[0] + (i - 1) * w,
                    start[1] + (j - 1) * w,
                    start[0] + i * w,
                    start[1] + j * w
                ];
                const polygon = bboxPolygon(bbox);
                polygon.properties['id'] = i * X + j;
                features.push(polygon);
            }
        }

        const featureCollection = {
            type: 'FeatureCollection',
            features: features
        };

        return featureCollection;
    }


    private createDataLayer(featureCollection: any, type: LayerType): VectorLayer {
        let dataLayer: VectorLayer;
        if (type === 'standard') {
            dataLayer = new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(featureCollection)
                }),
            });
        } else {
            dataLayer = new WebGlPolygonLayer({
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(featureCollection)
                }),
                colorFunc: (f: Feature<Polygon>) => {
                    return [Math.random(), Math.random(), Math.random()];
                }
            });
        }

        return dataLayer;
    }


    private updateDataLayer(featureCollection: any, layer: VectorLayer) {
        const newSource = new VectorSource({
            features: new GeoJSON().readFeatures(featureCollection)
        });
        layer.setSource(newSource);
    }
}