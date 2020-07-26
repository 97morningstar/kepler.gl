// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {ColumnLayer} from '@deck.gl/layers';
import {editShader} from 'deckgl-layers/layer-utils/shader-utils';

function addInstanceCoverage(vs) {
  const addDecl = editShader(
    vs,
    'hexagon cell vs add instance',
    'attribute vec3 instancePickingColors;',
    `attribute vec3 instancePickingColors;
     attribute float instanceCoverage;`
  );

  return editShader(
    addDecl,
    'hexagon cell vs add instance',
    'float dotRadius = radius * coverage * shouldRender;',
    'float dotRadius = radius * coverage * instanceCoverage * shouldRender;'
  );
}

// TODO: export all deck.gl layers from kepler.gl
class EnhancedColumnLayer extends ColumnLayer {
  getShaders() {
    const shaders = super.getShaders();

    return {
      ...shaders,
      vs: addInstanceCoverage(shaders.vs)
    };
  }

  initializeState() {
    super.initializeState();

    this.getAttributeManager().addInstanced({
      instanceCoverage: {size: 1, accessor: 'getCoverage'}
    });
  }
}

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';

export default EnhancedColumnLayer;
