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
    "type" : "int-10", //наверное имеет смысл, только если eachSymbol повернут на true
    "alphabet" : "[0123456789]", 
    "hiddenInput" : {
      "enabled" : false
    }

  }, options);




  var Public = {
    toType : function(type, value){
      switch(type){
        case 'int':
        return parseInt(value); 
        break;
        case 'string':
        return value.toString();
        break;
      }
    },
    getNextValue : function(val, sum, alphabet){
      var pos = alphabet.indexOf(val.toString());
      var resultPos = (pos+sum) % (alphabet.length-2) < 1 ? (alphabet.length-2) + ((pos+sum) % (alphabet.length-2)) : (pos+sum) % (alphabet.length-2);
      return alphabet.charAt(resultPos);

    },
    getPrivateProperty : function(x){
      if(!(typeof that[x] == 'function')){
        return that[x]
      }else{
        throw("Error: Requested property is that function. Access denied.")
      }
    }

  }

  var that = {
    value : settings.value, 
    sign : 1, //знак операции
    graphics : {}, //пустой объект для графических элементов
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
    },
    viewAll : function(event){
      var result = that.value + event.direction/settings.sensetivity;
      if(result<=settings.valueTo && result>=settings.valueFrom){
        that.value = result;
        that.redrawFull(result);
      }else{
        if(result<=settings.valueTo && result<=settings.valueFrom){ //нижняя граница
          that.value = parseInt(settings.valueFrom);
        }else
        if(result>=settings.valueTo && result>=settings.valueFrom){ //верхняя граница
          that.value = parseInt(settings.valueTo);
        }
        that.setMask(that.value);
      }
      that.hiddenInput.trigger({"type":"change","val":that.value});
      console.log(that.value)
    },
    viewEach : function(event){

      var result = Public.getNextValue(event.value, event.direction, settings.alphabet)
      //var result = ((parseInt(event.value) + event.direction) % 10) < 0 ? 10+((parseInt(event.value) + event.direction) % 10) : ((parseInt(event.value) + event.direction) % 10);
      
      that.cells[event.position].value = result;
      var t = 0;
      for(var i=0,l=that.cells.length;i<l;i++){
        t += Math.pow(10,settings.symCount-i-1)*that.cells[i].value;
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
    drawLights : function(key){
      if(key=='-up'){
        $container.append("<div class='shadow shadow-up'></div>");
        that.graphics.shadowUp = $(".shadow-up", $container);
      }else 
      if(key=='-down'){
        $container.append("<div class='shadow shadow-down'></div>");
        that.graphics.shadowDown = $(".shadow-down", $container);
      }else{
        that.positioning();
        $(window).resize(that.positioning);
      }
    },
    positioning : function(){
        that.graphics.shadowUp.css("width", $container.width()-1);
        that.graphics.shadowDown.css("width", $container.width()-1);
        that.graphics.shadowUp.css("top", $container.position().top-8);
        that.graphics.shadowDown.css("top", $container.position().top+34);
    },
    setHiddenInput : function(id, name){
      $container.after("<input type='hidden' id='"+id+"' name='"+name+"' value='"+that.value+"'>");
      that.hiddenInput = $container.next();
      that.hiddenInput.on("change", function(x){
        that.hiddenInput.attr("value", x.val);
      })
    },
    setAlphabet : function(){
      var alphabet = "[";
      if(settings.type.indexOf("int")==0){

        var index = parseInt(settings.type.substr(-2));
        for(var i=0;i<index;i++){
          alphabet+=i.toString(index);
        }
        alphabet+="]";
        settings.alphabet=alphabet;
        console.log(alphabet);
      }
    }
  }
  


  function init(){
    that.drawLights("-up");
    that.setAlphabet();

    $container.append("<div class='spanblock'></div>")
    $spanblock = $(".spanblock", $container); 
    
    var drawUp = that.customSymbol(that.value);

    for(var i=0;i<settings.symCount;i++){
      $spanblock.append("<span class='symbol'>"+drawUp.charAt(i)+"</span>")
    }
    
    if(settings.eachSymbol){ //если к каждому символу надо привязать события
      var position = 0;
      that.cells = [];
      $(".symbol", $container).each(function(){
        that.cells.push({object : $(this), value : $(this).html()}) //какая-то избыточная ерунда, хорошо бы избавиться от этого 
        that.bindEvents($(this), position++);
        $(this).on("mouseScrolled", that.viewEach);       
      })
      var rechanger = settings.changeSign ? that.cells[0].object.on("click", that.changeToMinus) : undefined;
    }else{ //а это если к контейнеру
      if(settings.type=='int-10'){
        that.bindEvents($container);
        $container.on("mouseScrolled", that.viewAll);
      }else{
        throw("Error: You can't use type='"+settings.type+"' with property eachSymbol='false'\n");
      }
    }
    that.drawLights("-down");

    if(settings.hiddenInput.enabled){
      that.setHiddenInput(settings.hiddenInput.id, settings.hiddenInput.name);
    }
  }

  
  init();
  
  that.drawLights();  

  return this;
};
})(jQuery);     
