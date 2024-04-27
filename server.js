const express = require('express');
const { Pool } = require('pg');
const PORT = process.env.PORT || 3001;
const app = express();