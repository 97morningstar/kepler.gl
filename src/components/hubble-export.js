import React, {Component, useState, useRef} from 'react';
import styled, {ThemeProvider, withTheme} from 'styled-components';
import {connect as keplerGlConnect} from 'connect/keplergl-connect';

//Map Component
import PropTypes from 'prop-types';
import DeckGL from '@deck.gl/react';
import {OVERLAY_TYPE} from 'layers/base-layer';
import MapboxGLMap from 'react-map-gl';
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

//Hubble Imports - Animation (from example for starters)
import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {DeckAdapter} from 'hubble.gl';

// Modal
import RenderSettingsModal from './render-settings-modal';
import {Button} from 'components/common/styled-components';
import {theme} from '../styles';

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

function mapStateToProps(state = {}, props) {
    return {
      ...props,
      visState: state.visState,
      mapStyle: state.mapStyle,
      mapState: state.mapState,
      uiState: state.uiState,
      providerState: state.providerState
    };
}

function makeMapDispatchToProps() {
    // const getActionCreators = makeGetActionCreators();
    const mapDispatchToProps = (dispatch, ownProps) => {
    //   const groupedActionCreators = getActionCreators(dispatch, ownProps);
  
      return {
        // ...groupedActionCreators,
        dispatch
      };
    };
  
    return mapDispatchToProps;
}

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
        const width = 854;
        const height = 480;
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
     
        return (
            <div>
              <DeckGL
                ref={r => {this.deckgl={current:r}}}
                viewState={mapState}
                id="default-deckgl-overlay2"
                layers={deckGlLayers}
                useDevicePixels={useDevicePixels}
                width={width}
                height={height}
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
    
class HubbleExport extends Component {

constructor(props) {
    super(props);
    this.state = {
        isOpen: false
    };
}

handleClose() {this.setState({isOpen: false})} // X button in Kepler UI was clicked

handleExport() { // Export button in Kepler UI was clicked
    this.setState(state => ({
        isOpen: true
      }));
    // stop rendering in bg
    // setState
    // pop up modal if isOpen. If false, closes modal TODO put function into render
    // all the data is passed through and can use in deck/hubble components
    return <h1>REACHED</h1>
}

    render() {
        return (
            <div>
             
                <RenderSettingsModal isOpen={this.state.isOpen} handleClose={this.handleClose.bind(this)} prop={this.props}/>
                <ThemeProvider theme={RenderSettingsModal}>
                </ThemeProvider>
                <Button onClick={() => this.handleExport()}>Export</Button> {/* anonymous function to bind state onclick  */}
            </div>
        );
    }
}


// States we need:
// 
// 
// 
export default keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));

