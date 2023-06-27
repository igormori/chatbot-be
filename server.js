const express = require('express');
const app = express();
const routes = require('./api/routes');
const port = process.env.PORT || 5000;
const allowedRoute = process.env.ALLOWED_ROUTE
const cors = require('cors');

app.use(express.json());
app.options('*', cors());


function enableCors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', `${allowedRoute}`); // Change this to the live frontend 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
}

app.use(enableCors);
app.use(express.urlencoded({ extended: false }));

app.disable('x-powered-by');
app.use(cors()); // Use this after the variable declaration


// API routes
app.use('/api/', routes);

app.get('/*', (req, res) => {
    res.send('Welcome to Genius Forest Backend');
});

app.listen(port);
console.log("Welcome to chatbot server");
console.log(`You are connected to port: ${port}`);
