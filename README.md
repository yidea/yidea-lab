## Dev

Run it from Intellij IDEA nodejs server or nodemon web.js in terminal on http://localhost:5000
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
Heroku Repo: git@heroku.com:yidea-lab.git
git push heroku master
or git push all

```
git remote add heroku git@heroku.com:yidea-lab.git
git push heroku master
git remote add github git@github.com:yidea/yidea-lab.git
git push github master

//.git/config add, git push all to push to both repo
[remote "all"]
    url = git@github.com:yidea/yidea-lab.git
    url = git@heroku.com:yidea-lab.git

//Ensure 1 dyno running web process
heroku ps:scale web=1

//Check dyno status/logs
heroku ps
heroku logs

//visit app via browser
heroku open
```

## Links

* [Html2JSArray](http://localhost:8090/html2jsarray)
* [JsonUtil](http://localhost:8090/jsonUtil)
