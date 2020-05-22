'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static('./'));

app.listen('8080', () => {
  console.log('app started on localhost:8080');
});