(function($) {
  $.fn.jqSelectorWheel = function(options) {
    var $container = this;
    
    var settings = $.extend({
      'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
      'valueLength' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
      'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
      'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
      "changeSign" : false,
      "sensetivity" : 1,
      "scrollBlock" : true,
      "eachSymbol" : true ,
      "type" : "int-10",
      "alphabet" : "0123456789", 
      "hiddenInput" : {
        "enabled" : false
      }
    }, options);
   
    this.getValueFromLetter = function(x,a){
      return ((a.indexOf(x)>=0) ? a.indexOf(x): -1);
    };

    this.getNextValue = function(val, sum, alphabet){
      var pos = alphabet.indexOf(val.toString());
      var resultPos = (pos+sum) % alphabet.length < 0 ? alphabet.length+(pos+sum) : (pos+sum) % alphabet.length;
      return alphabet.charAt(resultPos);
    };

    this.getNextLetter = function(currentLetterPosition, dir){
      var a = that.alphabet, l = a.length, n = currentLetterPosition+dir;
      return ((n<0) ? a.charAt(l+n) : a.charAt(n%l))
    };

    this.optionsCheck = function(){
      if(settings.value.length > settings.valueLength)
        throw("Error: Initial value's symbol lenght is more than symbols count");
      
      if(settings.eachSymbol){
        if(settings.changeSign && that.valueType!='int'){
          throw("Error: You can't use option changeSign with non-integer value type");
        }else 
        if(settings.changeSign && that.min>=0){
          throw("Error: You can't use options changeSign with option valueFrom that less than zero (there is no point to do it)");
        }
      }else{
        if(that.valueType!='int')
          throw("Error: You can't use options eachSymbol=false with type that is not integer");
      }
    }

    this.cells = [];

    var that = {
      value : settings.value, 
      valueType : settings.type,
      alphabet : settings.alphabet,
      base : settings.alphabet.length,
      sign : 1 }

    that.getSymbolDifference = function(base){return (settings.valueLength - that.value.toString(base).length)}
    that.customSymbol = function(x){
      var diff = that.getSymbolDifference(that.base);
      x=x.toString(that.base); 
      while(diff-- > 0){
        x = "0" + x;
      }
      return x;
    }
    that.changeSign = function(){ //готово
      if(that.sign<0){
        $(this).html(that.stack);
        that.value *= that.sign;
        if(that.stack!=0)
           that.value += that.stack*Math.pow(that.base,settings.valueLength-1);
      }else{
        $(this).html("-");
        that.stack = parseInt($container.cells[0]);
        if(that.stack)
           that.value -= that.stack*Math.pow(that.base,settings.valueLength-1);
        $container.cells[0] = 0;
      }
    
      that.sign *= -1;  
      that.value *= that.sign;

      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
    }
    
    that.setMask = function(x){
      var drawUp = that.customSymbol(parseInt(x, that.base));
      for(var i=0;i<settings.valueLength;i++){
        $($(".symbol", $container)[i]).html(drawUp.charAt(i));
        if(settings.eachSymbol){
          $container.cells[i]=parseInt(drawUp.charAt(i));
        }
      }
    }

    that.setHiddenInput = function(id, name){
      $container.after("<input type='hidden' id='"+id+"' name='"+name+"' value='"+that.value+"'>");
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

    that.configure = function(){
      var alphabet = '';
      if(settings.type.indexOf("int")==0){
        var index = parseInt(settings.type.substr(-2));
        for(var i=0;i<index;i++){
          alphabet+=i.toString(index);
        }
        that.valueType = 'int';
        that.alphabet=alphabet;
        that.base = that.alphabet.length;
        that.min = parseInt(settings.valueFrom, that.base);
        that.max = parseInt(settings.valueTo, that.base)
      }else{
        that.alphabet = settings.alphabet;
        if(settings.type!=='string')
          throw("Invalid value type: " + settings.type);
      }
    }

    that.bindEventsEachSymbol = function(cell, position){
      return function(e){
         that.scrollOneInt(cell, cell.html(), position, e.deltaY);
      }
    }

    that.scrollOneInt = function(currentCell, currentValue, position, direction){
      var currentSymbol = $container.getNextValue(currentValue, direction, that.alphabet);
      var full = 0, min = that.min, max = that.max;
      $container.cells[position-1] = $container.getValueFromLetter(currentSymbol,that.alphabet);      
      
      for(var i=0,l=$container.cells.length;i<l;i++)
        full += Math.pow(that.base,settings.valueLength-i-1)*$container.cells[i];
      
      full *= that.sign;
      
      if(full<=max && full>=min){
        that.value = full;
        currentCell.html(currentSymbol);
      }else{
        that.value = full<=min ? min : max;
        that.setMask(that.value.toString(that.base));
      }
      
      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
    }

    that.scrollAll = function(e){
      var result = that.value + e.deltaY*settings.sensetivity;
      var min = that.min, max = that.max;

      if(result<=max && result>=min){
        that.value = result;
      }else{
        that.value = full<=min ? min : max;
      }
      that.setMask(that.value.toString(that.base));
      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;  
    }    
    
    that.scrollNextLetter = function(cell, direction){
      var currentLetter = cell.html();
      cell.html($container.getNextLetter($container.getValueFromLetter(currentLetter,that.alphabet),direction,that.alphabet));
      var res = "";
      $(".symbol", $container).each(function(){
        res += $(this).html()
      })
      that.value = res;
      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
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
        var drawUp = that.customSymbol(that.value);
        for(var i=0;i<settings.valueLength;i++)
          $spanblock.append("<span class='symbol'>"+drawUp.charAt(i)+"</span>")

        visual.drawShadow("-down"); //отрисовываем тень снизу
        visual.drawShadow(); //прицепляем хэндлеры для resize()
      }
    }
    
    function init(){      
      visual.prepare(); 
      that.configure();
      $container.optionsCheck();    

      if(settings.eachSymbol){ // if each symbol is active
        if(that.valueType=='int'){
          var position = 0;
          $(".symbol", $container).each(function(){
            var direction = 0, cell = $(this);
            $container.cells[position++]=parseInt(cell.html());
            $(this).on("mousewheel", that.bindEventsEachSymbol(cell,position));
          })
          var signChanger = settings.changeSign ? $($(".symbol", $container)[0]).on("click", that.changeSign) : undefined;
        }else{
          $(".symbol", $container).each(function(){
            var direction = 0, cell = $(this);
            $(this).on("mousewheel", function(e){
              that.scrollNextLetter(cell, e.deltaY);
            });
          })
        }        
      }else{ // if all container is active
        $container.on("mousewheel", that.scrollAll);     
      }

      var scollBlock = settings.scrollBlock ? that.setScrollBlock() : null;
      var hiddenInput = settings.hiddenInput.enabled ? that.setHiddenInput(settings.hiddenInput.id, settings.hiddenInput.name) : null      
    }

    init();
    return this;
  };
})(jQuery);  