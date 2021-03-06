/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE9, IE10 and IE11 requires all of the following polyfills. */
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/array';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/date';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/function';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/map';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/math';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/number';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/object';
// tslint:disable-next-line:ordered-imports
import 'core-js/es6/parse-float';
import 'core-js/es6/parse-int';
import 'core-js/es6/regexp';
import 'core-js/es6/set';
import 'core-js/es6/string';
import 'core-js/es6/symbol';
import 'core-js/es6/weak-map';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/** Evergreen browsers require these. */
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

import 'hammerjs';
/**
 * Required to support Web Animations `@angular/platform-browser/animations`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.



/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.


// if (typeof Object.assign !== 'function') {
//   Object.assign = (target) => {
//     'use strict';
//     if (target == null) {
//       throw new TypeError('Cannot convert undefined or null to object');
//     }

//     target = Object(target);
//     for (let index = 1; index < arguments.length; index++) {
//       const source = arguments[index];
//       if (source != null) {
//         for (const key in source) {
//           if (Object.prototype.hasOwnProperty.call(source, key)) {
//             target[key] = source[key];
//           }
//         }
//       }
//     }
//     return target;
//   };
// }


/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
// import 'intl/locale-data/jsonp/en';
