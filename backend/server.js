const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello from server')
})

app.use('/api/auth', authRoutes);
app.use('/api/company', auth, companyRoutes); // All protected routes

app.listen(4001, () => console.log('Server running on 5000'));
