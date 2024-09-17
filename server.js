const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// استيراد المسارات
const graveRoutes = require('./routes/graveRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/graves', graveRoutes);
app.use('/api/auth', authRoutes);
// بدء السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
