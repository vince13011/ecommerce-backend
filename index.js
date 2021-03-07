require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const router = require('./app/router.js')

app.use(express.urlencoded({ extended: true }));
//parser json qui récupère le payload et le transforme en objet js dispo sous request.body
// CORS
app.use(cors());
app.use(express.json());


app.use('/v1', router);

app.listen(port, () => { console.log(`Listening on http://localhost:${port}`) });