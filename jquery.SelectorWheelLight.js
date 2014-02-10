(function($) {
$.fn.SelectorWheel = function(options) {
  var $container = this;
  var $spanblock;

  var settings = $.extend({
    'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
    'symCount' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
    'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
    'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
    "capture" : true,
    "hiddenInput" : {
      "enabled" : false
    }
  }, options);


  var that = {
    value : settings.value, 
    sign : 1, //знак операции
    getSymbolDifference : function(){
      return (settings.symCount - that.value.toString().length);
    },
    customSymbol : function(x){
      var diff = that.getSymbolDifference();
      x=x.toString(); 
      while(diff-- > 0){
        x = "0" + x;
      }
      return x;
    },    
    redrawFull : function(value){ 
      value = that.customSymbol(value);

      for(var i=0;i<settings.symCount;i++){
        symbol = value.charAt(i);      
        $($(".symbol", $container)[i]).html(symbol);
      }
    }
    viewEach : function(event){
      var result = Public.getNextValue(event.value, event.direction, that.alphabet);
      that.cells[event.position].value = Public.getValueFromLetter(result);

      
      var t = 0;
      for(var i=0,l=that.cells.length;i<l;i++){
        t += Math.pow(that.alphabetLength,settings.symCount-i-1)*that.cells[i].value;
      }
      t *= that.sign;
      if(t<=settings.valueTo && t>=settings.valueFrom){
        that.value = Math.abs(t);
        $(this).html(result);
      }else{
        if(t<=settings.valueTo && t<=settings.valueFrom){//нижняя граница
          that.value = parseInt(settings.valueFrom);
        }else
        if(t>=settings.valueTo && t>=settings.valueFrom){//верхняя граница
          that.value = parseInt(settings.valueTo);
        }
        that.setMask(that.value);
      }
      that.value *= that.sign;

      that.hiddenInput.trigger({"type":"change","val":that.value});
      console.log(that.value) 
    },
    bindEvents: function(object, position){
      object.on("mousewheel", function(scroll){
        object.trigger({
          type : "mouseScrolled",
          direction : scroll.deltaY,
          value : $(this).html(),
          position : position
        });
      })  
    },
    changeToMinus : function(){ //готово
      if(settings.valueFrom>=0){
         throw ("Error: You can't decrease value less then zero");
         return 0;
      }
      if($(this).html()=="-"){
        $(this).html(that.stack);
        that.value *= that.sign;
        that.sign = 1;        
        if(that.stack!=0){
          that.value += that.stack*Math.pow(10,settings.symCount-1);
        }
        that.cells[0].value=that.stack;
      }else{
        $(this).html("-");
        that.stack = that.cells[0].value;
        if(that.cells[0].value!=0){
          that.value -= that.cells[0].value*Math.pow(10,settings.symCount-1);
        }
        that.cells[0].value=0;
        
        that.sign = -1;
        that.value *= that.sign;
      }
      that.hiddenInput.trigger({"type":"change","val":that.value});
      console.log(that.value)
    },
    setMask : function(x){
      var drawUp = that.customSymbol(x);

      for(var i=0;i<settings.symCount;i++){
        $($(".symbol", $container)[i]).html(drawUp.charAt(i));
        if(settings.eachSymbol){that.cells[i].value=parseInt(drawUp.charAt(i))}
      }
    },
    setHiddenInput : function(id, name){
      $container.after("<input type='hidden' id='"+id+"' name='"+name+"' value='"+that.value+"'>");
      that.hiddenInput = $container.next();
      that.hiddenInput.on("change", function(x){
        that.hiddenInput.attr("value", x.val);
      })
    }
  }
  
  //все графические движняки
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


  function init(){
    visual.prepare(); 
    that.configureAlphabet();
    
    var position = 0;
    that.cells = [];
    $(".symbol", $container).each(function(){
      that.cells.push({object : $(this), value : $(this).html()}) //какая-то избыточная ерунда, хорошо бы избавиться от этого 
      that.bindEvents($(this), position++);
      $(this).on("mouseScrolled", that.viewEach);       
    })
    var rechanger = settings.changeSign ? that.cells[0].object.on("click", that.changeToMinus) : undefined;
 
    //подкючает hidden input
    if(settings.hiddenInput.enabled){
      that.setHiddenInput(settings.hiddenInput.id, settings.hiddenInput.name);
    }
  }

  init();
  return this;

};
})(jQuery);     