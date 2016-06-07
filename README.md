# Chakula Frontend
This is the client-side web application for Chakula. It is built in Javascript using React and React-router.

# Compilation
You will need [Browserify](http://browserify.org/) and [Less](http://lesscss.org/) to compile the app. 
Enter the repo and execute the following commands:

```
browserify -d -t reactify js/src/app.js -o js/build/app.js

lessc css/src/app.less > css/build/app.css
```
