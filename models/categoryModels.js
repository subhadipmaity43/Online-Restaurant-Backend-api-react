const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CATEGORIES = [
  "pizzas",
  "hotdogs",
  "sandwiches",
  "burgers",
  "chawmins",
  "sausages",
  "biriyanis",
  "momos",
  "noodles",
  "spaghetties",
];

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
categorySchema.statics.decrementCategoryProducts = function (categoryName) {
  this.findOneAndUpdate(
    { name: categoryName },
    {
      $inc: { quantity: -1 },
    },
    {
      new: true,
    }
  );
};
categorySchema.statics.incrementCategoryProducts = function (categoryName) {
  this.findOneAndUpdate(
    { name: categoryName },
    {
      $inc: { quantity: 1 },
    },
    {
      new: true,
    }
  );
};

const category = mongoose.model("category", categorySchema);
module.exports = { category, CATEGORIES };
