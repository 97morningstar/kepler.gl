import React, {Component, useState, useRef} from 'react';

//Map Component
import DeckGL from '@deck.gl/react';
import {OVERLAY_TYPE} from 'layers/base-layer';
import MapboxGLMap from 'react-map-gl';
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

//Hubble Imports - Animation (from example for starters)
import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';
import {BasicControls} from '@hubble.gl/react';
import {DeckAdapter} from 'hubble.gl';


// Hubble Part (Maybe we should get this in a different file or put everything on a folder)
function sceneBuilder(animationLoop) {
    const data = {};
    const keyframes = {
      camera: new CameraKeyframes({
        timings: [0, 2000],
        keyframes: [
          {
            longitude: 0,
            latitude: 11,
            zoom: 2,
            pitch: 0,
            bearing: 0
          },
          {
            longitude: 0,
            latitude: 11,
            zoom: 2,
            bearing: 90,
            pitch: 0
          }
        ],
        easings: [easing.easeInOut]
      })
    };
    animationLoop.timeline.attachAnimation(keyframes.camera);
  
    return new DeckScene({
      animationLoop,
      keyframes,
      lengthMs: 5000,
      data,
     width: 852,
     height: 480
    });
  }

  const encoderSettings = {
    framerate: 30,
    webm: {
      quality: 0.8
    },
    jpeg: {
      quality: 0.8
    },
    gif: {
      sampleInterval: 1000
    }
  };

const adapter = new DeckAdapter(sceneBuilder);

const TRANSITION_DURATION = 0;

export class Scene extends Component {

    constructor(props) {
        super(props);
   this.prop = this.props.prop;
   
      }

  _renderLayer = (overlays, idx) => {
    const datasets = this.prop.visState.datasets;
    const layers = this.prop.visState.layers;    
    const layerData = this.prop.visState.layerData;
    const hoverInfo = this.prop.visState.hoverInfo;
    const clicked = this.prop.visState.clicked;
    const mapState = this.prop.mapState;
    const interactionConfig = this.prop.visState.interactionConfig;
    const animationConfig = this.prop.visState.animationConfig;

    const layer = layers[idx];
    const data = layerData[idx];
    const {gpuFilter} = datasets[layer.config.dataId] || {};
  
    const objectHovered = clicked || hoverInfo;
    const layerCallbacks = {
          onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
        };
  
        // Layer is Layer class
    const layerOverlay = layer.renderLayer({
          data,
          gpuFilter,
          idx,
          interactionConfig,
          layerCallbacks,
          mapState,
          animationConfig,
          objectHovered
        });
        return overlays.concat(layerOverlay || []);
      };
 
      // Testing purposes
      print(prop){
        console.log("this.deckgl", prop);
      };

      // Is this being used right?
      componentDidMount() {
        this.forceUpdate();
      }
       
     //   interactionConfig,  
        render() {
        console.log("all props ", this.props.prop);

        const mapStyle = this.prop.mapStyle;
        const mapState = this.prop.mapState;
        const layers = this.prop.visState.layers;    
        const layerData = this.prop.visState.layerData;
        const layerOrder = this.prop.visState.layerOrder;
        const animationConfig = this.prop.visState.animationConfig;
        const width = '100%';
        const height = '100%';
        const useDevicePixels = 2;
        //Map data
        const mapboxApiAccessToken = this.prop.mapStyle.mapboxApiAccessToken;
        const mapboxApiUrl = this.prop.mapStyle.mapboxApiUrl;
        // define trip and geojson layers 
        let deckGlLayers = [];

        // wait until data is ready before render data layers
        if (layerData && layerData.length) {
          // last layer render first
          deckGlLayers = layerOrder
            .slice()
            .reverse()
            .filter(
              idx => layers[idx].overlayType === OVERLAY_TYPE.deckgl && layers[idx].id
            )
            .reduce(this._renderLayer, []);
        }

        // MapboxGLMap
        const mapProps = {
            ...mapState,
            preserveDrawingBuffer: true,
            mapboxApiAccessToken,
            mapboxApiUrl,
            transformRequest
          };

         const style = {
            position: 'relative'
          }
     
        return (
            <div style={{width: '100%', height: "100%", position: 'relative'}}>
              <DeckGL
                ref={r => {this.deckgl={current:r}}}
                viewState={mapState}
                id="default-deckgl-overlay2"
                layers={deckGlLayers}
                useDevicePixels={useDevicePixels}
                width={width}
                height={height}
                style={style}
                /* onBeforeRender={this._onBeforeRender} // Not yet
                      onHover={visStateActions.onLayerHover} // Not yet
                      onClick={visStateActions.onLayerClick}*/ // Not yet
                {...adapter.getProps(this.deckgl, () => {}, () => {this.forceUpdate()})}
              >
            <MapboxGLMap // Maybe be missing Mapbox overlays
                  {...mapProps}
                  key="bottom"
                  ref={this._setMapboxMap}
                  mapStyle={mapStyle.bottomMapStyle}
                  getCursor={this.props.hoverInfo ? () => 'pointer' : undefined}
                  transitionDuration={TRANSITION_DURATION}
                ></MapboxGLMap>
              </DeckGL>
              <div style={{position: 'absolute'}}>
                <BasicControls
                  adapter={adapter}
                  encoderSettings={encoderSettings}
                  setBusy={()=>{}}
                />
              </div>
            </div>
          );
    }

}