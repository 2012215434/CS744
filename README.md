# CS744
## Agent-Patrolling-Visualization
Make sure install node and npm on your machinie before you start the following steps.
<br>
How to install node refer to [https://nodejs.org/en/download/package-manager/] (https://nodejs.org/en/download/package-manager/)
<br>

Clone repository:
```
$ git clone https://github.com/2012215434/CS744.git
```

Navigate to Agent-Patrolling-Visualization directory:
```
$ cd CS744/Agent-Patrolling-Visualization/
```

Install webpack and webpack-dev-server package:
```
$ npm install webpack -g
$ npm install webpack-dev-server -g
```

Install dependencies:
```
$ npm install
```

Bundle resources:
```
$ cd public/
$ webpack
$ cd ..
```

<br>
Start server：
```
$ npm start
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
$ cd public/
$ webpack-dev-server
```
Then open [http://localhost:8080/](http://localhost:8080/).



