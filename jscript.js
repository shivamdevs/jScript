// Solonet.in :: jScript - Javascript Library
// Version :: 3.0.0 - MIT License

// For detailed information visit :: https://www.solonet.in/jscript

// Essential modules
// Css minifier :: https://www.solonet.in/css-minifier

// [Is] Global variable to check/match for different datatypes
var Is = (function() {
  return new class {
    array( array ) {
      return typeof array === 'object' && array instanceof Array;
    };
    arrayLike( array ) {
      return Array.isArray( array ) || ( array && typeof array === "object" && array.hasOwnProperty( 'length' ) && typeof array.length === "number" && array.length > 0 && ( array.length - 1 ) in array );
    };
    boolean( boolean ) {
      return typeof boolean === 'boolean';
    };
    element( element ) {
      return element && element instanceof Element;
    };
    fileList( fileList ) {
      return typeof fileList === 'object' && fileList instanceof FileList;
    };
    function( context ) {
      return context && typeof context === 'function';
    };
    jScript( jScript ) {
      return jScript && window.jScript && jScript instanceof window.jScript;
    };
    jQuery( jQuery ) {
      return jQuery && window.jQuery && jQuery instanceof window.jQuery;
    };
    mobile( context ) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( ( context || window ).navigator.userAgent );
    };
    node( node ) {
      return node && node instanceof Node;
    };
    number( number ) {
      return typeof number === 'number';
    };
    parseNum( number ) {
      return typeof parseInt( number ) === 'number';
    };
    object( object ) {
      return typeof object === 'object' && object instanceof Object;
    };
    string( string ) {
      return typeof string === 'string';
    };
  };
}());

