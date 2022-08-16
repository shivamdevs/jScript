// Projset :: jScript
// Version :: 4.0.0 - MIT License
/*
Change Highlight
-- Transform to ES6 as many as possible
*/

(function( baseName ) {
    'use strict';

    baseName = baseName || '$';

    // Is for managing small functions
    const Is = {
        array: array => array && array instanceof Array && Array.isArray( array ),
        arrayLike: array => Array.isArray( array ) || ( array && array instanceof Object && array.hasOwnProperty( 'length' ) && typeof array.length === 'number' ),
        boolean: bool => typeof bool === 'boolean',
        element: element => element && element instanceof Element,
        function: context => context && typeof context === 'function',
        jScript: jScript => jScript && window.jScript && jScript instanceof window.jScript,
        mobile: context => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( ( context || window ).navigator.userAgent ),
        node: node => node && node instanceof Node,
        number: number => typeof number === 'number',
        parseNum: number => typeof parseInt( number ) === 'number',
        object: object => object && object instanceof Object && !Array.isArray( object ),
        string: string => typeof string === 'string',
    };

    // jScript function to be called for new operator
    const jScript = function( selector , context ) {
        this.length = 0;
        if ( !selector ) return this;
        context = context || window.document;
        if ( Is.string( selector ) ) {
            if ( Is.jScript( context ) ) {
                const match = [];
                context.toArray().querySelectorAll( selector ).forEach(( query ) => { match.push( query ); });
                selector = match;
            } else {
                selector = context.querySelectorAll( selector );
            }
        } else if ( Is.node( selector ) || selector === document || selector === window ) {
            return ( this[ 0 ] = selector ) && ( this.length = 1 ) && this;
        } else if ( Is.function( selector ) ) {
            return Js.ready( selector );
        }
        if ( !selector.length ) return this;
        for (let i = 0; i < selector.length; i++) this[i] = selector[i];
        this.length = selector.length;
        return this;
    };

    // Change prototype to arrayLike
    jScript.prototype = [];

    // Js to be changed to $ later on
    const Js = ( selector , context ) => new jScript( selector , context );

    // add prototype or methods to objects
    Js.addPrototype = function( element , prototype ) {
        if ( !Is.object( prototype ) ) return;
        for (let key in prototype) if (prototype.hasOwnProperty(key)) element.prototype[ key ] = prototype[ key ];
    };
    Js.addExtension = function( element , extension ) {
        if ( Is.object( extension ) ) return;
        for (let key in extension) if (extension.hasOwnProperty(key)) element[ key ] = extension[ key ];
    };

    // Degub errors
    Js.debugMode = true;// Change here to prevent debugging errors
    Js.debug = ( ...data ) => Js.debugMode && console.error( `${baseName}:` , ...data );

    // DOM ready manipulator
    // Source :: https://github.com/jfriend00/docReady
    Js.ready = (function() {
        const list = [];
        let fired = false;
        let installed = false;

        function ready() {
            if ( fired ) return;
            for (let callback of list) callback.fn.call( window , ...callback.args );
        }
        const state = () => document.readyState === 'complete' && ready();

        return function( callback , ...context ) {
            if ( !Is.function( callback ) ) return Js.debug( 'ready:' , 'Callback is not a function.' );
            if ( fired ) return Js.timeout(() => callback.call( window , ...context ) , 1); else list.push({ fn: callback , args: context });
            if ( document.readyState === 'complete' || ( !document.attachEvent && document.readyState === 'interactive' ) ) {
                Js.imeout( ready , 1 );
            } else if ( !installed ) {
                if ( document.addEventListener ) {
                    document.addEventListener( 'DOMContentLoaded' , ready , false );
                    window.addEventListener( 'load' , ready , false );
                } else {
                    document.attachEvent( 'onreadystatechange' , state );
                    window.attachEvent( 'onload' , ready );
                }
                installed = true;
            }
        }
    }());

    Js.addPrototype( jScript );

    // Add mini functions to baseName
    Js.addExtension( Js , {
        addslashes: string => String( string ).replace(/([\\"'/[/(/)])/g, "\\$1").replace(/\0/g, "\\0"),
        array: {
            compare: function( arr1 , arr2 ) {
                if ( !Array.isArray( arr1 ) || !Array.isArray( arr2 ) || arr1.length !== arr2.length ) return false;
                const temp1 = arr1.concat().sort();
                const temp2 = arr2.concat().sort();
                for (let i = 0; i < temp1.length; i++) if ( temp1[ i ] !== temp2[ i ] ) return false;
                return true;
            },
        },
        ce : function( selector , ...children ) {
            const element = Js();
            const query = Js.cssquery( selector );
            if ( !query || !query.element ) return element;
            element = Js( window.document.createElement( query.element ) );
            if ( query.id ) element.attr( 'id' , query.id );
            if ( query.class ) element.addClass( query.class );
            if ( query.attr ) element.attr( query.attr );
            element.append( children );
            return element;
        },
        cm : function( selector , appendTo ) {
            if ( !selector ) return null;
            const match = Js( selector );
            if ( !match.length ) return Js.ce( selector ).appendTo( appendTo );
            return match;
        },
        cssQuery: function( context ) {
            if ( Is.string( context ) ) return null;
            const found = [];
            const foundElement = [];
            const foundElementID = [];
            const foundElementClass = [];
            const foundElementAttribute = [];
            found.id = '';
            found.attr = {};
            found.list = [];
            found.class = '';
            found.element = 'div';
            ( context.match( /\[[^\]]*\]/g ) || [] ).forEach(( attr ) => {
                context = context.replace( attr , '' );
                foundElementAttribute.push( attr );
                let section = attr.match( /(?<=\[).+?(?=\])/g );
                if( !section || !section.length ) return;
                section = section[ 0 ];
                const query = section.includes( '=' ) ? section.substring( 0 , section.indexOf( '=' ) ) : section;
                if ( !query || !query.length ) return;
                value = section.includes( '=' ) ? section.substring( section.indexOf( '=' ) + 1 ) : '';
                value = !value ? [] : value.length > 1 ? value.match( /\(?[^\'\"\`]+[^\'\"\`]\)?/g ) || [] : [ value ];
                value = ( value && value.length ) ? value[ 0 ] : '';
                found.attr[ query ] = value;
            });

            ( context.match( /\(?.[^\.\#]+[^\.\#]\)?/g ) || [] ).forEach(( query , i ) => {
                context = context.replace( query , '' );
                if ( query.match( /[^A-Za-z0-9\.\#\-\_]/g ) ) return;
                if ( query.charAt() === '.' ) {
                    foundElementClass.push( query );
                    const string = query.substring( 1 );
                    found.list.push( string );
                    found.class += string + ' ';
                } else if ( query.charAt() === '#' ) {
                    foundElementID.push( query );
                    found.id = query.substring( 1 );
                } else if ( !i ) {
                    foundElement.push( query );
                    found.element = query;
                }
            });
            if ( context && context.length ) {
                foundElement.push( context );
                found.element = context;
            }
            Array.prototype.push.apply( found , [ ...foundElement , ...foundElementID , ...foundElementClass , ...foundElementAttribute ] );
            return found.length ? found : null;
        },
        cssStyle: {
            style: function( css ) {
                let result = '';
                if ( Is.function( css ) ) css = css();
                const modify = function( object ) {
                    if ( !Is.object( object ) ) return;
                    for (let key in object) {
                        const value = object[ key ];
                        if ( Is.object ( value ) ) {
                            result += key + '{';
                            modify( value );
                            result += '}\n';
                        } else {
                            if ( Is.function( value ) ) value = value();
                            value = String( value );
                            if ( Is.string( value ) ) result += Js.textcase.camelToSnake( key ) + ' : ' + value + '; ';
                        }
                    }
                }
                if ( Is.array( css ) ) {
                    css.forEach(( item ) => { if ( Is.object( item ) ) modify( item ); else if ( Is.string( item ) ) result += item; });
                } else if ( Is.object( css ) ) {
                    modify( css );
                } else if ( Is.string( css ) ) {
                    result += css;
                }
                if ( window.csso ) result = window.csso.minify( result ).css;
                return result;
            },
            block: function( css ) {
                let result = '';
                if ( Is.function( css ) ) css = css();
                if ( Is.object( css ) ) for (let key in css) result += key + ': ' + css[ key ] + '; '; else if ( Is.string( css ) ) result = css;
                if ( window.csso ) result = window.csso.minifyBlock( result ).css;
                return result;
            },
            toObject: function( css ) {
                const object = {};
                css = css.replace(/\n/g , '').replaceAll(' ' , '');
                css.split( ';' ).forEach(( declare ) => {
                    if ( !declare ) return;
                    const split = declare.split( ':' );
                    if ( split.length ) object[ Js.textcase.snakeToCamel( split[ 0 ] ) ] = split[ 1 ];
                });
                return object;
            }
        },
        decode: {
            entities : function( str ) {
                const element = document.createElement('div');
                if( !str || typeof str !== 'string' ) return str;
                str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
                str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                element.innerHTML = str;
                str = element.textContent;
                element.textContent = '';
                return str;
            },
        },
        getScript: function( source , callback ) {
            if ( !source ) return Js.debug( 'getScript:' , 'No source argument was passed.' );
            callback = Is.function( callback ) ? callback : function() {};
            const script = Js.ce( 'script[jScript]' ).load( callback ).src( source );
            Js( 'head > script' ).eq().after( script );
            return script;
        },
        measures: {
            vpTopx : function( value ) {
                const parts = value.match( /([0-9\.]+)(vh|vw)/ ) || [ 1 , 'vw' ];
                const q = Number( parts[ 1 ] ) || 1;
                const side = window[ [ 'innerHeight' , 'innerWidth' ][ [ 'vh' , 'vw' ].indexOf( parts[ 2 ] ) ] || 'vw' ];
                return side * ( q / 100 );
            },
        },
        object : {
            formData : function( data , value ) {
                const result = {};
                if ( Is.object( data ) ) for (let key in data) if (data.hasOwnProperty(key)) result[ key ] = data[ key ] ?? null; else if ( Is.string( data ) ) result[ data ] = value ?? null;
                return result;
            },
            inArray : function( array , key , value ) {
                for (let i = 0; i < array.length; i++) if ( array[ i ][ key ] === value ) return { item : array[ i ] , index : i };
                return null;
            },
        },
        random: {
            string : function( string , length = 32 ) {
                if ( !string ) string = '0123456789abcdefghijklmnopqrstuvwxyz'; else string = String( string );
                if ( !parseInt( length ) ) length = 32;
                let result = '';
                for (let i = 0; i < length; i++) result += string.charAt( Math.floor( Math.random() * string.length ) );
                return result;
            },
            number : function( min , max ) {
                const argc = arguments.length;
                if ( argc === 0 ) {
                    min = 0;
                    max = 10;
                } else if ( argc === 1 ) {
                    max = parseInt( min ) || 10;
                    min = 0;
                } else {
                    min = parseInt( min ) || 10;
                    max = parseInt( max ) || 10;
                }
                return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
            },
            numberString : function( length = 1 ) {
                return Js.random.string( '1234567890' , length || 1 );
            },
        },
        serialize: function( object ) {
            let result = '';
            if ( !Is.object( object ) ) return result;
            for ( let key in object ) result += key + '=' + object[ key ] + '&';
            result = result.slice( 0 , -1 );
            return result;
        },
        styleSheet: function( data , appendTo , query , blob ) {
            const html = Js.cssStyle( data );
            if ( blob ) {
                return Js.ce( 'link' + ( query ?? '' ) ).attr({
                    jScript : '',
                    rel : 'stylesheet',
                    href : window.URL.createObjectURL( new Blob( [ html ] , { type : 'text/css' } ) ),
                }).appendTo( appendTo ?? 'head' );
            }
            return Js.ce( 'style' + ( query ?? '' ) , html ).attr({
                jScript : '',
                media : 'screen',
            }).appendTo( appendTo ?? 'head' );
        },
        textcase: {
            camelToSnake : function( string , replace = '-' ) {
                if ( !Is.string( string ) ) return string;
                if ( ![ '-' , '_' ].includes( replace ) ) replace = '-';
                string = string.replace(/[A-Z]/g, letter => `${ replace + letter.toLowerCase() }`);
                return string;
            },
            snakeToCamel : function( string ) {
                if ( Is.string( string ) ) string = string.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace( '-' , '' ).replace( '_' , '' ));
                return string;
            },
            textToSnake : function( string ) {
                if ( Is.string( string ) ) return string.toLowerCase().replaceAll( ' ' , '-' ).replace( /[^a-z0-9\-\_]/gi , '' ).replace( /—+/g , '-' );
                return string;
            },
        },
        timeout: function( callback , delay ) {
            callback = Is.function( callback ) ? callback : function() {};
            if ( !Is.number( delay ) ) delay = 0;
            if ( window.scheduler ) scheduler.postTask( callback , { delay : delay } ); else return window.setTimeout( callback , delay );
        },
        urlify: ( text , target = '_blank' ) => text.replace( /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig , ( url ) =>  `<a href="${url}" target="${target}">${url}</a>`),
    });

    // Add basic events for document structure
    (function() {
        const struct = function() {
            if ( Is.mobile() ) Js( 'html' ).addClass( 'mobile-device' ); else Js( 'html' ).removeClass( 'mobile-device' );
            if ( window.innerWidth <= 425 ) Js( 'html' ).addClass( 'mobile-device-ratio' ); else Js( 'html' ).removeClass( 'mobile-device-ratio' );
            Js( 'html' ).css( '--vh' , `${window.innerHeight * 0.01}px` );
        };
        struct();
        Js( window ).bind( 'resize' ,struct );
    }());

    // Add overflow observer for Js(...).overflow(...);
    const overflowObserver = [];
    (function() {
        const speed = 300;
        (function overflow() {
            overflowObserver.forEach(( item , i ) => {
                const start = item.flowstart;
                const atend = item.flowend;
                if ( item.element.scrollWidth > item.element.clientWidth ) if ( Is.function( start ) ) start.call( item.element , item.selector , item.element ); else if ( Is.function( atend ) ) atend.call( item.element , item.selector , item.element );
            });
            Js.timeout( overflow , speed );
        }());
    }());

    window[ baseName ] = Js;

}( '$' ));
