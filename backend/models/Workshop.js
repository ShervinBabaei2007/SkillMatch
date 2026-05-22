const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
  {
    name: String,
    categories: [String],
    date: String,
    time: String,
    location: String,
    about: String,
    ticketPrice: String,
    applicationPeriod: String,
    seats: String,
    imageUrl: String,
    hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workshop", workshopSchema);
