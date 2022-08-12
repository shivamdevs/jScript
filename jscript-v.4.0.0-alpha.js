
// Projset :: jScript
// Version :: 4.0.0 - MIT License

// Alpha version

(function( name ) {
    name = name || '$';

    const debugMode = true;// Shows error by throwing on console :: For development only
    const debug = function( args ) {
        return debugMode && console.trace( args );
    };

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
                const match = [];
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
        }
        return null;
    };


    // DOM ready manipulator
    // Source :: https://github.com/jfriend00/docReady
    Js.ready = (function() {
        const readyList = [];
        let readyFired = false;
        let readyEventHandlersInstalled = false;
        function ready() {
            if ( !readyFired ) {
                readyFired = true;
                for (let i = 0; i < readyList.length; i++)
                readyList[i].fn.call( window , readyList[i]. ctx );
                readyList = [];
            }
        };
        function readyStateChange() {
            if ( document.readyState === 'complete' )
            ready();
        }
        return function( callback , context ) {
            if ( !Is.function( callback ) ) {
                return Js.debug( 'callback is not a function.' );
            }
            if ( readyFired ) {
                return Js.timeout(() => { callback.call( window , context );  , 1 });
            } else {
                readyList.push({
                    fn: callback,
                    ctx: context
                });
            }
            if ( document.readyState === 'complete' || ( !document.attachEvent && document.readyState === 'interactive' ) ) {
                Js.imeout( ready , 1 );
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

    // Timeout based on scheduler rather than setTimeout
    Js.timeout = function( callback , delay ) {
        callback = Is.function( callback ) ? callback : function() {};
        if ( !Is.number( delay ) ) delay = 0;
        if ( window.scheduler ) scheduler.postTask( callback , { delay : delay } ); else return window.setTimeout( callback , delay );
    };





    // Add DOM element methods using addPrototype
    Js.addPrototype( jScript , {
        ...{// Iterators
            each: function( callback ) {
                if ( !Is.function( callback ) ) return this;
                for (let i = 0; i < this.length; i++)
                callback.call( this[i] , Js( this[i] ) , i , this[i] );
                return this;
            },
            reverse : function() {
                const result = Js();
                for (let i = this.length - 1; i >= 0; i--)
                result.add( this[i] );
                return result;
            },
            then : function( callback ) {
                const result;
                if ( Is.function( callback ) ) result = callback.call( this , this );
                return ( result !== undefined ) ? result : this;
            },
            toArray : function() {
                const result = [];
                this.each(function() {
                    result.push( this );
                });
                return result;
            },
        },
        ...{// Modifiers
            add : function( ...selector ) {
                const root = this;
                if ( selector.length ) {
                    for (let i = 0; i < selector.length; i++) {
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
                const result = Js();
                this.each(function() {
                    const match = this;
                    selector.each(function() {
                        if ( match !== this ) result.add( match );
                    });
                });
                return result;
            },
        },
        ...{// Element Manupluator
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
                    for ( let key in context ) {
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
                    for ( let key in context ) {
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
                            const result = window.getComputedStyle( this[ 0 ] ).getPropertyValue( context );
                            return parseFloat( result ) || result;
                        }
                        return undefined;
                    }
                }
                return this;
            },
            data : function( context , value ) {
                if ( Is.object( context ) ) {
                    for ( let key in context ) {
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
                    for ( let key in context ) {
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
        ...{//Element display
            fadeIn : function( timeout , callback ) {
                if ( Is.function( timeout ) ) {
                    callback = timeout;
                    timeout = undefined;
                }
                if ( !Is.function( callback ) ) callback = function() {};
                this.each(function( item ) {
                    let prestyle = 'block';
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
                        let last = +new Date();
                        const tick = () => {
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
                        let last = +new Date();
                        const tick = () => {
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
        ...{// Children Modifiers
            after : function( ...nodes ) {
                nodes.forEach(( node ) => {
                    this.each(function() {
                        if ( Is.jScript( node ) || Is.jQuery( node ) ) {
                            const temp = this;
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
                const root = this;
                nodes.forEach(( node ) => {
                    this.each(function() {
                        if ( Is.jScript( node ) || Is.jQuery( node ) ) {
                            const temp = this;
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
                            const temp = this;
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
                            const temp = this;
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
        ...{// Contains or Has data
            containAttr : function( attribute ) {
                const result = Js();
                for (let i = 0; i < this.length; i++) if ( this[ i ].hasAttribute( attribute ) ) result.add( this[ i ] );
                return result;
            },
            containClass : function( classes ) {
                const result = Js();
                for (let i = 0; i < this.length; i++) if ( this[ i ].classList.contains( classes ) ) result.add( this[ i ] );
                return result;
            },
            containData : function( data ) {
                const result = Js();
                for (let i = 0; i < this.length; i++) if ( this[ i ].dataset[ data ] ) result.add( this[ i ] );
                return result;
            },
            containProto : function( prototype ) {
                const result = Js();
                for (let i = 0; i < this.length; i++) if ( this[ i ][ prototype ] ) result.add( this[ i ] );
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
                let top = this[ 0 ].offsetTop , left = this[ 0 ].offsetLeft;
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
                const result = Js();
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
                const result = Js();
                this.each(function() {
                    result.add( this.cloneNode( true ) );
                });
                return result;
            },
            closest : function( selector ) {
                const result = Js() , selector = Js( selector ) , found = false;
                outerloop:
                for ( let i = 0; i < this.length; i++ ) {
                    let select = this[ i ];
                    while ( select && !found ) {
                        innerloop:
                        for (let j = 0; j < selector.length; j++) {
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
                const result = Js();
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
                const result = Js();
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
                let index = -1;
                if ( this.length ) {
                    let element = this[ 0 ];
                    index = 0;
                    while ( element = element.previousElementSibling ) index++;
                }
                return index;
            },
            indexOf : function( context ) {
                let index = -1;
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
                if ( this.length ) for (let i = 0; i < selector.length; i++) if ( selector[ i ] === this[ index ] ) return true;
                return false;
            },
            last : function() {
                return Js( ( this && this.length ? this[ this.length - 1 ] : '' ) );
            },
            lastChild : function() {
                return this.children().last();
            },
            match : function() {
                const result = Js();
                this.each(function( item ) {
                    if ( item.is( item ) ) result.add( this );
                });
                return result;
            },
            next : function( element ) {
                const result = Js();
                this.each(function() {
                    const next = element ? this.nextElementSibling : this.nextSibling;
                    if ( next ) result.add( next );
                });
                return result;
            },
            parent : function( context ) {
                const result = Js();
                context = Js( context );
                if ( this.length ) {
                    if ( context.length ) {
                        outerloop:
                        for (let i = 0; i < this.length; i++) {
                            innerloop:
                            for (let j = 0; j < context.length; j++) {
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
                const result = Js();
                this.each(function() {
                    const prev = element ? this.previousElementSibling : this.previousSibling;
                    if ( prev ) result.add( prev );
                });
                return result;
            },
            shadow : function() {
                const result = Js();
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
                        this.event( 'mouseover' );
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
                    const array = Js.arrObj.objInArr( Js.overflowObserver , 'element' , this );
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

    // Add custom functions to jScript function
    Js.addExtension( Js , {

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


    // Set caller for new prototypes
    Js.fn = jScript.prototype;








    window[ name ] = Js;
}( '$' ));
// Make changes here to '$' for redifining value.
