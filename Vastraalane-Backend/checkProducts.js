require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const count = await Product.countDocuments();
    const noImageCount = await Product.countDocuments({
      $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
    });
    const multiImageCount = await Product.countDocuments({
      "images.1": { $exists: true },
    });

    console.log(`Products in database: ${count}`);
    console.log(`Products with 0 images: ${noImageCount}`);
    console.log(`Products with multiple images: ${multiImageCount}`);

    if (count > 0) {
      const sample = await Product.findOne().lean();
      console.log(`\nSample product name: ${sample.name}`);
      console.log(`Price: ${sample.price}`);
      console.log(`Images: ${(sample.images || []).length}`);
      console.log(`Identity key: ${sample.identityKey}`);
    }

    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
