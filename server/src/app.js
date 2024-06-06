const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

require('dotenv').config("../");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`listening on http://localhost:${process.env.PORT}`);
});