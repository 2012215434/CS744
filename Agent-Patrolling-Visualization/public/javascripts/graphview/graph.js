// import * as d3 from 'd3';

function graph(region) {
  var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height;

  //计算这个region一共有多少行多少列
  let left = region[0].column, 
    right = region[0].column, 
    up = region[0].row, 
    down = region[0].row;
    
  region.forEach((node) => {
    left = Math.min(node.column, left);
    right = Math.max(node.column, right);
    up = Math.min(node.row, up);
    down = Math.max(node.row, down);
  });

  let columns = right - left + 1,
      rows = down - up + 1;

  //数组，图上的所有点
  var nodes = d3.range(columns * rows).map(function(i) {
    let column = i % columns + left,
        row = Math.floor(i / columns) + up;
    
    let exists = false;
    region.forEach((node) => {
      if(node.column == column && node.row == row){
        exists = true;
      }
    });

    return {
      index: i,
      r:  10, //node半径
      fx: width / 2 - columns * 40 / 2 + (i % columns) * 40, //每个node的x坐标
      fy: height / 2 - columns * 40 / 2 + (Math.floor(i / columns)) * 40, //每个node的y坐标
      exists: exists //该node是否需要显示，这是我另外加上去的属性，为了绘制时判断用的。见drawGraph里的drawLink和drawNode
    };
    /*
      注意，以上除了exists属性，都是交给d3处理的，比如r设置为10，每个点绘制出来的半径就会是10，相当于配置信息；
      而exists是我人为添加的，我在遍历nodes并绘制的函数中，加入了if判断，只绘制被我标记为exists的点。否则会绘制出整个长方形，
      （看前面的“d3.range(columns * rows)”，实际上我们添加了columns * rows个node，最终绘制出来的node数量肯定小于它
    */
  });

  //图上的那些连线
  var links = [];

  for (var y = 0; y < rows; ++y) {
    for (var x = 0; x < columns; ++x) {
      if (y > 0) links.push({source: (y - 1) * columns + x, target: y * columns + x});
      if (x > 0) links.push({source: y * columns + (x - 1), target: y * columns + x});
    }
  }

  //相当于整张图的configuration
  var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-60)) //这些具体查api，我都调好了，基本不用动
    .force('link', d3.forceLink(links).strength(1).distance(37).iterations(10))
    .on('tick', ticked);

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(0, 0);

    drawGraph();

    context.restore();
  }

  //zoom时的事件（放大缩小）
  d3.select(canvas).call(d3.zoom()
    .scaleExtent([1 / 2, 4])
    .on('zoom', zoomed));
  
  //zoom事件触发时的回调函数，使之放大缩小
  function zoomed() {
    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(d3.event.transform.x, d3.event.transform.y);
    context.scale(d3.event.transform.k, d3.event.transform.k);
    
    drawGraph();
    context.restore();
  }

  //绘制整张图
  function drawGraph() {
    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = '#aaa';
    context.stroke();

    context.beginPath();
    nodes.forEach(drawNode); //对于每一个node，执行drawNode方法
    context.fillStyle = '#fff';
    context.fill();
  }

  function drawNode(d) {
    //这边就用到了我已开始设置的exists属性，如果是true才绘制。你可以试着把if去掉，画出来是个长方形
    if(d.exists) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, d.r, 0,  2 * Math.PI);
    }
  } 

  function drawLink(d) {
    if(d.source.exists && d.target.exists) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }
  }

  //以下是控制drag，想想还是先不做了(具体原因先不用管)，以后你想做再说。
  d3.select(canvas)
    .call(
    d3.drag()
      .container(canvas)
      .subject(dragsubject)
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );

  function dragsubject() {
    return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
  }

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  setTimeout(() => {simulation.stop();}, 400);
}


if(location.hash) {
  document.querySelector('#container').remove();

  //模拟输入一个region。到时候我传给你的就是这个格式
  var region = [{column: 2, row: 1}, {column: 2, row: 2}, {column: 2, row: 3},
    {column: 3, row: 2}, {column: 3, row: 3}, {column: 3, row: 4},{column: 3, row: 5},
    {column: 4, row: 2}, {column: 4, row: 3}, {column: 5, row: 2},
  ];
  graph(region);
}