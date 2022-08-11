
// Projset :: jScript
// Cersion :: 4.0.0 - MIT License

// Alpha version

(function( name ) {
    name = name || '$';

    const debugMode = true;// Shows error by throwing on console :: For development only

    // repetitive functions
    const Is = {
        array: function( array ) {
            return array && array instanceof Array;
        },
        arrayLike: function( array ) {
            return Array.isArray( array ) || ( array && array instanceof Object && array.hasOwnProperty( 'length' ) && typeof array.length === 'number' );
        },
        boolean: function( boolean ) {
            return typeof boolean === 'boolean';
        },
        element: function( element ) {
            return element && element instanceof Element;
        },
        function: function( context ) {
            return context && typeof context === 'function';
        },
        jScript: function( jScript ) {
            return jScript && window.jScript && jScript instanceof window.jScript;
        },
        mobile: function( context = context ) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( ( context || window ).navigator.userAgent );
        },
        node: function( node ) {
            return node && node instanceof Node;
        },
        number: function( number ) {
            return typeof number === 'number';
        },
        parseNum: function( number ) {
            return typeof parseInt( number ) === 'number';
        },
        object: function( object ) {
            return object && object instanceof Object;
        },
        string: function( string ) {
            return typeof string === 'string';
        },
    };

    const jScript = function( selector , context ) {
        this.length = 0;

        if ( !selector ) return this;

        context = context || document;

        if ( Is.string( selector ) ) {
            if ( Is.jScript( context ) ) {
                let match = [];
                context.toArray().forEach(( item ) => {
                    item.querySelectorAll( selector ).forEach(( query ) => {
                        match.push( query );
                    });
                });
                selector = match;
            } else {
                selector = context.querySelectorAll( selector );
            }
        } else if ( Is.node( selector ) || selector === document || selector === window ) {
            this[ 0 ] = selector;
            this.length = 1;
            return this;
        } else if ( Is.function( selector ) ) {
            return Js.ready( selector );
        }
        if ( selector.length ) {
            for (let i = 0; i < selector.length; i++) {
                this[ i ] = selector[ i ];
            }
            this.length = selector.length;
        }
        return this;
    };

    // define an outright js element selector
    const Js = function( selector , context ) {
        return new jScript( selector , context );
    };

    // add prototypes to object or functions
    Js.addPrototype = function( element , prototype ) {
        if ( Is.object( prototype ) ) {
            for (let key in prototype) {
                if (prototype.hasOwnProperty(key)) {
                    element.prototype[ key ] = prototype[ key ];
                }
            }
        }
    };
    Js.addExtension = function( element , extension ) {
        if ( Is.object( extension ) ) {
            for (let key in extension) {
                if (extension.hasOwnProperty(key)) {
                    element[ key ] = extension[ key ];
                }
            }
        }
    };

    // Convert a string of css query-selector into array of :: element|class~classlist|id|attributes
    Js.cssQuery = function( context ) {
        if ( Is.string( context ) ) {
            let found = [];
            let foundElement = [];
            let foundElementID = [];
            let foundElementClass = [];
            let foundElementAttribute = [];
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

                let query = section.includes( '=' ) ? section.substring( 0 , section.indexOf( '=' ) ) : section;

                if ( query && query.length ) {
                    value = section.includes( '=' ) ? section.substring( section.indexOf( '=' ) + 1 ) : '';
                    value = !value ? [] : value.length > 1 ? value.match( /\(?[^\'\"\`]+[^\'\"\`]\)?/g ) || [] : [ value ];
                    value = ( value && value.length ) ? value[ 0 ] : '';
                    found.attr[ query ] = value;
                }
            });

            ( context.match( /\(?.[^\.\#]+[^\.\#]\)?/g ) || [] ).forEach(( query , i ) => {
                context = context.replace( query , '' );
                if ( query.match( /[^A-Za-z0-9\.\#\-\_]/g ) ) return;
                if ( query.charAt() === '.' ) {
                    foundElementClass.push( query );
                let string = query.substring( 1 );
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
        }
        return null;
    };


    // DOM ready manipulator
    Js.ready = (function() {
        const readyList = [];
        let readyFired = false;
        let readyEventHandlersInstalled = false;
        function ready() {
            if ( !readyFired ) {
                readyFired = true;
                for (let i = 0; i < readyList.length; i++) {
                    readyList[i].fn.call( window , readyList[i]. ctx );
                }
                readyList = [];
            }
        };
        function readyStateChange() {
            if ( document.readyState === 'complete' ) {
                ready();
            }
        }
        return function( callback , context ) {
            if ( !Is.function( callback ) ) {
                Js.debug( 'callback is not a function.' );
            }
            if ( readyFired ) {
                return callback.call( window , context );
            } else {
                readyList.push({
                    fn: callback,
                    ctx: context
                });
            }
            if ( document.readyState === 'complete' || ( !document.attachEvent && document.readyState === 'interactive' ) ) {
                ready();
            } else if ( !readyEventHandlersInstalled ) {
                if ( document.addEventListener ) {
                    document.addEventListener( 'DOMContentLoaded' , ready , false );
                    window.addEventListener( 'load' , ready , false );
                } else {
                    document.attachEvent( 'onreadystatechange' , readyStateChange );
                    window.attachEvent( 'onload' , ready );
                }
                readyEventHandlersInstalled = true;
            }
        };
    }());











    window[ name ] = Js;
}( '$' ));
// Make changes here to '$' for redifining value.
