require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const count = await Product.countDocuments();
  console.log(`✅ Products in database: ${count}`);
  
  if (count > 0) {
    const sample = await Product.findOne();
    console.log(`\n📦 Sample product name: ${sample.name}`);
    console.log(`💰 Price: ${sample.price}`);
  }
  
  process.exit(0);
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