// [jScript] Variable to be used as a class
var jScript = function( selector , context ) {
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


// Js function initiator
var Js = function( selector , context ) {
  return new jScript( selector , context );
};

// Adds object-type prototype list to a variable/object
Js.addPrototype = function( element , prototype ) {
  if ( element && Is.object( prototype ) ) {
    for (var variable in prototype) {
      if (prototype.hasOwnProperty(variable)) {
        element.prototype[ variable ] = prototype[ variable ];
      }
    }
  }
};
// Converts a string of css query-selector into array of :: element|class~classlist|id|attributes
Js.cssquery = function( context ) {
  if ( Is.string( context ) ) {
    var elmarr = [];
    var eidarr = [];
    var clsarr = [];
    var atrarr = [];
    var result = [];
    result.id = '';
    result.attr = {};
    result.list = [];
    result.class = '';
    result.element = 'div';

    ( context.match( /\[[^\]]*\]/g ) || [] ).forEach(( attr ) => {
      context = context.replace( attr , '' );
      atrarr.push( attr );

      var section = attr.match( /(?<=\[).+?(?=\])/g );
      if( !section || !section.length ) return;
      section = section[ 0 ];
      var query = section.includes( '=' ) ? section.substring( 0 , section.indexOf( '=' ) ) : section;
      if ( query && query.length ) {
        value = section.includes( '=' ) ? section.substring( section.indexOf( '=' ) + 1 ) : '';
        value = !value ? [] : value.length > 1 ? value.match( /\(?[^\'\"\`]+[^\'\"\`]\)?/g ) || [] : [ value ];
        value = ( value && value.length ) ? value[ 0 ] : '';
        result.attr[ query ] = value;
      }
    });

    ( context.match( /\(?.[^\.\#]+[^\.\#]\)?/g ) || [] ).forEach(( query , i ) => {
      context = context.replace( query , '' );
      if ( query.match( /[^A-Za-z0-9\.\#\-\_]/g ) ) return;
      if ( query.charAt() === '.' ) {
        clsarr.push( query );
        var string = query.substring( 1 );
        result.list.push( string );
        result.class += string + ' ';
      } else if ( query.charAt() === '#' ) {
        eidarr.push( query );
        result.id = query.substring( 1 );
      } else if ( !i ) {
        elmarr.push( query );
        result.element = query;
      }
    });
    if ( context && context.length ) {
      elmarr.push( context );
      result.element = context;
    }
    Array.prototype.push.apply( result , [ ...elmarr , ...eidarr , ...clsarr , ...atrarr ] );
    return result.length ? result : null;
  }
  return null;
};
// Js time based events :: prevents uses of setTimeout by jScript to certain extent
Js.timeout = function( callback , delay ) {
  callback = Is.function( callback ) ? callback : function() {};
  if ( !Is.number( delay ) ) delay = 0;
  if ( window.scheduler ) scheduler.postTask( callback , { delay : delay } ); else return window.setTimeout( callback , delay );
};
// Gemerate random characters
Js.random = {
  string : function( string , length = 32 ) {
    if ( !string ) string = '0123456789abcdefghijklmnopqrstuvwxyz'; else string = String( string );
    if ( !parseInt( length ) ) length = 32;
    var result = '';
    for (var i = 0; i < length; i++) result += string.charAt( Math.floor( Math.random() * string.length ) );
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
};
// If document is ready
(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || 'docReady';
  baseObj = baseObj || window;
  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;
  function ready() {
    if ( !readyFired ) {
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        readyList[ i ].fn.call( window , readyList[ i ].ctx );
      }
      readyList = [];
    }
  }
  function readyStateChange() {
    if ( document.readyState === 'complete' ) {
      ready();
    }
  }
  baseObj[funcName] = function(callback, context) {
    if ( typeof callback !== 'function' ) {
      throw new TypeError('callback for docReady(fn) must be a function');
    }
    if ( readyFired ) {
      Js.timeout( function() { callback( context ); } , 1 );
      return;
    } else {
      readyList.push({ fn : callback , ctx : context });
    }
    if ( document.readyState === 'complete' || ( !document.attachEvent && document.readyState === 'interactive' ) ) {
      Js.timeout( ready , 1 );
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
  }
})( 'ready' , Js );
// Add prototypes to jScript
Js.addPrototype( jScript , {
  ...{// Array iterators
    each : function( callback ) {
      if ( !Is.function( callback ) ) return this;
      for (var i = 0; i < this.length; i++) callback.call( this[i] , Js( this[i] ) , i , this[i] );
      return this;
    },
    reverse : function() {
      var result = Js();
      for (var i = this.length - 1; i >= 0; i--) result.add( this[i] );
      return result;
    },
    then : function( callback ) {
      var result;
      if ( Is.function( callback ) ) result = callback.call( this , this );
      return ( result !== undefined ) ? result : this;
    },
    toArray : function() {
      var result = [];
      this.each(function() {
        result.push( this );
      });
      return result;
    },
  },
  ...{// Array modifier
    add : function( ...selector ) {
      //selector = Js( selector );
      var root = this;
      if ( selector.length ) {
        for (var i = 0; i < selector.length; i++) {
          Js( selector[ i ] ).each(function() {
            root[ ( root.length ) ] = this;
            root.length++;
          });
        }
      }
      return this;
    },
    not : function( selector ) {
      selector = Js( selector );
      var result = Js();
      this.each(function() {
        var match = this;
        selector.each(function() {
          if ( match !== this ) result.add( match );
        });
      });
      return result;
    },
  },
  ...{// Element modifier
    addClass : function( string ) {
      if ( Is.string( string ) ) {
        string.split( ' ' ).forEach(( cls ) => {
          if ( cls ) {
            this.each(function() {
              this.classList.add( cls );
            });
          }
        });
      }
      return this;
    },
    attr : function( context , value ) {
      if ( Is.object( context ) ) {
        for ( var key in context ) {
          if ( context[ key ] !== undefined ) {
            this.each(function() {
              this.setAttribute( key , context[ key ] );
            });
          }
        }
      } else if ( Is.string( context ) ) {
        if ( value !== undefined ) {
          this.each(function() {
            this.setAttribute( context , value );
          });
        } else {
          return this[ 0 ] ? this[ 0 ].getAttribute( context ) : undefined;
        }
      }
      return this;
    },
    css : function( context , value ) {
      if ( Is.object( context ) ) {
        for ( var key in context ) {
          if ( context[ key ] ) {
            this.each(function() {
              this.style.setProperty( key , context[ key ] );
            });
          } else {
            this.each(function() {
              this.style.removeProperty( key );
            });
          }
        }
      } else if ( Is.string( context ) ) {
        if ( value || value === null || value === '' ) {
          if ( !value ) {
            this.each(function() {
              this.style.removeProperty( context );
            });
          } else {
            this.each(function() {
              this.style.setProperty( context , value );
            });
          }
        } else {
          if ( this[ 0 ] ) {
            var result = window.getComputedStyle( this[ 0 ] ).getPropertyValue( context );
            return parseFloat( result ) || result;
          }
          return undefined;
        }
      }
      return this;
    },
    data : function( context , value ) {
      if ( Is.object( context ) ) {
        for ( var key in context ) {
          if ( context[ key ] !== undefined ) {
            this.each(function() {
              this.dataset[ key ] = context[ key ];
            });
          }
        }
      } else if ( Is.string( context ) ) {
        if ( value !== undefined ) {
          this.each(function() {
            this.dataset[ context ] = value;
          });
        } else {
          return this[ 0 ] ? this[ 0 ].dataset[ context ] : undefined;
        }
      }
      return this;
    },
    proto : function( context , value ) {
      if ( Is.object( context ) ) {
        for ( var key in context ) {
          if ( context[ key ] || context[ key ] === '' ) {
            this.each(function() {
              this[ key ] = context[ key ];
            });
          } else {
            this.each(function() {
              delete this[ context ];
            });
          }
        }
      } else if ( Is.string( context ) ) {
        if ( value || value === null || value === '' ) {
          if ( value === null ) {
            this.each(function() {
              delete this[ context ];
            });
          } else {
            this.each(function() {
              this[ context ] = value;
            });
          }
        } else {
          return this[ 0 ] ? this[ 0 ][ context ] : undefined;
        }
      }
      return this;
    },
    removeAttr : function( context ) {
      if ( Is.string( context ) ) {
        context.split( ' ' ).forEach(( attr ) => {
          if ( attr ) {
            this.each(function() {
              this.removeAttribute( attr );
            });
          }
        });
      }
      return this;
    },
    removeClass : function( string ) {
      if ( Is.string( string ) ) {
        string.split( ' ' ).forEach(( cls ) => {
          if ( cls ) {
            this.each(function() {
              this.classList.remove( cls );
            });
          }
        });
      }
      return this;
    },
    removeData : function( context ) {
      if ( Is.string( context ) ) {
        context.split( ' ' ).forEach(( attr ) => {
          if ( attr ) {
            this.each(function() {
              delete this.dataset[ attr ];
            });
          }
        });
      }
      return this;
    },
    removeProto : function( context ) {
      if ( Is.string( context ) ) {
        context.split( ' ' ).forEach(( proto ) => {
          if ( proto ) {
            this.each(function() {
              delete this[ proto ];
            });
          }
        });
      }
      return this;
    },
    toggleAttr : function( attribute , value ) {
      if ( Is.string( attribute ) ) {
        this.each(function( item ) {
          if ( item.hasAttr( attribute ) ) {
            item.removeAttr( attribute );
          } else {
            item.attr( attribute , value );
          }
        });
      }
      return this;
    },
    toggleClass : function( classes ) {
      if ( Is.string( classes ) ) {
        classes.split(' ').forEach(( cls ) => {
          if ( cls ) {
            this.each(function() {
              this.classList.toggle( cls );
            });
          }
        });
      }
      return this;
    },
    toggleData : function( data , value ) {
      if ( Is.string( data ) ) {
        this.each(function( item ) {
          if ( item.hasData( data ) ) {
            item.removeData( data );
          } else {
            item.data( data , value );
          }
        });
      }
      return this;
    },
    toggleProto : function( prototype , value ) {
      if ( Is.string( prototype ) ) {
        this.each(function( item ) {
          if ( item.hasProto( prototype ) ) {
            item.removeProto( prototype );
          } else {
            item.proto( prototype , value );
          }
        });
      }
      return this;
    },
    remove : function() {
      this.each(function() {
        if ( this && this.parentNode && this.parentNode.contains( this ) ) this.parentNode.removeChild( this );
      });
      return this;
    },
  },
  ...{// Display modifier
    fadeIn : function( timeout , callback ) {
      if ( Is.function( timeout ) ) {
        callback = timeout;
        timeout = undefined;
      }
      if ( !Is.function( callback ) ) callback = function() {};
      this.each(function( item ) {
        var prestyle = 'block';
        if ( this.style.display === 'none' ) {
          this.style.opacity = '0';
          this.style.display = '';
          prestyle = item.css( 'display' );
        } else {
          this.style.opacity = '0';
          this.style.display = '';
        }
        if ( Is.number( timeout ) ) {
          this.style.display = prestyle;
          var last = +new Date();
          var tick = () => {
            this.style.opacity = +this.style.opacity + ( new Date() - last ) / timeout;
            last = +new Date();
            if ( +this.style.opacity < 1 ) {
              ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || Js.timeout( tick , 16 );
            } else {
              this.style.opacity = '';
              callback.call( this );
            }
          };
          tick();
        } else {
          this.style.opacity = '';
          this.style.display = prestyle;
          callback.call( this );
        }
      });
      return this;
    },
    fadeOut : function( timeout , callback ) {
      if ( Is.function( timeout ) ) {
        callback = timeout;
        timeout = undefined;
      }
      if ( !Is.function( callback ) ) callback = function() {};
      this.each(function( item ) {
        this.style.opacity = '1';
        this.style.display = '';
        if ( Is.number( timeout ) ) {
          var last = +new Date();
          var tick = () => {
            this.style.opacity = +this.style.opacity - ( new Date() - last ) / timeout;
            last = +new Date();
            if ( +this.style.opacity > 0 ) {
              ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || Js.timeout( tick , 16 );
            } else {
              this.style.opacity = '';
              this.style.display = 'none';
              callback.call( this );
            }
          };
          tick();
        } else {
          this.style.opacity = '';
          this.style.display = 'none';
          callback.call( this );
        }
      });
      return this;
    },
    hide : function() {
      this.css( 'display' , 'none' );
      return this;
    },
    show : function() {
      this.css( 'display' , '' );
      return this;
    },
  },
  ...{// Children modifier
    after : function( ...nodes ) {
      nodes.forEach(( node ) => {
        this.each(function() {
          if ( Is.jScript( node ) || Is.jQuery( node ) ) {
            var temp = this;
            node.each(function() {
              temp.parentNode.insertBefore( this , temp.nextSibling );
            });
          } else if ( Is.node( node ) ) {
            this.parentNode.insertBefore( node , this.nextSibling );
          }
        });
      });
      return this;
    },
    append : function( ...nodes ) {
      var root = this;
      nodes.forEach(( node ) => {
        this.each(function() {
          if ( Is.jScript( node ) || Is.jQuery( node ) ) {
            var temp = this;
            node.each(function() {
              temp.appendChild( this );
            });
          } else if ( Is.array( node ) ) {
            node.forEach(( item ) => {
              root.append( item );
            });
          } else if ( Is.string( node ) || Is.number( node ) || Is.boolean( node ) ) {
            this.innerHTML += String( node );
          } else if ( Is.node( node ) ) {
            this.appendChild( node );
          }
        });
      });
      return this;
    },
    appendTo : function( context ) {
      Js( context ).append( this );
      return this;
    },
    before : function( ...nodes ) {
      nodes.forEach(( node ) => {
        this.each(function() {
          if ( Is.jScript( node ) || Is.jQuery( node ) ) {
            var temp = this;
            node.each(function() {
              temp.parentNode.insertBefore( this , temp );
            });
          } else if ( Is.node( node ) ) {
            this.parentNode.insertBefore( node , this );
          }
        });
      });
      return this;
    },
    empty : function() {
      this.each(function() {
        this.innerHTML = '';
      });
      return this;
    },
    html : function( html ) {
      if ( html === undefined ) return this[ 0 ] ? this[ 0 ].innerHTML : undefined;
      this.each(function( item ) {
        if ( Is.function( html ) ) html = html.call( this , item );
        this.innerHTML = String( html );
      });
      return this;
    },
    prepend : function( ...nodes ) {
      nodes.forEach(( node ) => {
        this.each(function() {
          if ( Is.jScript( node ) || Is.jQuery( node ) ) {
            var temp = this;
            node.each(function() {
              temp.prepend( this );
            });
          } else if ( Is.string( node ) || Is.number( node ) || Is.boolean( node ) ) {
            this.innerHTML = String( node ) + this.innerHTML;
          } else if ( Is.node( node ) ) {
            this.prepend( node );
          }
        });
      });
      return this;
    },
    prependTo : function( context ) {
      Js( context ).prepend( this );
      return this;
    },
    text : function( text ) {
      if ( text === undefined ) return this[ 0 ] ? this[ 0 ].innerText : undefined;
      this.each(function() {
        this.innerText = String( text );
      });
      return this;
    },
  },
  ...{// Has or contain data
    containAttr : function( attribute ) {
      var result = Js();
      for (var i = 0; i < this.length; i++) if ( this[ i ].hasAttribute( attribute ) ) result.add( this[ i ] );
      return result;
    },
    containClass : function( classes ) {
      var result = Js();
      for (var i = 0; i < this.length; i++) if ( this[ i ].classList.contains( classes ) ) result.add( this[ i ] );
      return result;
    },
    containData : function( data ) {
      var result = Js();
      for (var i = 0; i < this.length; i++) if ( this[ i ].dataset[ data ] ) result.add( this[ i ] );
      return result;
    },
    containProto : function( prototype ) {
      var result = Js();
      for (var i = 0; i < this.length; i++) if ( this[ i ][ prototype ] ) result.add( this[ i ] );
      return result;
    },
    contained : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return ( this && this[ index ] && ( document.contains( this[ index ] ) || Js( this[ index ] ).closestShadow().contains( this[ index ] ) ) );
    },
    hasAttr : function( context ) {
      if ( Is.string( context ) && this.length ) return this[ 0 ].hasAttribute( context );
      return false;
    },
    hasClass : function( context ) {
      return Is.string( context ) && this.length && this[ 0 ].classList.contains( context );
    },
    hasData : function( context ) {
      if ( Is.string( context ) && this.length ) return this[ 0 ].dataset[ context ] !== undefined;
      return false;
    },
    hasProto : function( context ) {
      if ( Is.string( context ) && this.length ) return this[ 0 ][ context ] !== undefined;
      return false;
    },
  },
  ...{// Basic events
    scrollIntoView : function() {
      return ( this && this[ 0 ] ? this[ 0 ].scrollIntoView({ behavior : 'smooth' }) : false ) , this;
    },
    select : function() {
      this.each(function() {
        this.select();
        this.setSelectionRange(0, 99999);
      });
      return this;
    },
  },
  ...{// Element relative data
    height : function( height ) {
      if ( height || height === 0 ) {
        this.css( 'height' , ( typeof height === 'number' ? height + 'px' : height ) );
      } else {
        return parseFloat( this.css( 'height' ) );
      }
      return this;
    },
    href : function( refer ) {
      if ( !refer ) return this[ 0 ] && this[ 0 ].href ? this[ 0 ].href : undefined;
      this.each(function() {
        this.href = refer;
      });
      return this;
    },
    position : function( withMargin = false ) {
      if ( !this.length ) return undefined;
      var top = this[ 0 ].offsetTop , left = this[ 0 ].offsetLeft;
      if ( !withMargin ) {
        top -= parseFloat( this.eq( 0 ).css( 'margin-top' ) ) || 0;
        left -= parseFloat( this.eq( 0 ).css( 'margin-left' ) ) || 0;
      }
      return {
        top : top,
        left : left,
      };
    },
    src : function( source ) {
      if ( !source ) return this[ 0 ] && this[ 0 ].src ? this[ 0 ].src : undefined;
      this.each(function() {
        this.src = source;
      });
      return this;
    },
    val : function( value , dispatch ) {
      if ( value === undefined ) {
        return this[0] ? this[0].value : undefined;
      } else if ( value === null || value === '' ) {
        this.each(function() {
          this.value = '';
        });
      } else {
        this.each(function() {
          this.value = value;
        });
      }
      if ( dispatch ) {
        this.dispatchEvent( new Event( 'input' ) );
        this.dispatchEvent( new Event( 'change' ) );
      }
      return this;
    },
    width : function( width ) {
      if ( width || width === 0 ) {
        this.css( 'width' , ( typeof width === 'number' ? width + 'px' : width ) );
      } else {
        return parseFloat( this.css( 'width' ) );
      }
      return this;
    },
  },
  ...{// Return elemments
    children : function( context ) {
      var result = Js();
      this.each(function() {
        if ( context === undefined ) {
          result.add( this.children );
        } else {
          this.querySelectorAll( ':scope > ' + context ).forEach(( item ) => {
            if ( item.parentNode === this ) result.add( item );
          });
        }
      });
      return result;
    },
    clone : function() {
      var result = Js();
      this.each(function() {
        result.add( this.cloneNode( true ) );
      });
      return result;
    },
    closest : function( selector ) {
      var result = Js() , selector = Js( selector ) , found = false;
      outerloop:
      for ( var i = 0; i < this.length; i++ ) {
        var select = this[ i ];
        while ( select && !found ) {
          innerloop:
          for (var j = 0; j < selector.length; j++) {
            if ( select === selector[ j ] ) {
              result.add( selector[ j ] );
              found = true;
              break innerloop;
              break outerloop;
            }
          }
          select = select.parentNode;
        }
      }
      return result;
    },
    content : function() {
      var result = Js();
      this.each(function() {
        result.add( this.content.cloneNode( true ) );
      });
      return result;
    },
    eq : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return Js( this [ index ] );
    },
    find : function( selector ) {
      var result = Js();
      if ( Is.string( selector ) ) {
        this.each(function() {
          result.add( this.querySelectorAll( selector ) );
        });
      }
      return result;
    },
    first : function() {
      return Js( ( this && this.length ? this[ 0 ] : '' ) );
    },
    firstChild : function() {
      return this.children().first();
    },
    get : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return this[ index ] || null;
    },
    index : function( context ) {
      if ( context ) return this.indexOf( context );
      var index = -1;
      if ( this.length ) {
        var element = this[ 0 ];
        index = 0;
        while ( element = element.previousElementSibling ) index++;
      }
      return index;
    },
    indexOf : function( context ) {
      var index = -1;
      context = Js( context );
      if ( this.length && context.length ) {
        this.each(function( item , i ) {
          if ( this === context[ 0 ] ) index = i;
        });
      }
      return index;
    },
    is : function( selector , index = 0 ) {
      index = parseInt( index ) || 0;
      if ( selector === Js ) return true;
      if ( selector === this ) return true;
      selector = Js( selector );
      if ( this.length ) for (var i = 0; i < selector.length; i++) if ( selector[ i ] === this[ index ] ) return true;
      return false;
    },
    last : function() {
      return Js( ( this && this.length ? this[ this.length - 1 ] : '' ) );
    },
    lastChild : function() {
      return this.children().last();
    },
    match : function() {
      var result = Js();
      this.each(function( item ) {
        if ( item.is( item ) ) result.add( this );
      });
      return result;
    },
    next : function( element ) {
      var result = Js();
      this.each(function() {
        var next = element ? this.nextElementSibling : this.nextSibling;
        if ( next ) result.add( next );
      });
      return result;
    },
    parent : function( context ) {
      var result = Js();
      context = Js( context );
      if ( this.length ) {
        if ( context.length ) {
          outerloop:
          for (var i = 0; i < this.length; i++) {
            innerloop:
            for (var j = 0; j < context.length; j++) {
              if ( this[ i ].parentNode === context[ j ] ) {
                result.add( context[ j ] );
                return result;
              }
            }
          }
        } else {
          result.add( this[ 0 ].parentNode );
        }
      }
      return result;
    },
    prev : function( element ) {
      var result = Js();
      this.each(function() {
        var prev = element ? this.previousElementSibling : this.previousSibling;
        if ( prev ) result.add( prev );
      });
      return result;
    },
    shadow : function() {
      var result = Js();
      this.each(function() {
        result.add( this.shadowRoot || this.attachShadow({ mode : 'open' }) );
      });
      return result;
    },
    toString : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return Js.ce( 'div' ).append( this.eq( index ).clone() ).html().replaceAll( '\n' , '' ).replaceAll( '  ' , '' );
    },
  },
  ...{// Event manager
    bind : function( name , callback , capture , dispatch ) {
      if ( Is.string( name ) && Is.function( callback ) ) {
        name.split( ' ' ).forEach(( type ) => {
          if ( type ) {
            this.each(function() {
              this.addEventListener( type , callback , ( capture ?? true ) );
              if ( dispatch ) this.dispatchEvent( new Event( type ) );
            });
          }
        });
      }
      return this;
    },
    event : function( type ) {
      if ( Is.string( type ) ) {
        this.each(function() {
          if ( [ 'blur' , 'click' , 'focus' , 'submit' ].includes( type ) ) {
            this[ type ]();
          } else {
            this.dispatchEvent( new Event( type , { bubbles : true } ) );
          }
        });
      }
      return this;
    },

    auxclick : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'auxclick' , callback , capture );
      } else {
        this.event( 'auxclick' );
      }
      return this;
    },
    blur : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'blur' , callback , capture );
      } else {
        this.event( 'blur' );
      }
      return this;
    },
    change : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'change' , callback , capture );
      } else {
        this.event( 'change' );
      }
      return this;
    },
    click : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'click' , callback , capture );
      } else {
        this.event( 'click' );
      }
      return this;
    },
    dblclick : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'dblclick' , callback , capture );
      } else {
        this.event( 'dblclick' );
      }
      return this;
    },
    focus : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'focus' , callback , capture );
      } else {
        this.event( 'focus' );
      }
      return this;
    },
    hover : function( mouseover , mouseout ) {
      if ( Is.function( mouseover ) ) {
        this.bind( 'mouseover' , mouseover );
        if ( Is.function( mouseout ) ) this.bind( 'mouseout' , mouseout );
      } else {
        this.each(function() {
          //this.hover();
        });
      }
      return this;
    },
    input : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'input' , callback , capture );
      } else {
        this.event( 'input' );
      }
      return this;
    },
    keydown : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keydown' , callback , capture );
      } else {
        this.event( 'keydown' );
      }
      return this;
    },
    keypress : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keypress' , callback , capture );
      } else {
        this.event( 'keypress' );
      }
      return this;
    },
    keyup : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keyup' , callback , capture );
      } else {
        this.event( 'keyup' );
      }
      return this;
    },
    load : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'load' , callback , capture );
      } else {
        this.event( 'load' );
      }
      return this;
    },
    lookup : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'input drop paste change focus blur' , callback , capture );
      } else {
        this.event( 'input' );
        this.event( 'change' );
        this.event( 'blur' );
      }
      return this;
    },
    mousedown : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mousedown' , callback , capture );
      } else {
        this.event( 'mousedown' );
      }
      return this;
    },
    mouseenter : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseenter' , callback , capture );
      } else {
        this.event( 'mouseenter' );
      }
      return this;
    },
    mouseleave : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseleave' , callback , capture );
      } else {
        this.event( 'mouseleave' );
      }
      return this;
    },
    mousemove : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mousemove' , callback , capture );
      } else {
        this.event( 'mousemove' );
      }
      return this;
    },
    mouseout : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseout' , callback , capture );
      } else {
        this.event( 'mouseout' );
      }
      return this;
    },
    mouseover : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseover' , callback , capture );
      } else {
        this.event( 'mouseover' );
      }
      return this;
    },
    mouseup : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseup' , callback , capture );
      } else {
        this.event( 'mouseup' );
      }
      return this;
    },
    overflow : function( flowstart , flowend ) {
      if ( flowstart ) {
        this.each(function( item , i , element ) {
          Js.overflowObserver.push({
            selector : item,
            element : element,
            flowstart : flowstart,
            flowend : flowend,
          });
        });
      } else {
        return ( this[ 0 ] && this[ 0 ].scrollWidth > this[ 0 ].clientWidth );
      }
      return this;
    },
    removeOverflow : function() {
      this.each(function() {
        var array = Js.arrObj.objInArr( Js.overflowObserver , 'element' , this );
        if ( Is.object( array ) ) Js.overflowObserver.splice( array.index , 1 );
      });
      return this;
    },
    reset : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'reset' , callback , capture );
      } else {
        this.event( 'reset' );
      }
      return this;
    },
    resize : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'resize' , callback , capture );
      } else {
        this.event( 'resize' );
      }
      return this;
    },
    scroll : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'scroll' , callback , capture );
      } else {
        this.event( 'scroll' );
      }
      return this;
    },
    submit : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'submit' , callback , capture );
      } else {
        this.event( 'submit' );
      }
      return this;
    },
    update : function( callback , capture ) {
      if ( Is.function( callback ) ) {
        this.bind( 'input drop paste change' , callback , capture );
      } else {
        this.event( 'input' );
        this.event( 'change' );
      }
      return this;
    },
  },
});

