require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const router = require('./app/router.js')
const sanitizer = require('./app/services/bodySanitizer');
app.use(express.urlencoded({ extended: true }));



// CORS
/*const options = {
    origin: 'https://nomdedomaine.herokuapp.com/'}

//app.use(cors(options));
*/

app.use(cors('*'));

// parser json which gets the payload and transforms it into a js object available under request.body
app.use(express.json());

//sanitizes the data received
app.use(sanitizer);


app.use('/v1', router);

app.listen(port, () => { console.log(`Listening on http://localhost:${port}`) });