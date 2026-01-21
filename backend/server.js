const express = require('express');
const cors = require('cors');

const { authorizeUser } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
const vendorRoutes = require('./routes/vendor');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/company', authorizeUser, companyRoutes);
app.use('/api/employee', authorizeUser, employeeRoutes);
app.use('/api/vendor', authorizeUser, vendorRoutes);

app.listen(4001, () => console.log('Server running on 5000'));
