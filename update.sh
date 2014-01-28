#update CSS FILE
lessc dev/main.less > jqSelectorWheel.css

#update minified file
curl -X POST -s --data-urlencode 'input@jquery.SelectorWheel.js' http://javascript-minifier.com/raw > jquery.SelectorWheel.min.js