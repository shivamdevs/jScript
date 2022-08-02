var Is = {
  // Get instance by  ::  variable.constructor.name
  array : function( context ) {
    return typeof context === 'object' && context instanceof Array;
  },
  boolean : function( context ) {
    return typeof context === 'boolean';
  },
  cssquery : function( context ) {
    if ( Is.string( context ) ) {
      var selector = context.match( /\(?.[^\.\#\[]+[^\.\#\[]\)?/g );
      if ( Is.array( selector ) ) {
        var result = [];
        result.list = [];
        result.class = '';
        result.id = '';
        result.attr = {};
        result.element = null;
        selector.forEach(( query ) => {
          if ( query.charAt() === '.' || query.charAt() === '#' ) {
            var string = query.substring( 1 );
            if ( !string.match( /[^A-Za-z0-9_-]/ ) ) {
              result.push( query );
              if ( query.charAt() === '.' ) {
                result.list.push( string );
                result.class += string + ' ';
              } else if ( query.charAt() === '#' ) {
                result.id = string;
              }
            }
          } else if ( ( query.match( /(?<=\[).+?(?=\])/g ) || [] ).length ) {
            result.push( query );
            var string = query.match( /(?<=\[).+?(?=\])/g )[ 0 ];
            var section = string.split( '=' );
            var attr = section[ 0 ];
            if ( attr && attr.length ) {
              var value = section[ 1 ] ? section[ 1 ].match( /\(?[^\'\"\`]+[^\'\"\`]\)?/g ) : '';
              value = ( value && value.length ) ? value[ 0 ] : ( section[ 1 ] || '' );
              result.attr[ attr ] = value;
            }
          } else if ( !( query.match( /[\.\[\]\#\'\"\`]/g ) || [] ).length ) {
            result.push( query );
            result.element = query;
          } else {
            console.log(query);
          }
        });
        if ( result.length ) {
          return result;
        }
      }
    }
    return false;
  },
  element : function( context ) {
    return context && context instanceof Element;
  },
  fileList : function( context ) {
    return typeof context === 'object' && context instanceof FileList;
  },
  function : function( context ) {
    return context && typeof context === 'function';
  },
  jScript : function( context ) {
    return context && window.jScript && context instanceof window.jScript;
  },
  jQuery : function( context ) {
    return context && window.jQuery && context instanceof window.jQuery;
  },
  mobile : function( context ) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( ( context || window ).navigator.userAgent );
  },
  node : function( context ) {
    return context && context instanceof Node;
  },
  number : function( context ) {
    return typeof context === 'number';
  },
  object : function( context ) {
    return typeof context === 'object' && context instanceof Object;
  },
  string : function( context ) {
    return typeof context === 'string';
  },
};

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
    if ( jScript.domreadystate ) {
      selector.call( jScript );
    } else {
      Js( document ).bind( 'DOMContentLoaded' , function( e ) {
        if ( !jScript.domreadystate ) jScript.domreadystate = true;
        selector.call( jScript , e );
      });
    }
  }

  if ( selector.length ) {
    for (var i = 0; i < selector.length; i++) {
      this[ i ] = selector[ i ];
    }
    this.length = selector.length;
  }
  return this;
};

jScript.prototype = {
  ...{
    add : function( selector ) {
      selector = Js( selector );
      if ( selector.length ) {
        for (var i = 0; i < selector.length; i++) {
          this[ ( this.length ) + i ] = selector[ i ];
        }
        this.length += selector.length;
      }
      return this;
    },
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
    all : function() {
      var result = Js();
      function add( list ) {
        Js( list ).each(function() {
          result.add(this);
          if ( this.children.length ) add( this.children );
        });
      };
      add( this.children() );
      return result;
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
    attrX : function( context ) {
      this.each(function( item ) {
        item.attr( context , '' );
      });
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
    bind : function( name , callback , capture , dispatch ) {
      if ( Is.string( name ) && Is.function( callback ) ) {
        name.split( ' ' ).forEach(( type ) => {
          if ( type ) {
            this.each(function() {
              this.addEventListener( type , callback , ( capture || true ) );
              if ( dispatch ) this.dispatchEvent( new Event( type ) );
            });
          }
        });
      }
      return this;
    },
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
    containPrototype : function( prototype ) {
      var result = Js();
      for (var i = 0; i < this.length; i++) if ( this[ i ][ prototype ] ) result.add( this[ i ] );
      return result;
    },
    contained : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return ( this && this[ index ] && ( document.contains( this[ index ] ) || Js( this[ index ] ).closestShadow().contains( this[ index ] ) ) );
    },
    content : function() {
      var result = Js();
      this.each(function() {
        result.add( this.content.cloneNode( true ) );
      });
      return result;
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
    each : function( callback ) {
      if ( !Is.function( callback ) ) return this;
      for (var i = 0; i < this.length; i++) callback.call( this[i] , Js( this[i] ) , i , this[i] );
      return this;
    },
    empty : function() {
      this.each(function() {
        this.innerHTML = '';
      });
      return this;
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
    hasAttr : function( context ) {
      if ( Is.string( context ) && this.length ) return this[ 0 ].hasAttribute( context );
      return false;
    },
    hasClass : function( context ) {
      return Is.string( context ) && this.length && this[ 0 ].classList.contains( context );
    },
    hasData : function( context ) {
      if ( Is.string( context ) && this.length ) return this[ 0 ].dataset[ context ];
      return false;
    },
    height : function( height ) {
      if ( height || height === 0 ) {
        this.css( 'height' , ( typeof height === 'number' ? height + 'px' : height ) );
      } else {
        return parseFloat( this.css( 'height' ) );
      }
      return this;
    },
    hide : function( timeout , callback ) {
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
              ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || setTimeout( tick , 16 );
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
    href : function( refer ) {
      if ( !refer ) return this[ 0 ] && this[ 0 ].href ? this[ 0 ].href : undefined;
      this.each(function() {
        this.href = refer;
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
    next : function( element ) {
      var result = Js();
      this.each(function() {
        result.add( ( element ? this.nextElementSibling : this.nextSibling ) );
      });
      return result;
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
    prev : function( element ) {
      var result = Js();
      this.each(function() {
        result.add( ( element ? this.previousElementSibling : this.previousSibling ) );
      });
      return result;
    },
    prototype : function( context , value ) {
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
    remove : function() {
      this.each(function() {
        if ( this && this.parentNode && this.parentNode.contains( this ) ) this.parentNode.removeChild( this );
      });
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
    reverse : function() {
      var result = Js();
      for (var i = this.length - 1; i >= 0; i--) result.add( this[i] );
      return result;
    },
    scrollIntoView : function() {
      return ( this && this[ 0 ] ? this[ 0 ].scrollIntoView() : false ) , this;
    },
    select : function() {
      this.each(function() {
        this.select();
        this.setSelectionRange(0, 99999);
      });
      return this;
    },
    shadow : function() {
      var result = Js();
      this.each(function() {
        result.add( this.shadowRoot || this.attachShadow({ mode : 'open' }) );
      });
      return result;
    },
    show : function( timeout , callback ) {
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
              ( window.requestAnimationFrame && requestAnimationFrame( tick ) ) || setTimeout( tick , 16 );
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
    src : function( source ) {
      if ( !source ) return this[ 0 ] && this[ 0 ].src ? this[ 0 ].src : undefined;
      this.each(function() {
        this.src = source;
      });
      return this;
    },
    text : function( text ) {
      if ( text === undefined ) return this[ 0 ] ? this[ 0 ].innerText : undefined;
      this.each(function() {
        this.innerText = String( text );
      });
      return this;
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
    toString : function( index = 0 ) {
      index =  parseInt( index ) || 0;
      return Js.ce( 'div' ).append( this.eq( index ).clone() ).html().replaceAll( '\n' , '' ).replaceAll( '  ' , '' );
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
  ...{
    $ : function() {
      return ( window.jQuery ) ? $( this ) : this;
    },
    InputWrap : function( getInstance = true ) {
      return ( getInstance ) ? InputWrap( this ) : InputWrap( this ) , this;
    },
    tippy : function( context , options ) {
      if ( Is.object( context ) ) options = context , context = null;
      if ( !Is.object( options ) ) options = {};
      if ( window.tippy ) {
        this.each(function( item ) {
          if ( this._tippy ) {
            if ( context ) this._tippy.setContent( context );
            this._tippy.setProps( options );
          } else {
            if ( context && !options.content ) options.content = context;
            tippy( this , options );
          }
        });
      }
      return this;
    },
  },
  ...{
    event : function( type ) {
      if ( Is.string( type ) ) { //&& [].includes( type )
        this.each(function() {
          if ( [ 'blur' , 'click' , 'focus' , 'submit' ].includes( type ) ) {
            this[ type ]();
          } else {
            this.dispatchEvent( new Event( type ) );
          }
        });
      }
      return this;
    },

    auxclick : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'auxclick' , callback );
      } else {
        this.event( 'auxclick' );
      }
      return this;
    },
    blur : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'blur' , callback );
      } else {
        this.event( 'blur' );
      }
      return this;
    },
    change : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'change' , callback );
      } else {
        this.event( 'change' );
      }
      return this;
    },
    click : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'click' , callback );
      } else {
        this.event( 'click' );
      }
      return this;
    },
    dblclick : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'dblclick' , callback );
      } else {
        this.event( 'dblclick' );
      }
      return this;
    },
    focus : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'focus' , callback );
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
    input : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'input' , callback );
      } else {
        this.event( 'input' );
      }
      return this;
    },
    keydown : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keydown' , callback );
      } else {
        this.event( 'keydown' );
      }
      return this;
    },
    keypress : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keypress' , callback );
      } else {
        this.event( 'keypress' );
      }
      return this;
    },
    keyup : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'keyup' , callback );
      } else {
        this.event( 'keyup' );
      }
      return this;
    },
    load : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'load' , callback );
      } else {
        this.event( 'load' );
      }
      return this;
    },
    mousedown : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mousedown' , callback );
      } else {
        this.event( 'mousedown' );
      }
      return this;
    },
    mouseenter : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseenter' , callback );
      } else {
        this.event( 'mouseenter' );
      }
      return this;
    },
    mouseleave : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseleave' , callback );
      } else {
        this.event( 'mouseleave' );
      }
      return this;
    },
    mousemove : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mousemove' , callback );
      } else {
        this.event( 'mousemove' );
      }
      return this;
    },
    mouseout : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseout' , callback );
      } else {
        this.event( 'mouseout' );
      }
      return this;
    },
    mouseover : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseover' , callback );
      } else {
        this.event( 'mouseover' );
      }
      return this;
    },
    mouseup : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'mouseup' , callback );
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
    reset : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'reset' , callback );
      } else {
        this.event( 'reset' );
      }
      return this;
    },
    resize : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'resize' , callback );
      } else {
        this.event( 'resize' );
      }
      return this;
    },
    scroll : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'scroll' , callback );
      } else {
        this.event( 'scroll' );
      }
      return this;
    },
    submit : function( callback ) {
      if ( Is.function( callback ) ) {
        this.bind( 'submit' , callback );
      } else {
        this.event( 'submit' );
      }
      return this;
    },
  },
};

