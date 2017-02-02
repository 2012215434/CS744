import {$f} from './fn';

function test(){

  $f.ajax({
    url: '/test',
    method: 'GET',
    //body: {},   如果是post就这样加上body
    success: (result) => {
      console.log(result);
    },
    error: (err) => {
      console.log(err);
    }
  });
}
test();
console.log(5);