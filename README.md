#Selector Wheel : jQuery Plugin#

##Usage##

Including files into DOM:
	<code>&lt;script src="jquery.SelectorWheel.js"&gt;&lt;/script&gt;</code>
	<code>&lt;link rel="stylesheet" type="text/css" href="jqSelectorWheel.css"&gt;</code>

<pre>
	&lt;div id='myPrettyID' class='SelectorWheel' length='4' valueTo='8888' valueFrom='0' value="666&gt;&lt;/div&gt;
	&lt;script&gt; 
		var jqSelectorWheel = $("#myPrettyID").SelectorWheel({
			//settings JSON
		});
	&lt;/script&gt;	
</pre>

Attributes <code>length</code>, <code>value</code>, <code>valueFrom</code>, <code>valueTo</code>  is not required;

**Settings JSON**
<pre>
|=============|=======================|==========================================|
|  PROPERTY   |  STD VALUE            |      DESCRIPTION                         |
|=============|=======================|==========================================| 
|  value      | 'value' attr or 0     | Initial value of controller              |
|-------------|-----------------------|------------------------------------------|
|  symCount   | 'length' attr or 3    | Count of symbol cells                    |
|-------------|-----------------------|------------------------------------------|
| valueFrom   | 'valueFrom' attr or 0 | Minimal value of controller              |
|-------------|-----------------------|------------------------------------------|
| valueTo     | 'valueTo' attr or 999 | Maximal value of controller              |
|-------------|-----------------------|------------------------------------------|
| changeSign  | false                 | Make value sign opposite by click or not |
|-------------|-----------------------|------------------------------------------|
| sensetivity | 1                     | Value from 0 to 1. Multiplied by scroll  |
|-------------|-----------------------|------------------------------------------|
| capture     | true                  | Capture event for scroll window          |
|-------------|-----------------------|------------------------------------------|
| eachSymbol  | false                 | Make every symbol change independently   |
|-------------|-----------------------|------------------------------------------|


**Listening for events**

1. wheel
2. mousewheel
3. DOMMouseScroll
4. MozMousePixelScroll

1 per 40 px scroll.

</pre>

##Development##
bower files unpacking into bower_components directory; Dependencies is: **jQuery** and **jQuery.mousecheel**.

1. Installing components with **bower** for development: <code>bower instal</code> <br>
2. Updating css with **LESSC**: <code>lessc dev/main.less &gt; jqSelectorWheel.css</code><br>
3. Includeing plugins and packages: <code>&lt;script src="/bower_components/jquery/index.js"&gt;</script></code><br>
