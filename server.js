const path = require('path');
const http = require('http');
const express = require('express');
const Routes = require('./Routes');
const app = express();

const server = http.Server(app);

// Serve the videos statically
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Routes
app.use(``, Routes);



// Not found route
app.use((req, res) =>
  res
    .status(404)
    .json({ success: false, message: 'Route not found', type: 'error' })
);




const customExpress = Object.create(express().response, {
  data: {
    value(data, message = 'success', status = true) {
      return this.type('json').json({
        type: 'success',
        data,
        message,
      });
    },
  },

  success: {
    value(message = 'success', status = true) {
      return this.type('json').json({
        type: 'success',
        message,
      });
    },
  },

  error: {
    value(error, message = 'An error occured', code) {
      return this.status(code || 500).json({
        message,
        statusCode: -3,
        type: 'error',
        error,
      });
    },
  },

  errorMessage: {
    value(message = 'API response message', style = {}, code) {
      return this.status(code || 400).json({
        message,
        ...style,
        statusCode: 1,
        type: 'error',
      });
    },
  },
});

app.response = Object.create(customExpress);

server.listen(process.env.PORT || 3333, () => {
  console.log(`listening on port ${process.env.PORT || 3333}`);
});
