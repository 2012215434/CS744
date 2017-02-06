# CS744
## Agent-Patrolling-Visualization
Make sure install node and npm on your machinie before you start the following steps.
How to install node refer to [https://nodejs.org/en/download/package-manager/] (https://nodejs.org/en/download/package-manager/)
```
$ cd CS744/Agent-Patrolling-Visualization/
$ npm install webpack -g
$ npm install webpack-dev-server -g
```
```
$ npm install
```

Bundle resources:
```
$ cd public/
$ webpack
```


<br>
Start server：
```
npm start
```

if you are runing this app on remote linux system:
```
$ nohup npm start &
```
you can close your terminal but keep the app still running on the server.

<br>
Then you can open [http://localhost:3000/](http://localhost:3000/).

<br>
---
<br>
Optional: 

Start webpack server: (runing at port 8080)
```
//In public/ directory
webpack-dev-server
```
Then open [http://localhost:8080/](http://localhost:8080/).



