function barChart() {
  var _chart = {};
  // var _width = 500, _height = 350,
  var _width, _height = 400,
    _margins = {top: 30, left: 50, right: 0, bottom: 30},
    _x, _y,
    _data = [],
    _svg,
    _bodyG,
    _chartDiv;

  _chart.render = function (id) {
    if (!_svg) {
      _chartDiv = document.querySelector('.chart-body');
      _width = _chartDiv.clientWidth;
      // _height = _chartDiv.clientHeight;
      _svg = d3.select('#' + id).append('svg')
        .attr('height', _height)
        .attr('width', _width);

        renderAxes(_svg);
      }
      renderBody(_svg);
  };

  function renderAxes(svg) {
    var axesG = svg.append('g')
      .attr('class', 'axes');

    var xAxis = d3.axisBottom()
      .scale(_x.rangeRound([0, quadrantWidth()])
      .padding(0.5));

    var yAxis = d3.axisLeft()
      .scale(_y.range([quadrantHeight(), 0]));

    axesG.append('g')
      .attr('class', 'x axis')
      .attr('transform', function () {
          return 'translate(' + xStart() + ',' + yStart() + ')';
      })
      .call(xAxis);

    axesG.append('g')
      .attr('class', 'y axis')
      .attr('transform', function () {
          return 'translate(' + xStart() + ',' + yEnd() + ')';
      })
      .call(yAxis);

      axesG.append('g')
      .attr('class', 'grid axis')
      .attr('transform', function () {
        return 'translate(' + xStart() + ',' + yEnd() + ')';
      })
      .call(make_y_gridlines()
          .tickSize(-_width)
          .tickFormat("")
        )
  }

  function make_y_gridlines() {		
    return d3.axisLeft(_y)
      .ticks(10)
  }
  
  function renderBody(svg) {
    if (!_bodyG)
      _bodyG = svg.append('g')
        .attr('class', 'body')
        .attr('transform', 'translate(' 
          + xStart() 
          + ',' 
          + yEnd() + ')')
      renderBars();
  }
  
  function renderBars() {
    var padding = 15;
    var bars = _bodyG.selectAll('rect.bar')
      .data(_data);
    bars.enter()
      .append('rect')
      .merge(bars)
        .attr('class', 'bar')
      //.transition()
        .attr('x', function (d) { 
          return _x(d.date);
        })
        .attr('y', function (d) { 
          return _y(d.avail);
        })
        .attr('height', function (d) { 
          return quadrantHeight() - _y(d.avail); 
        })
        .attr('width', _x.bandwidth())

    addLines();
  }

  function addLines() {

    _linesG = _bodyG.append('g')
        .attr('class', 'lines')

    _linesG.append('g')
      .attr('class', 'red-line')
    .append("svg:line")
      .attr("x1", _x('Jan-18') + _x.bandwidth() / 2)
      .attr("x2", _x('Jun-18') + _x.bandwidth() / 2)
      .attr("y1", _y(99.5))
      .attr("y2", _y(99.5));

    _linesG.append('g')
      .attr('class', 'green-line')
    .append("svg:line")
      .attr("x1", _x('Jan-18') + _x.bandwidth() / 2)
      .attr("x2", _x('Jun-18') + _x.bandwidth() / 2)
      .attr("y1", _y(99.9))
      .attr("y2", _y(99.9));

    _linesG.append('g')
      .attr('class', 'dark-blue-line')
    .append("svg:line")
      .attr("x1", _x('Jan-18') + _x.bandwidth() / 2)
      .attr("x2", _x('Jun-18') + _x.bandwidth() / 2)
      .attr("y1", _y(99.96))
      .attr("y2", _y(99.96));

    _linesG.append('g')
      .attr('class', 'cyan-line')
    .append("svg:line")
      .attr("x1", _x('Jan-18') + _x.bandwidth() / 2)
      .attr("x2", _x('Jun-18') + _x.bandwidth() / 2)
      .attr("y1", _y(99.94))
      .attr("y2", _y(99.94));
  }

  function xStart() {
    return _margins.left;
  }

  function yStart() {
    return _height - _margins.bottom;
  }

  function xEnd() {
    return _width - _margins.right;
  }

  function yEnd() {
    return _margins.top;
  }

  function quadrantWidth() {
    return _width - _margins.left - _margins.right;
  }

  function quadrantHeight() {
    return _height - _margins.top - _margins.bottom;
  }

  _chart.width = function (w) {
    if (!arguments.length) return _width;
    _width = w;
    return _chart;
  };

  _chart.height = function (h) {
    if (!arguments.length) return _height;
    _height = h;
    return _chart;
  };

  _chart.margins = function (m) {
    if (!arguments.length) return _margins;
    _margins = m;
    return _chart;
  };

  _chart.colors = function (c) {
    if (!arguments.length) return _colors;
    _colors = c;
    return _chart;
  };

  _chart.x = function (x) {
    if (!arguments.length) return _x;
    _x = x;
    return _chart;
  };

  _chart.y = function (y) {
    if (!arguments.length) return _y;
    _y = y;
    return _chart;
  };

  _chart.setSeries = function (series) {
    _data = series;
    return _chart;
  };

  return _chart;
}

var data = [
  {date: 'Jan-18', avail: 99.90},
  {date: 'Feb-18', avail: 99.98},
  {date: 'Mar-18', avail: 99.99},
  {date: 'Apr-18', avail: 99.71},
  {date: 'May-18', avail: 99.95},
  {date: 'Jun-18', avail: 99.99}
];

// var parseTime = d3.timeParse("%b-%y");
// data.forEach(function(d) {
//   d.date = parseTime(d.date);
// });

var chart = barChart()
  //.x(d3.scaleTime().domain([new Date(2018, 0, 1), new Date(2018, 5, 1)]))
  .x(d3.scaleBand().domain(data.map(function(d) { return d.date; })))
  .y(d3.scaleLinear().domain([99.00, 100.00]))

chart.setSeries(data);

chart.render('chart');