// Bypass a variable to add new prototypes
Js.fn = jScript.prototype;

// Convert text cases
Js.textcase = {
  camelToSnake : function( string , replace = '-' ) {
    if ( Is.string( string ) ) {
      if ( ![ '-' , '_' ].includes( replace ) ) replace = '-';
      string = string.replace(/[A-Z]/g, letter => `${ replace + letter.toLowerCase() }`);
    }
    return string;
  },
  snakeToCamel : function( string ) {
    if ( Is.string( string ) ) string = string.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace( '-' , '' ).replace( '_' , '' ));
    return string;
  },
  textToSnake : function( string ) {
    if ( Is.string( string ) ) {
      return string.toLowerCase().replaceAll( ' ' , '-' ).replace( /[^a-z0-9\-\_]/gi , '' ).replace( /—+/g , '-' );
    }
    return string;
  },
};

// system encoders and decoders
Js.eu = function( data ) {
  return window.encodeURI( data );
};
Js.eu.c = function( data ) {
  return window.encodeURIComponent( data );
};

// Length measurements
Js.measures = {
  vpTopx : function( value ) {
    var parts = value.match( /([0-9\.]+)(vh|vw)/ ) || [ 1 , 'vw' ];
    var q = Number( parts[ 1 ] ) || 1;
    var side = window[ [ 'innerHeight' , 'innerWidth' ][ [ 'vh' , 'vw' ].indexOf( parts[ 2 ] ) ] || 'vw' ];
    return side * ( q / 100 );
  },
};
// Decoders
Js.decode = {
  entities : (function() {

    var element = document.createElement('div');
    function decodeHTMLEntities (str) {
      if(str && typeof str === 'string') {
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }
      return str;
    }
    return decodeHTMLEntities;
  })(),
};

