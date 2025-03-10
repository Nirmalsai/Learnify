const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderDate: Date,
  instructorId: String,
  instructorName: String,
  courseImage: String,
  courseTitle: String,
  courseId: String,
  coursePricing: String,
});

module.exports = mongoose.model("Order", OrderSchema);
