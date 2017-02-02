import 'whatwg-fetch';

class f{
  ajax (obj){
    if(!obj.headers) obj.headers = {'Content-type': 'application/json; charset=UTF-8'};
    if(obj.body) obj.body = JSON.stringify(obj.body);
    var status;
    fetch(obj.url, obj)
    .then((res) => {
      if(res.ok) {
        return res.json();
      }
      throw new Error(res.status);
    })
    .then((resJson) => {
      obj.success.call(this, resJson, status);
    })
    .catch((error) => {
      obj.error.call(this, error);
    });
  }
}

const $f = new f();

export {$f};