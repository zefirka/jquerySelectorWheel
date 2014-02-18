#jqSelectorWheel : jQuery Plugin#

jqSelectorWheel is a simple jQuery plugin which provides behavior of wheel symbol selector. <a href="http://zefirka.github.io/jquerySelectorWheel">Homepage</a>

##Usage##
Including files into DOM:<br>
<pre>
	&lt;script src="jquery.SelectorWheel.js"&gt;&lt;/script&gt;
	&lt;link rel="stylesheet" type="text/css" href="jqSelectorWheel.css"&gt;
</pre>
How to attach plugin to element:<br>
<pre>
	&lt;div id='myPrettyID' class='jqSelectorWheel' 
							length='4' 
							valueTo='8888' 
							valueFrom='0' 
							value="666&gt;&lt;/div&gt;
	&lt;script&gt; 
		var jqSelectorWheel = $("#myPrettyID").jqSelectorWheel({
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
| valueLength | 'length' attr or 3    | Count of symbol cells                     |
|-------------|-----------------------|-------------------------------------------|
| valueFrom   | 'valueFrom' attr or 0 | Minimal value of controller               |
|-------------|-----------------------|-------------------------------------------|
| valueTo     | 'valueTo' attr or 999 | Maximal value of controller               |
|-------------|-----------------------|-------------------------------------------|
| changeSign  | false                 | Make value sign opposite by click or not  |
|-------------|-----------------------|-------------------------------------------|
| sensetivity | 1                     | Value from 0 to 1. Multiplied by scroll   |
|-------------|-----------------------|-------------------------------------------|
| scrollBlock | true                  | Prevents event for scroll window          |
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

1. <code>type</code>  - Sets value's datatype. By default type is <code>'int-10'</code> (it means that value's datatype is integer and last 2 digit says about value's base - 10 is decimal, 16 is hexadecimal etc). You can use all 2 digital bases from 02 (binar) to 36 (0-9a-z). Also you can use type <code>'string'</code>. If you use string value type that means that you can't switch option <code>eachSymbol</code> to false. And you must set up your custom alphabet for string type.
2. <code>alphabet</code> - Sets order and symbols for alphabet. For example for 'int-16' type, alphabet is '0132456789abcdef'. For integer types alphabet calculates automaticaly. For string type - alphabet sets up by designer. Example: <code>alphabet:"abc"</code> means that user can turn wheel between 3 values "a", "b", "c".

**Listening for events**

1. wheel
2. mousewheel
3. DOMMouseScroll
4. MozMousePixelScroll

1 per 40 px scroll.

##Lightweight version##
There is available light weight version of plugin 2.5 KB - minimized, that equivalent for regular version of plugin with options : <code>eachSymbol: true</code>, <code>type: 'int-10'</code>, <code>changeSign: false</code>, <code>scrollBlock: true </code><br>

##Development##
bower files unpacking into bower_components directory; Dependencies is: **jQuery** and **jQuery.mousecheel**.

1. Installing components with **bower** for development: <code>bower instal</code> <br>
2. Updating css with **LESSC**: <code>lessc dev/main.less &gt; jqSelectorWheel.css</code><br>
3. Including plugins and packages: <code>&lt;script src="/bower_components/jquery/index.js"&gt;</script></code><br>
