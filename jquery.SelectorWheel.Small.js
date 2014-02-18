(function($) {
  $.fn.jqSelectorWheel = function(options) {
    var $container = this, that;
    
    var settings = $.extend({
      'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
      'valueLength' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
      'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
      'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
      "capture" : true,
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