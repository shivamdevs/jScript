
// Projset :: jScript
// Cersion :: 4.0.0 - MIT License

// Alpha version

(function( context , name ) {
    context = context || window;
    name = name || '$';

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
        mobile: function( context ) {
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
          if ( Is.jScript( context ) || Is.jQuery( context ) ) {
            var match = [];
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
          for (var i = 0; i < selector.length; i++) {
            this[ i ] = selector[ i ];
          }
          this.length = selector.length;
        }
        return this;
    };
}( window , '$' ));
// Make changes here to '$' for redifining variable.
