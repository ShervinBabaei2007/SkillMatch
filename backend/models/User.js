const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    phone: { type: String },
    paymentMethod: { type: String },
    ticketAmount: { type: Number },
    receiptQR: { type: String },
    position: { type: String, default: "" },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      enum: [
        "Design", "Creativity", "Tech", "Math",
        "Marketing", "Finance", "Fine Art", "Writing",
        "Sales", "Teaching", "Coding", "Research",
        "Fashion", "Hair", "Pottery", "Cooking",
        "Photography", "Music", "Video Editing", "Public Speaking",
        "Leadership", "UI/UX", "Animation", "Game Dev",
        "AI", "Data Science", "Fitness", "Nutrition",
        "Languages", "Entrepreneurship",
      ],
      default: [],
    },
    workshopsAttended: {
      type: Number,
      default: 0,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
