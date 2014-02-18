#update CSS FILE
lessc dev/main.less > jqSelectorWheel.css

#update minified file for:

#simple version
curl -X POST -s --data-urlencode 'input@jquery.jqSelectorWheel.js' http://javascript-minifier.com/raw > jquery.jqSelectorWheel.min.js
echo "Simple version minified successfull";

#lightweight version
curl -X POST -s --data-urlencode 'input@jquery.jqSelectorWheel.Small.js' http://javascript-minifier.com/raw > lightweight-version/jquery.jqSelectorWheel.Small.min.js
echo "Lightweight version minified successfull";

#full version with mousewheel 
curl -X POST -s --data-urlencode 'input@jquery.jqSelectorWheel.Full.js' http://javascript-minifier.com/raw > mousewheel-version/jquery.jqSelectorWheel.Full.min.js
echo "Mousewheel-full version minified successfull";