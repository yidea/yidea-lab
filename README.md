## Dev

run it from Intellij IDEA or nodemon web.js in terminal on http://localhost:8090
livereload

## Heroku

* Procfile
Run Procfile on local w foreman
```
foreman start
```
* package.json
Node.js dependency libraries (express)

* web.js
Node.js server

* Deploy Heroku

```
git push heroku master
//Ensure 1 dyno running web process
heroku ps:scale web=1

```

## Links

* [Html2JSArray](http://localhost:8090/html2jsarray)
* [JsonUtil](http://localhost:8090/jsonUtil)
