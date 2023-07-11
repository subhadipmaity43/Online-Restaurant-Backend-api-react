const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STATE = ["send", "accepted", "dispatch", "delivered", "close"];
const orderSchema = new Schema(
  {
    orderID: { type: Number, default: Date.now },
    client: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: [
      {
        product: {
          name: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
          },
          price: {
            type: Number,
            default: 0,
          },
        },
        quantity: {
          type: Number,
          default: 1,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    states: [
      {
        name: {
          type: String,
          default: "",
        },
        confirmed: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
        },
      },
    ],
    finished: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);
orderSchema.methods.createStates = function createStates() {
  this.states = STATE.map((state) => {
    if (state === "send")
      return {
        name: state,
        confirmed: true,
        date: Date.now(),
      };
    return {
      name: state,
      confirmed: false,
    };
  });
  return this;
};
orderSchema.methods.updateOrderState = function (confirmedState) {
  const updateStates = this.states.map((state) => {
    if (state.name === confirmedState) {
      return {
        name: confirmedState,
        confirmed: true,
        date: Date.now(),
      };
    } else {
      return state;
    }
  });
  this.states = updateStates;
  return this;
};
orderSchema.methods.closeOrder = function () {
  this.finished = true;
  return this;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, STATE };
