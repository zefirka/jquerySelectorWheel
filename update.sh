#update CSS FILE
lessc dev/main.less > jqSelectorWheel.css

#update minified file
curl -X POST -s --data-urlencode 'input@jquery.SelectorWheel.js' http://javascript-minifier.com/raw > jquery.SelectorWheel.min.js
curl -X POST -s --data-urlencode 'input@jquery.SelectorWheel.Small.js' http://javascript-minifier.com/raw > jquery.SelectorWheel.Small.min.js