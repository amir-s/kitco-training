var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var io = null;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var tasks = [{
          label: 'something1',
          checked: false,
        },{
          label: 'something3',
          checked: false,
        }];

app.get('/', function (req, res) {
  res.render('index', {title: "hello"})
})

app.get('/tasks', function (req, res) {
  res.send(tasks);
})


app.post('/task', function (req, res) {
  tasks.push({
    label: req.body.label,
    checked: false
  });
  io.sockets.emit('newTask', {
    label: req.body.label,
    checked: false
  });
  res.send({ok: true});
})

app.post('/updateTask', function (req, res) {
  tasks[req.body.index].checked = req.body.checked;
  res.send({ok: true})
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



var http = require('http');

/**
 * Get port from environment and store in Express.
 */


var server = http.createServer(app);
server.listen(3000);

io = require('socket.io')(server);

io.on('connection', function (socket) {

  socket.on('hello', function (data) {
    console.log(data.name)
  })
  console.log("something connected")
})