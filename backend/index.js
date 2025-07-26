const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config() 

const app=express() 
app.use(express.json()) 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});