var Js = function( selector , context ) {
  return new jScript( selector , context );
};
Js.ce = function( selector , query , children ) {
  var element = Js( document.createElement( selector ) );
  if ( ! Is.string( query ) && query !== null ) children = query , query = null;
  if ( query = Is.cssquery( query ) ) {
    if ( query.id ) element.attr( 'id' , query.id );
    if ( query.class ) element.addClass( query.class );
    if ( query.attr ) element.attr( query.attr );
  }
  element.append( children );
  return element;
};
Js.cd = function( selector , query , appendTo ) {
  if ( !selector ) return Js();
  var match = Js( selector + ( query ?? '' ) );
  if ( !match.length ) return Js.ce( selector , query ).appendTo( appendTo );
  return match;
};
Js.cc = function( selector , ...children ) {
  var element , query = Is.cssquery( selector );
  if ( !query || !query.element ) return element;
  element = Js.ce( query.element );
  if ( query.id ) element.attr( 'id' , query.id );
  if ( query.class ) element.addClass( query.class );
  if ( query.attr ) element.attr( query.attr );
  element.append( children );
  return element;
};

Js.urlify = function( text , target = '_blank' ) {
  return text.replace( /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig , ( url ) => {
    return `<a href="${url}" target="${target}">${url}</a>`;
  });
};
Js.addslashes = function( string ) {
  return String( string ).replace(/([\\"'/[/(/)])/g, "\\$1").replace(/\0/g, "\\0");
}

Js.idList = [];
Js.idList.new = function( prefix , suffix ) {
  var string = '0123456789abcdef';
  function g( length = 4 ) {
    var res = '';
    for (var i = 0; i < length; i++) {
      res += string.charAt( Math.floor( Math.random() * string.length ) );
    }
    return res;
  };
  var result = '';
  var onloop = true;
  while ( onloop ) {
    result = ( prefix ? prefix + '-' : '' ) + g(8) + '-' + g(4) + '-' + g(4) + '-' + g(4) + '-' + g(12) + ( suffix ? '-' + suffix : '' );
    if ( !Js.idList.includes( result ) ) {
      onloop = false;
      Js.idList.push( result );
    }
  }
  return result;
};
Js(function() {
  Js( '*[id]' ).each(function() {
    if ( this.id && !Js.idList.includes( this.id ) ) Js.idList.push( this.id );
  });
});

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
};
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
Js.styleSheet = function( data , appendTo , query , blob ) {
  var html = Js.cssStyle( data );
  if ( blob ) {
    return Js.ce( 'link' , query ?? null ).attr({
      jScript : '',
      rel : 'stylesheet',
      href : window.URL.createObjectURL( new Blob( [ html ], { type : 'text/css' } ) ),
    }).appendTo( appendTo ?? 'head' );
  }
  return Js.ce( 'style' , query ?? null , html ).attr({
    media : 'screen',
    jScript : '' ,
  }).appendTo( appendTo ?? 'head' ).bind( 'load' , function( event ) {
    if ( this.parentNode.toString() === '[object ShadowRoot]' ) {
      for (var i = 0; i < this.sheet.cssRules.length; i++ ) {
        if ( this.sheet.cssRules[ i ].type == 5 ) {
          const split = window.location.href.split('/');
          const stylePath = split.slice( 0 , split.length - 1 ).join( '/' );
          let cssText = this.sheet.cssRules[ i ].cssText;
          cssText = cssText.replace( /url\s*\(\s*[\'"]?(?!((\/)|((?:https?:)?\/\/)|(?:data\:?:)))([^\'"\)]+)[\'"]?\s*\)/g , `url("${stylePath}/$4")` );
          Js.cd( 'style' , '[jScript-shadow-font-face-support-agent]' , window.document.head ).attr({
            media : 'screen',
            jScript : '',
            'jScript-shadow-font-face-support-agent' : '',
          }).append( cssText );
        }
      }
    };
  });
};

Js.arrObj = {
  objInArr : function( array , key , value ) {
    for (var i = 0; i < array.length; i++) if ( array[ i ][ key ] === value ) return { item : array[ i ] , index : i };
    return null;
  },
};

Js.time = {
  __ : function() {
    var t = new Date(),
        d = t.getDate(),
        m = t.getMonth() + 1,
        y = t.getFullYear(),
        h = t.getHours(),
        i = t.getMinutes(),
        s = t.getSeconds(),
        u = t.getMilliseconds(),
        p = '';
    d = d < 10 ? `0${d}` : d;
    m = m < 10 ? `0${m}` : m;
    i = i < 10 ? `0${i}` : i;
    s = s < 10 ? `0${s}` : s;
    u = u < 100 ? ( u < 10 ? `00${u}` : `0${u}` ) : u;
    p = h < 12 ? 'AM' : 'PM';
    h = h % 12 || 12;
    h = h < 10 ? `0${h}` : h;
    return {
      d:d,
      m:m,
      y:y,
      h:h,
      i:i,
      s:s,
      u:u,
      p:p,
      t:t,
    };
  },
  full : function() {
    var t = this.__();
    return `${t.d}-${t.m}-${t.y} ${t.h}:${t.i}:${t.s} ${t.p}`;
  },
  time : function() {
    var t = this.__();
    return `${t.h}:${t.i} ${t.p}`;
  },
  times : function() {
    var t = this.__();
    return `${t.h}:${t.i}:${t.s} ${t.p}`;
  },
};

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
Js.fun = function( context ) {
  if ( Is.function( context ) ) return context();
  return context;
};

Js.fileUpload = function( input , options ) {
  return new class JScriptFileUpload {
    constructor( input , options ) {
      if ( Is.fileList( input ) ) return this.files( input );
      //this.input = Js( input );
    }
  }( input , options );
};

Js.ajax = function( options ) {
  if ( !window.jQuery ) throw new Error( 'Jquery is not loaded. Use Js.ajaxCall to call jScript ajax function.' );
  if ( !Is.object( options ) ) options = {};
  var opts = {} , o = options;
  opts.url = o.url;
  opts.type = o.type;
  opts.data = o.data;
  opts.dataType = o.dataType;
  opts.before = o.beforeSend || o.before;
  opts.after = o.after;
  opts.server = o.server || o.serverError;
  opts.form = o.form || o.formError;
  opts.error = o.error;
  opts.success = o.success;
  opts.none = opts.none || opts.default;
  opts.fail = o.fail || o.failed;
  opts.complete = o.complete;
  opts.anyways = o.anyways;
  opts.accepts = o.accepts;
  opts.async = o.async;
  opts.cache = o.cache;

  if ( !opts.dataType ) opts.dataType = 'json';
  if ( !opts.before ) opts.before = function() {};
  if ( !opts.after ) opts.after = function() {};
  if ( !opts.success ) opts.success = function() {};
  if ( !opts.fail ) opts.fail = function() {};
  if ( !opts.none ) opts.none = function() {};
  if ( !opts.complete ) opts.complete = function() {};
  if ( !opts.anyways ) opts.anyways = function() {};

  return $.ajax({
    url : opts.url,
    type : opts.type,
    data : opts.data,
    async : opts.async,
    accepts : opts.accepts,
    dataType : opts.dataType,
    cache : o.cache,
    beforeSend : function( xhr , ajax ) {
      opts.before.call( xhr , xhr , ajax );
    },
    complete : function( xhr , status ) {
      opts.complete.call( xhr , xhr , status );
    },
    success : function( data , status , xhr ) {
      if ( data.type === 'success' ) {
        opts.success.call( xhr , data , status , xhr );
      } else if ( data.type === 'error' ) {
        opts.error.call( xhr , data , status , xhr );
        opts.anyways.call( xhr , xhr , status , data.error );
      } else if ( data.type === 'formError' || data.type === 'form' || data.type === 'formerror' ) {
        opts.form.call( xhr , data , status , xhr );
        opts.anyways.call( xhr , xhr , status , data.error );
      } else if ( data.type === 'server' ) {
        opts.server.call( xhr , data , status , xhr );
        opts.anyways.call( xhr , xhr , status , data.error );
      } else {
        opts.none.call( xhr , data , status , xhr );
        opts.anyways.call( xhr , xhr , status , data.error );
      }
      opts.after.call( xhr , data , status , xhr );
    },
    error : function( xhr , status , error ) {
      var text = '';
      if ( status === 'parsererror' ) {
        text = 'Failed to parse data recieved. ';
      } else if ( status === 'timeout' ) {
        text = 'Ajax call closed due to timeout.';
      } else if ( status === 'abort' ) {
        text = 'Ajax call was aborted by user.';
      } else if ( status === 'error' ) {
        switch ( xhr.status ) {
          case 404: text = `Requested page was not found on <a href="${ opts.url }">${ opts.url }</a>.`; break;
          default: text = 'Unknown error occured. Please try again later.';
        }
      }
      opts.fail.call( xhr , text , status , error );
      opts.anyways.call( xhr , xhr , status , error );
    },
  });
};
Js.ajaxCall = function( options ) {
  if ( !Is.object( options ) ) throw new Error( 'Options must be of Object type.' );
  if ( !options.url ) throw new Error( 'Options must contain atleast url parameter.' );
  if ( Is.function( options.before ) && options.before() === false ) return false;
  options.type = options.type ? options.type.toUpperCase() : 'HEAD';
  if ( ![ 'GET' , 'HEAD' , 'POST' , 'PUT' , 'DELETE' , 'CONNECT' , 'OPTIONS' , 'TRACE' , 'PATCH' ].includes( options.type ) ) options.type = 'HEAD';
  if ( Is.object( options.data ) ) options.data = Js.serialize( options.data );
  if ( !Is.string( options.data ) ) options.data = '';
  if ( ![ true , false ].includes( options.async ) ) options.async = true;

  if ( ![ 'application/x-www-form-urlencoded; charset=UTF-8' ].includes( options.contentType ) ) options.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  if ( ![ 'application/json' ].includes( options.accept ) ) options.accept = 'application/json';
  var request = new XMLHttpRequest();
  request.open( options.type , options.url , options.async );
  request.setRequestHeader( 'Content-Type' , options.contentType );
  request.setRequestHeader( 'Accept' , options.accept );


  options.success = options.success || function() {};
  options.failed = options.failed || options.fail || function() {};
  options.formError = options.formError || options.failed;
  options.requestError = options.requestError || options.failed;
  options.complete = options.complete || options.always ||  function() {};
  options.start = options.start ||  function() {};
  options.after = options.after ||  function() {};
  options.error = options.error ||  function() {};

  request.onprogress = options.progress;
  request.onloadstart = options.start;
  request.onloadend = options.after;
  request.onload = function(a,b,c,d) {
    if (this.status >= 200 && this.status < 400) {
      var data = this.response;
      if ( options.accept === 'application/json' ) {
        try {
          data = JSON.parse( data );
        } catch (e) {
          throw new Error(e);
        }
      }
      if ( data.type === 'success' ) {
        options.success.call( this , data , request , this.status );
      } else if ( data.type === 'formerror' ) {
        options.formError.call( this , data , request , this.status );
      } else {
        options.error.call( this , data , request , this.status );
      }
    } else {
      options.failed.call( this , request , this.status , this.statusText );
    }
    options.complete.call( this , request );
  };
  request.onerror = function() {
    options.requestError.call( this , request , this.status , this.statusText )
    options.complete.call( this , request )
  };
  request.send( options.data );
  console.log(request);
};
Js.ajaxChannel = function( url , interval ) {

};


Js.prototype = jScript.prototype;

Js.objectDisplay = function( object , wrap = 1 ) {
  object = Js.cssStyle.toObject( object );
  var string = "";
  for (var key in object) string += ( wrap ? '\'' : '' ) + key + ( wrap ? '\'' : '' ) + ' : \'' + object[ key ] + '\',\n';
  console.log(string);
  return string;
};
Js.definestructure = function() {
  if ( Is.mobile() ) Js( 'html' ).addClass( 'mobile-device' ); else Js( 'html' ).removeClass( 'mobile-device' );
  if ( this.innerWidth <= 425 ) Js( 'html' ).addClass( 'mobile-device-ratio' ); else Js( 'html' ).removeClass( 'mobile-device-ratio' );
};
Js.definestructure();

Js( window ).bind( 'resize' , Js.definestructure );

Js.overflowObserver = [];
Js.overflowObserver.monitered = 0;
Js.overflowObserver.moniterSpeed = 300;
Js.overflowObserver.observer = function() {
  Js.overflowObserver.forEach(( item , i ) => {
    var flowstart = item.flowstart;
    var flowend = item.flowend;
    if ( item.element.scrollWidth > item.element.clientWidth ) {
      if ( Is.function( flowstart ) ) flowstart.call( item.element , item.selector , item.element );
    } else {
      if ( Is.function( flowend ) ) flowend.call( item.element , item.selector , item.element );
    }
  });
  Js.overflowObserver.monitered++;
  if ( Js.overflowObserver.state === 'paused' ) return;
  Js.overflowObserver.monitorEvent = setTimeout( Js.overflowObserver.observer , Js.overflowObserver.moniterSpeed );
};
Js.overflowObserver.resume = function() {
  Js.overflowObserver.state = 'observing';
  Js.overflowObserver.monitorEvent = setTimeout( Js.overflowObserver.observer , Js.overflowObserver.moniterSpeed );
};
Js.overflowObserver.pause = function() {
  Js.overflowObserver.state = 'paused';
  clearTimeout( Js.overflowObserver.monitorEvent );
};
Js.overflowObserver.resume();
