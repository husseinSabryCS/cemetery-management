const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, { 
  // useNewUrlParser: true, useUnifiedTopology: true
 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// استيراد المسارات
const graveRoutes = require('./routes/graveRoutes');
const authRoutes = require('./routes/authRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const articleRoutes = require('./routes/articleRoutes');
app.use('/api/graves', graveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/suggestion', suggestionRoutes);
app.use('/api/articles', articleRoutes);
// بدء السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
