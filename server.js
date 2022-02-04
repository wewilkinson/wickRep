require('dotenv').config();

const express = require('express'),
      apiRoutes = require('./app/routes/apiRoutes'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      jsonwebtoken = require('jsonwebtoken'),
      port = process.env.PORT || 4242;

const app = module.exports = express();

// mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo:27018/apidb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// jwt setup
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'APIs', (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    })
  } else {
    req.user = undefined;
    next();
  }
});

apiRoutes.routes(app);

app.get('/', (req, res) =>
  res.send('Epic Scheduling API')
);

app.listen(port, () =>
  console.log('Server listening on port ' + port)
);

//initialize global variable for MDM Demographic data
global.mdmData = '';
