(function($) {
  $.fn.SelectorWheel = function(options) {
    var $container = this;
    var $spanblock;
    var settings = $.extend({
      'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
      'symCount' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
      'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
      'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
      "changeSign" : false,
      "sensetivity" : 1,
      "capture" : true,
      "eachSymbol" : true ,
      "type" : "int-10",
      "alphabet" : "abcdefghijklmnopqrstuvwxyz", 
      "hiddenInput" : {
        "enabled" : false
      }
    }, options);


    var Public = {
      getValueFromLetter : function(x){
        if(that.alphabet.indexOf(x)>=0){
          return that.alphabet.indexOf(x);
        }else{
          return -1;
        }
      },
      getNextValue : function(val, sum, alphabet){
        var pos = alphabet.indexOf(val.toString());
        var resultPos = (pos+sum) % alphabet.length < 0 ? alphabet.length+(pos+sum) : (pos+sum) % alphabet.length;
        return alphabet.charAt(resultPos);
      },
      getNextLetter : function(currentLetterPosition, dir){
        var a = that.alphabet, l = a.length, n = currentLetterPosition+dir;
        if(n<0){
          return a.charAt(l+n);
        }else
        if(n==0){
          return a.charAt(0);
        }else{
          return a.charAt(n%l);
        }       
      },
      cells : []
    }

    var that = {
      value : settings.value, 
      valueType : settings.type,
      alphabet : settings.alphabet,
      base : settings.alphabet.length-2,
      sign : 1,
      getSymbolDifference : function(base){
        return (settings.symCount - that.value.toString(base).length);
      },
      customSymbol : function(x){
        var diff = that.getSymbolDifference(that.base);
        x=x.toString(that.base); 
        while(diff-- > 0){
          x = "0" + x;
        }
        return x;
      },    
      changeSign : function(){ //готово
        if(that.sign<0){
          $(this).html(that.stack);
          that.value *= that.sign;
          if(that.stack!=0)
             that.value += that.stack*Math.pow(that.base,settings.symCount-1);
        }else{
          $(this).html("-");
          that.stack = parseInt(Public.cells[0]);
          if(that.stack)
             that.value -= that.stack*Math.pow(that.base,settings.symCount-1);
          Public.cells[0] = 0;
        }
      
      that.sign *= -1;  
      that.value *= that.sign;

      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
      console.log(that.value)
      },
      setMask : function(x){
        var drawUp = that.customSymbol(parseInt(x, that.base));

        for(var i=0;i<settings.symCount;i++){
          $($(".symbol", $container)[i]).html(drawUp.charAt(i));
          if(settings.eachSymbol){
            Public.cells[i]=parseInt(drawUp.charAt(i))
            }
        }
      },
      setHiddenInput : function(id, name){
        $container.after("<input type='hidden' id='"+id+"' name='"+name+"' value='"+that.value+"'>");
        that.hiddenInput = $container.next();
        that.hiddenInput.on("change", function(x){
          that.hiddenInput.attr("value", x.val);
        })
      },
      configure : function(){
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
          console.log(alphabet);
        }else{
          that.alphabet = settings.alphabet;
          if(settings.type!=='string')
            throw("Invalid value type: " + settings.type);
        }
      },
      optionsCheck : function(){
        if(settings.value.length > settings.symCount)
          throw("Initial value's symbol lenght is more than symbols count");
        
        if(settings.eachSymbol){
          if(settings.changeSign && that.valueType!='int'){
            throw("You can't use option changeSign with non-integer value type");
          }else 
          if(settings.changeSign && that.min>=0){
            throw("You can't use options changeSign with option valueFrom that less than zero (there is no point to do it)");
          }
        }else{
          if(that.valueType!='int')
            throw("You can't use options eachSymbol=false with type that is not integer");
        }
      }
    }
  
    // all visual 
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
        $spanblock = $(".spanblock", $container); 
        var drawUp = that.customSymbol(that.value);
        for(var i=0;i<settings.symCount;i++){
          $spanblock.append("<span class='symbol'>"+drawUp.charAt(i)+"</span>")
        }

        visual.drawShadow("-down"); //отрисовываем тень снизу
        visual.drawShadow(); //прицепляем хэндлеры для resize()
      }
    }

    that.scrollOneInt = function(currentCell, currentValue, position, direction){
        var currentSymbol = Public.getNextValue(currentValue, direction, that.alphabet);
        var full = 0, min = that.min, max = that.max;
        Public.cells[position-1] = Public.getValueFromLetter(currentSymbol);      
        
        for(var i=0,l=Public.cells.length;i<l;i++)
          full += Math.pow(that.base,settings.symCount-i-1)*Public.cells[i];
        
        full *= that.sign;
        
        if(full<=max && full>=min){
          that.value = full;
          currentCell.html(currentSymbol);
        }else{
          if(full<=min){//lower edge
            that.value = min;          
          }else
          if(full>=max){//upper edge
            that.value = max;          
          }
          that.setMask(that.value.toString(that.base));
        }
        
        var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
        
        console.log(that.value);
    }
    that.scrollAll = function(e){
        var result = that.value + e.deltaY*settings.sensetivity;
        var min = that.min, max = that.max;

        if(result<=max && result>=min){
          that.value = result;
        }else{
          if(result<=min){//lower edge
            that.value = min;          
          }else
          if(result>=max){//upper edge
            that.value = max;          
          }
        }
        that.setMask(that.value.toString(that.base));
        var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
        console.log(that.value)  
    }
    
    
    that.scrollNextLetter = function(cell, direction){
      var currentLetter = cell.html();
      cell.html(Public.getNextLetter(Public.getValueFromLetter(currentLetter),direction,that.alphabet));
      var res = "";
      $(".symbol", $container).each(function(){
        res += $(this).html()
      })
      that.value = res;
      var hidden = settings.hiddenInput.enabled ? that.hiddenInput.trigger({"type":"change","val":that.value}) : null;
      console.log(that.value)
    }
    
    function init(){
      function bindEventsEachSymbol(cell, position){
        return function(e){
           var direction = e.deltaY;
           that.scrollOneInt(cell, cell.html(), position, direction);
        }
      }
      
      visual.prepare(); 
      that.configure();
      that.optionsCheck();
    
      if(settings.eachSymbol){ // if each symbol is active
      
        if(that.valueType=='int'){
          var position = 0;
          $(".symbol", $container).each(function(){
            var direction = 0, cell = $(this);
            Public.cells[position++]=parseInt(cell.html());
            $(this).on("mousewheel", bindEventsEachSymbol(cell,position));
          })
          var signChanger = settings.changeSign ? $($(".symbol", $container)[0]).on("click", that.changeSign) : undefined;
        }else{
          $(".symbol", $container).each(function(){
            var direction = 0, cell = $(this);
            $(this).on("mousewheel", function(e){
              that.scrollNextLetter(cell, e.deltaY);
            })
          })
 
        }        
      }else{ // if all container is active
        $container.on("mousewheel", that.scrollAll);     
      }

      var hiddenInput = settings.hiddenInput.enabled ? that.setHiddenInput(settings.hiddenInput.id, settings.hiddenInput.name) : null      
    }

    init();
    return this;

  };
})(jQuery);     