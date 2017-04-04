import 'whatwg-fetch';

class f {
  ajax({
    method = 'get',
    url,
    data,
    contentType = 'application/json; charset=UTF-8',
    headers = {},
    success,
    error
  }) {
    let req = new XMLHttpRequest();
    req.open(method, url, true);

    if (contentType) {
      req.setRequestHeader('Content-Type', contentType);
    }
    for (let key in headers) {
      req.setRequestHeader(key, headers[key]);
    }

    if (typeof success === 'function' && typeof error === 'function') {
        req.onreadystatechange = () => {
          if (req.readyState == 4) {
            if (req.status == 200) {
              success(req.response);
            } else {
              error(req.statusText);
            }
          }
        };
        req.send(data);
    } else {
      return new Promise((resolve, reject) => {
        req.onreadystatechange = () => {
          if (req.readyState == 4) {
            if (req.status == 200) {
              resolve(req.response);
            } else {
              reject(req.statusText);
            }
          }
        };
        req.send(data);
      });
    }
  }

  isPositiveInterger(num) {
    num = parseInt(num);
    return !isNaN(num) && num > 0;
  }

  debounce(f, delay, context) {
    let timer = null;
    let foo = function() {
      let args = arguments;
      if (args[0].target) args[0].persist();

      clearTimeout(timer);
      timer = setTimeout(() => {
        f.apply(context, args);
      }, delay);
    };
    return foo.bind(this);
  }

  //varify if agents and regions satisfy the constrains of the algorithm
  varify(algorithm, agents, regions) {
    switch (algorithm) {
      case 0:
        return true;
      case 3:
        return regions.every((region) => {
          let agentsInRegion = agents.filter((agent) => {
            return region.some((square) => {
              return square.row === agent.row && square.column === agent.column;
            });
          });

          return agentsInRegion.length <= Math.ceil(region.length / 3); 
        });
      case 4:
        return regions.every((region) => {
          let agentsInRegion = agents.filter((agent) => {
            return region.some((square) => {
              return square.row === agent.row && square.column === agent.column;
            });
          });

          let endPositions = region.filter((square) => {
            let possibleNextPositions = region.filter((next) => {
              if (next === square) return false;
              return (next.row === square.row && (next.column + 1 === square.column || next.column - 1 === square.column)) || 
                (next.column === square.column && (next.row + 1 === square.row || next.row - 1 === square.row));
            });
            return possibleNextPositions.length < 2;
          });

          //Check if all agents are at end positions
          let allAtEndPosition = agentsInRegion.every((agent) => {
            return endPositions.some((endPosition) => {
              return endPosition.row === agent.row && endPosition.column === agent.column;
            });
          });
   
          if (endPositions.length < 1) allAtEndPosition = true;

          return agentsInRegion.length <= Math.ceil(region.length / 4) && allAtEndPosition; 
        });
    }
  }
}

const $f = new f();

export {$f};