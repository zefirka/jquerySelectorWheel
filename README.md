#Selector Wheel : jQuery Plugin#

##Usage##

Including files into DOM:<br>
<pre>
	&lt;script src="jquery.SelectorWheel.js"&gt;&lt;/script&gt;
	&lt;link rel="stylesheet" type="text/css" href="jqSelectorWheel.css"&gt;
</pre>
<pre>
	&lt;div id='myPrettyID' class='SelectorWheel' 
							length='4' 
							valueTo='8888' 
							valueFrom='0' 
							value="666&gt;&lt;/div&gt;
	&lt;script&gt; 
		var jqSelectorWheel = $("#myPrettyID").SelectorWheel({
			//settings JSON
		});
	&lt;/script&gt;	
</pre>

Attributes <code>length</code>, <code>value</code>, <code>valueFrom</code>, <code>valueTo</code>  is not required; You can set up these in settings json.

**Settings JSON**
<pre>
|=============|=======================|===========================================|
|  PROPERTY   |  STD VALUE            |      DESCRIPTION                          |
|=============|=======================|===========================================| 
| value       | 'value' attr or 0     | Initial value of controller               |
|-------------|-----------------------|-------------------------------------------|
| symCount    | 'length' attr or 3    | Count of symbol cells                     |
|-------------|-----------------------|-------------------------------------------|
| valueFrom   | 'valueFrom' attr or 0 | Minimal value of controller               |
|-------------|-----------------------|-------------------------------------------|
| valueTo     | 'valueTo' attr or 999 | Maximal value of controller               |
|-------------|-----------------------|-------------------------------------------|
| changeSign  | false                 | Make value sign opposite by click or not  |
|-------------|-----------------------|-------------------------------------------|
| sensetivity | 1                     | Value from 0 to 1. Multiplied by scroll   |
|-------------|-----------------------|-------------------------------------------|
| capture     | true                  | Capture event for scroll window           |
|-------------|-----------------------|-------------------------------------------|
| eachSymbol  | true                  | Make every symbol change independently    |
|-------------|-----------------------|-------------------------------------------|
</pre>

**Hidden input**
If you want use hidden input to collect value of wheel selector control - switch hiddenInput.enabled value to true and set up hiddenInput.id and hiddenInput.name for your input. Value of input will update automaticaly. 
<pre>
|-------------|-----------------------|-------------------------------------------|
| hiddenInput | Object{}              | Hidden input to collect values            |
|-------------|-----------------------|-------------------------------------------|
| * enabled   | false                 | Enable hidden input or not                |
|-------------|-----------------------|-------------------------------------------|
| * id        | undefined             | 'ID' attribute of hidden input            |
|-------------|-----------------------|-------------------------------------------|
| * name      | undefined             | 'name' attribute of hidden input          |
|-------------|-----------------------|-------------------------------------------|
</pre>

**Custom alphabet**
To customize alphabet and symbol order use next two properties in **settings.json**:

1. <code>type</code>  - Sets input value data type. By default type is <code>'int-10'</code>, where last 2 digit says about value's base. 10 is decimal, 16 is hexadecimal etc. You can use all 2 digital bases from 02 (binar) to 36. Also you can use type <code>'string'</code>. If you use string valut type that means that you cant switch option eachSymbol to false. And you must set up your custom alphabet for string.
2. <code>alphabet</code> - Sets alphabet's order and symbols. For example for 'int-16' type, alphabet is '0132456789abcdef'. For integer types alphabet calculates automaticaly. For string type - alphabet sets up by designer.

**Listening for events**

1. wheel
2. mousewheel
3. DOMMouseScroll
4. MozMousePixelScroll

1 per 40 px scroll.

##Lightweight version##
There is available light weight version of plugin 2.5 KB - minimized, that equivalent for regular version of plugin with options : <code>eachSymbol = true, type = 'int-10', changeSign = false</code><br>

##Development##
bower files unpacking into bower_components directory; Dependencies is: **jQuery** and **jQuery.mousecheel**.

1. Installing components with **bower** for development: <code>bower instal</code> <br>
2. Updating css with **LESSC**: <code>lessc dev/main.less &gt; jqSelectorWheel.css</code><br>
3. Includeing plugins and packages: <code>&lt;script src="/bower_components/jquery/index.js"&gt;</script></code><br>
