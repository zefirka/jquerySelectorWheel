/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 * Version: 3.1.9
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function ($) {
    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);},
        getPageHeight: function(elem) {return $(elem).height();},

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        
        delta = deltaY === 0 ? deltaX : deltaY;

        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        
        if ( deltaY === 0 && deltaX === 0 ) { return; }


        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            delta  /= 40;
            deltaY /= 40;
        }

        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        event.deltaY = deltaY;
        
        args.unshift(event, delta, deltaX, deltaY);

        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
    function nullLowestDelta() {
        lowestDelta = null;
    }
    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }
}));

(function($) {
  $.fn.jqSelectorWheel = function(options) {
    var $container = this, that;
    
    var settings = $.extend({
      'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
      'valueLength' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
      'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
      'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
      "hiddenInput" : {
        "enabled" : false
      }
    }, options);
   
    this.getNextValue = function(val, dir){
      val = parseInt(val);
      return (val+dir>=0) ? (val+dir)%10 : 9;      
    };

    this.cells = [];
    this.min = parseInt(settings.valueFrom);
    this.max = parseInt(settings.valueTo);
    this.value = settings.value;
    
    that.customSymbol = function(x){
      var diff = settings.valueLength - $container.value.toString().length;
      x=x.toString(); 
      while(diff-- > 0){
        x = "0" + x;
      }
      return x;
    }
    
    that.setMask = function(x){
      var drawUp = that.customSymbol(parseInt(x));
      for(var i=0;i<settings.valueLength;i++){
        $($(".symbol", $container)[i]).html(drawUp.charAt(i));
        $container.cells[i]=parseInt(drawUp.charAt(i));
      }
    }

    that.setHiddenInput = function(id, name){
      $container.after("<input type='hidden' id='"+id+"' name='"+name+"' value='"+$container.value+"'>");
      that.hiddenInput = $container.next();
      that.hiddenInput.on("change", function(x){
        that.hiddenInput.attr("value", x.val);
      })
    }
    
    that.setScrollBlock = function(){
      $('body').on({
        'mousewheel': function(e) {
          if(e.target.parentNode.parentNode.id == $container[0].id){
            e.preventDefault();
            e.stopPropagation();
          }
      }});
    }

    that.bindEventsEachSymbol = function(cell, position){
      return function(e){
         that.scrollOneInt(cell, cell.html(), position, e.deltaY);
      }
    }

    that.scrollOneInt = function(currentCell, currentValue, position, direction){
      var currentSymbol = $container.getNextValue(currentValue, direction);
      var full = 0, min = $container.min, max = $container.max;
      $container.cells[position-1] = currentSymbol;      
      
      for(var i=0,l=$container.cells.length;i<l;i++)
        full += Math.pow(10,settings.valueLength-i-1)*$container.cells[i];
      
      if(full<=max && full>=min){
        $container.value = full;
        currentCell.html(currentSymbol);
      }else{
        $container.value = full<=min ? min : max;
        that.setMask($container.value.toString());
      }
      
      that.setScrollBlock();
      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":$container.value}) : null;
    }
  
    // all visual contain is here
    var visual = {
      graphics : {},
      drawShadow : function(key){
        if(key=='-up'){
          $container.append("<div class='shadow shadow-up'></div>");
          visual.graphics.shadowUp = $(".shadow-up", $container);
        }else 
        if(key=='-down'){
          $container.append("<div class='shadow shadow-down'></div>");
          visual.graphics.shadowDown = $(".shadow-down", $container);
        }else{
          visual.positioning();
          $(window).resize(visual.positioning);
        }
      },
      positioning : function(){
        visual.graphics.shadowUp.css("width", $container.width()-1);
        visual.graphics.shadowUp.css("top", $container.position().top-8);
        visual.graphics.shadowDown.css("width", $container.width()-1);
        visual.graphics.shadowDown.css("top", $container.position().top+34);
      },
      prepare : function(){
        visual.drawShadow("-up"); //отрисовываем тень сверзху
      
        $container.append("<div class='spanblock'></div>"); //добавляем элементы и отрисовываем нужное кол-во
        var $spanblock = $(".spanblock", $container); 
        var drawUp = that.customSymbol($container.value);
        for(var i=0;i<settings.valueLength;i++)
          $spanblock.append("<span class='symbol'>"+drawUp.charAt(i)+"</span>")

        visual.drawShadow("-down"); //отрисовываем тень снизу
        visual.drawShadow(); //прицепляем хэндлеры для resize()
      }
    }
    
    function init(){      
      visual.prepare();    
      var position = 0;
      $(".symbol", $container).each(function(){
        var direction = 0, cell = $(this);
        $container.cells[position++]=parseInt(cell.html());
        $(this).on("mousewheel", that.bindEventsEachSymbol(cell,position));
      })  
      var hiddenInput = settings.hiddenInput.enabled ? that.setHiddenInput(settings.hiddenInput.id, settings.hiddenInput.name) : null      
    }

    init();
    return this;
  };
})(jQuery);     