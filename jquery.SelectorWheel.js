(function($) {
$.fn.SelectorWheel = function(options) {
  var $container = this;
  var $spanblock;

  var settings = $.extend( {
    'value' : $container.attr("value")===undefined ? 0 : parseInt($container.attr("value")),
    'symCount' : $container.attr("length")===undefined ? 3 : parseInt($container.attr("length")),
    'valueFrom'  : $container.attr("valueFrom")===undefined ? 0 : $container.attr("valueFrom"),
    'valueTo'  : $container.attr("valueTo")===undefined ? 999 : $container.attr("valueTo"),
    "changeSign" : false,
    "sensetivity" : 1,
    "capture" : true,
    "eachSymbol" : false
  }, options);

  var Private = {
    value : settings.value,
    sign : 1, //знак операции
    graphics : {

    },
    getSymbolDifference : function(){
      return (settings.symCount - Private.value.toString().length);
    },
    customSymbol : function(x){
      var diff = Private.getSymbolDifference();
      while(diff-- > 0){
        x = "0" + x.toString();
      }
      return x;
    },
    redrawFull : function(value){ 
      value = Private.customSymbol(value);

      for(var i=0;i<settings.symCount;i++){
        symbol = value.toString().charAt(i);      
        $($(".symbol", $container)[i]).html(symbol);
      }
    },
    separateViewCallback : function(event){
      var result = Private.value + event.direction/settings.sensetivity;
      if(result<=settings.valueTo && result>=settings.valueFrom){
        Private.value = result;
        Private.redrawFull(result);
      }else{
        if(result<=settings.valueTo && result<=settings.valueFrom){ //нижняя граница
          Private.value = parseInt(settings.valueFrom);
        }else
        if(result>=settings.valueTo && result>=settings.valueFrom){ //верхняя граница
          Private.value = parseInt(settings.valueTo);
        }
        Private.setMask(Private.value);
      }
      console.log(Private.value)
    },
    viewCallback : function(event){
      var result = ((parseInt(event.value) + event.direction) % 10) < 0 ? 10+((parseInt(event.value) + event.direction) % 10) : ((parseInt(event.value) + event.direction) % 10);
      Private.cells[event.position].value = result;
      var t = 0;
      for(var i=0,l=Private.cells.length;i<l;i++){
        t += Math.pow(10,settings.symCount-i-1)*Private.cells[i].value;
      }
      t *= Private.sign;
      if(t<=settings.valueTo && t>=settings.valueFrom){
        Private.value = Math.abs(t);
        $(this).html(result);
      }else{
        if(t<=settings.valueTo && t<=settings.valueFrom){//нижняя граница
          Private.value = parseInt(settings.valueFrom);
        }else
        if(t>=settings.valueTo && t>=settings.valueFrom){//верхняя граница
          Private.value = parseInt(settings.valueTo);
        }
        Private.setMask(Private.value);
      }
      Private.value *= Private.sign;
      console.log(Private.value) 
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
        $(this).html(Private.stack);
        Private.value *= Private.sign;
        Private.sign = 1;        
        if(Private.stack!=0){
          Private.value += Private.stack*Math.pow(10,settings.symCount-1);
        }
        Private.cells[0].value=Private.stack;
      }else{
        $(this).html("-");
        Private.stack = Private.cells[0].value;
        if(Private.cells[0].value!=0){
          Private.value -= Private.cells[0].value*Math.pow(10,settings.symCount-1);
        }
        Private.cells[0].value=0;
        
        Private.sign = -1;
        Private.value *= Private.sign;
      }
      console.log(Private.value)
    },
    setMask : function(x){
      var drawUp = Private.customSymbol(x);

      for(var i=0;i<settings.symCount;i++){
        $($(".symbol", $container)[i]).html(drawUp.charAt(i));
        if(settings.eachSymbol){Private.cells[i].value=parseInt(drawUp.charAt(i))}
      }
    },
    drawLights : function(key){
      if(key=='-up'){
        $container.append("<div class='shadow shadow-up'></div>");
        Private.graphics.shadowUp = $(".shadow-up", $container);
      }else 
      if(key=='-down'){
        $container.append("<div class='shadow shadow-down'></div>");
        Private.graphics.shadowDown = $(".shadow-down", $container);
      }else{
        Private.positioning();
        $(window).resize(Private.positioning);
      }
    },
    positioning : function(){
        Private.graphics.shadowUp.css("width", $container.width()-1);
        Private.graphics.shadowDown.css("width", $container.width()-1);
        Private.graphics.shadowUp.css("top", $container.position().top-8);
        Private.graphics.shadowDown.css("top", $container.position().top+34);
    }
  }
  

  function init(){
    Private.drawLights("-up");
    $container.append("<div class='spanblock'></div>")
    $spanblock = $(".spanblock", $container); 
    var drawUp = Private.customSymbol(Private.value);

    for(var i=0;i<settings.symCount;i++){
      $spanblock.append("<span class='symbol'>"+drawUp.charAt(i)+"</span>")
    }
      
    if(settings.eachSymbol){ //если к каждому символу надо привязать события
      var position = 0;
      Private.cells = [];
      $(".symbol", $container).each(function(){
        Private.cells.push({object : $(this), value : $(this).html()}) //какая-то избыточная ерунда, хорошо бы избавиться от этого 
        Private.bindEvents($(this), position++);
        $(this).on("mouseScrolled", Private.viewCallback);       
      })
      var rechanger = settings.changeSign ? Private.cells[0].object.on("click", Private.changeToMinus) : undefined;
    }else{ //а это если к контейнеру
      Private.bindEvents($container);
      $container.on("mouseScrolled", Private.separateViewCallback);
    }
    Private.drawLights("-down");
  }

  
  init();
  
  Private.drawLights();  

  //надобно ли вводить этот метод в жквери объект?
  this.getProperty = function(x){
    if(!(typeof Private[x] == 'function')){
      return Private[x]
    }else{
      throw("Error: Requested property is private function. Access denied.")
    }
  }

  return this;
};
})(jQuery);     
