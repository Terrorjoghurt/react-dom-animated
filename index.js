/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict'

var Animated = require('animated')
var CSSPropertyOperations = require('only-react-css-property-operations')

var UNIT = {
  translate: 'px',
  translateX: 'px',
  translateY: 'px',
  rotate: 'deg',
  rotateX: 'deg',
  rotateY: 'deg',
  rotateZ: 'deg',
  skew: 'deg',
  skewX: 'deg',
  skewY: 'deg',
}

// TODO should this support translate(x,y)?
// { scale: 2 } => 'scale(2)'
function mapTransform(t) {
  var k = Object.keys(t)[0]
  return k + '(' + t[k] + (UNIT[k] || '') + ')'
}

// NOTE(lmr):
// Since this is a hot code path, right now this is mutative...
// As far as I can tell, this shouldn't cause any unexpected behavior.
function mapStyle(style) {
  if (style && style.transform && typeof style.transform !== 'string') {
    // TODO(lmr): this doesn't attempt to use vendor prefixed styles
    style.transform = style.transform.map(mapTransform).join(' ')
  }
  return style
}

function ApplyAnimatedValues(instance, props, comp) {
  if (instance.setNativeProps) {
    instance.setNativeProps(props)
  } else if (
    instance.nodeType &&
    typeof instance.setAttribute !== 'undefined'
  ) {
    CSSPropertyOperations.setValueForStyles(
      instance,
      mapStyle(props.style),
      comp._reactInternalInstance
    )
  } else {
    return false
  }
}

Animated.inject.ApplyAnimatedValues(ApplyAnimatedValues)

module.exports = Object.assign({}, Animated, {
  a: Animated.createAnimatedComponent('a'),
  button: Animated.createAnimatedComponent('button'),
  div: Animated.createAnimatedComponent('div'),
  span: Animated.createAnimatedComponent('span'),
  img: Animated.createAnimatedComponent('img'),
})