// Find links and replace to anchors
Js.urlify = function( text , target = '_blank' ) {
  return text.replace( /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig , ( url ) => {
    return `<a href="${url}" target="${target}">${url}</a>`;
  });
};
// Add slashes to string
Js.addslashes = function( string ) {
  return String( string ).replace(/([\\"'/[/(/)])/g, "\\$1").replace(/\0/g, "\\0");
};

// Get script files
Js.getScript = function( source , callback ) {
  if ( !source ) throw new Error( 'No source argument was passed.' );
  callback = Is.function( callback ) ? callback : function() {};
  var script = Js.ce( 'script[jScript]' ).load( callback ).src( source );
  Js( 'head > script' ).eq().after( script );
  return script;
};

// manipulate css style blocks
Js.serialize = function( object ) {
  var result = '';
  if ( Is.object( object ) ) {
    for ( var variable in object ) {
      result += variable + '=' + object[ variable ] + '&';
    }
    result = result.slice( 0 , -1 );
  }
  return result;
};
Js.cssStyle = function( css ) {
  if ( Is.function( css ) ) css = css();
  var result = '';
  var modify = function( object ) {
    if ( Is.object( object ) ) {
      for ( var key in object ) {
        var value = object[ key ];
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
  }
  if ( Is.array( css ) ) {
    css.forEach(( item ) => {
      if ( Is.object( item ) ) {
        modify( item );
      } else if ( Is.string( item ) ) {
        result += item;
      }
    });
  } else if ( Is.object( css ) ) {
    modify( css );
  } else if ( Is.string( css ) ) {
    result += css;
  }
  if ( window.csso ) result = window.csso.minify( result ).css;
  return result;
};
Js.cssStyle.block = function( css ) {
  if ( Is.function( css ) ) css = css();
  var result = '';
  if ( Is.object( css ) ) {
    for (var key in css) result += key + ': ' + css[ key ] + '; ';
  } else if ( Is.string( css ) ) {
    result = css;
  }
  if ( window.csso ) result = window.csso.minifyBlock( result ).css;
  return result;
};
Js.cssStyle.toObject = function( css ) {
  var object = {};
  css = css.replace(/\n/g , '').replaceAll(' ' , '');
  css.split( ';' ).forEach(( declare ) => {
    if ( declare ) {
      var split = declare.split( ':' );
      if ( split.length ) object[ Js.textcase.snakeToCamel( split[ 0 ] ) ] = split[ 1 ];
    }
  });
  return object;
};

// Array or object functons
Js.arrObj = {
  objInArr : function( array , key , value ) {
    for (var i = 0; i < array.length; i++) if ( array[ i ][ key ] === value ) return { item : array[ i ] , index : i };
    return null;
  },
  valToObj : function( data , value ) {
    var result = {};
    if ( Is.object( data ) ) {
      for (var variable in data) {
        if (data.hasOwnProperty(variable)) {
          result[ variable ] = data[ variable ] ?? null;
        }
      }
    } else if ( Is.string( data ) ) {
      result[ data ] = value ?? null;
    }
    return result;
  },
  arrCompare : function( arr1 , arr2 ) {
    if ( !Array.isArray( arr1 ) || !Array.isArray( arr2 ) || arr1.length !== arr2.length ) return false;
    const temp1 = arr1.concat().sort();
    const temp2 = arr2.concat().sort();
    for (let i = 0; i < temp1.length; i++) if ( temp1[ i ] !== temp2[ i ] ) return false;
    return true;
}
};

// Custom stylesheets for apps
Js.styleSheet = function( data , appendTo , query , blob ) {
  var html = Js.cssStyle( data );
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
};

// Create an element using Js
Js.ce = function( selector , ...children ) {
  var element = Js();
  var query = Js.cssquery( selector );
  if ( query && query.element ) {
    element = Js( window.document.createElement( query.element ) );
    if ( query.id ) element.attr( 'id' , query.id );
    if ( query.class ) element.addClass( query.class );
    if ( query.attr ) element.attr( query.attr );
    element.append( children );
  };
  return element;
};
Js.cm = function( selector , appendTo ) {
  if ( !selector ) return Js();
  var match = Js( selector );
  if ( !match.length ) return Js.ce( selector ).appendTo( appendTo );
  return match;
};

// Overflow Observer :: used as Js().overflow();
Js.overflowObserver = [];
Js.overflowObserver.monitered = 0;
Js.overflowObserver.moniterSpeed = 300;
(function observeOverflow() {
  Js.overflowObserver.forEach(( item , i ) => {
    var flowstart = item.flowstart;
    var flowend = item.flowend;
    if ( item.element.scrollWidth > item.element.clientWidth ) {
      if ( Is.function( flowstart ) ) flowstart.call( item.element , item.selector , item.element );
    } else {
      if ( Is.function( flowend ) ) flowend.call( item.element , item.selector , item.element );
    }
    Js.overflowObserver.monitered++;
  });
  Js.timeout( observeOverflow , Js.overflowObserver.moniterSpeed );
}());

// Window is for mobile or desktop
Js.definestructure = function() {
  if ( Is.mobile() ) Js( 'html' ).addClass( 'mobile-device' ); else Js( 'html' ).removeClass( 'mobile-device' );
  if ( window.innerWidth <= 425 ) Js( 'html' ).addClass( 'mobile-device-ratio' ); else Js( 'html' ).removeClass( 'mobile-device-ratio' );
  Js( 'html' ).css( '--vh' , `${window.innerHeight * 0.01}px` );
};
Js.definestructure();
Js( window ).bind( 'resize' , Js.definestructure );
