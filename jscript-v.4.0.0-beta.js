// Projset :: Jscript
// Version :: 4.0.0 - MIT License
/*
    Change Highlight
    -- jScript will be changed to Jscript
    -- Transform to ES6 as many as possible
*/

(function( baseName ) {
    'use strict';

    baseName = baseName || '$';
    // BASE for usage inside of scope
    const BASE = {};

    // Degub errors
    BASE.debugMode = true;// Change here to prevent debugging errors
    BASE.debug = ( ...data ) => BASE.debugMode && console.error( ...data );

    // Is for managing small functions
    const Is = {
        array: array => array && array instanceof Array,
        arrayLike: array => Array.isArray( array ) || ( array && array instanceof Object && array.hasOwnProperty( 'length' ) && typeof array.length === 'number' ),
        boolean: bool => typeof bool === 'boolean',
        element: element => element && element instanceof Element,
        function: context => context && typeof context === 'function',
        jScript: jScript => jScript && window.jScript && jScript instanceof window.jScript,
        mobile: context => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( ( context || window ).navigator.userAgent ),
        node: node => node && node instanceof Node,
        number: number => typeof number === 'number',
        parseNum: number => typeof parseInt( number ) === 'number',
        object: object => object && object instanceof Object,
        string: string => typeof string === 'string',
    };


}( '$' ));
