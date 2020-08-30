const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

connectDB();

app.use(cors());

app.use(
    express.json({ extended: false })
);

app.get('/', (req, res) => {
    res.send('Backend Server Running');
})

app.use('/api/login', require('./routes/api/login'));
app.use('/api/register', require('./routes/api/register'));
app.use('/api/employee', require('./routes/api/employee'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./dist/easy-hr'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'easy-hr','index.html'));
      });
}



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})