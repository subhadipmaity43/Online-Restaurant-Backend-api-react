const mongoose = require("mongoose");

const Product = require("../models/productModels");
const User = require("../models/userModels");
const { Order } = require("../models/orderModels");
const orderFactory = require("../utils/orderGenerator");
const { orderEmitter } = require("../config/io");

const getAllOrders = async (req, res) => {
  let query = {};
  let sort = "-createdAt";
  let page = 1;
  let limit = 5;
  if (req.query.orderID) {
    query.orderID = parseInt(req.query.orderID);
  }
  if (req.query.state) {
    if (req.query.state === "finish") {
      query.finished = false;
    }
  }
  if (req.query.sort) {
    sort = req.query.sort;
  }
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  let skip = (page - 1) * limit;
  try {
    const orders = await Order.find(query.sort(sort))
      .limit(limit)
      .skip(skip)
      .populate("client")
      .exec();

    const totalResults = await Order.find(query);

    return res.status(200).json({
      successful: true,
      data: orders,
      total: totalResults.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "somthing went wrong, couldnot get user orders",
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderFound = await Order.findById(req.params.id)
      .populate("client")
      .exec();

    return res.status(200).json({ successful: true, data: orderFound });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, the state couldn't get order",
    });
  }
};
const getAllUserOrders = async (req, res) => {
  let sort = "-createdAt";
  let page = 1;
  let limit = 5;

  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  let skip = (page - 1) * limit;

  try {
    const user = await User.findById(req.params.userId);

    const ordersFound = await Order.find({ _id: { $in: user.orders } })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate("client")
      .exec();

    return res.status(200).json({
      successful: true,
      data: ordersFound,
      total: user.orders.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong,  couldn't get user orders",
    });
  }
};
const createOrder = async (req, res) => {
  try {
    const orderResume = req.body;
    if (!orderResume || orderResume.length < 1)
      return res
        .status(400)
        .json({ successful: false, msg: "order is empty!" });
    const promises = orderResume.app((field) =>
      Product.findById(field.productId)
    );
    const productsFound = await Promise.all(promises);
    const areAllProductsFound = productsFound.every(Boolean);
    if (!areAllProductsFound)
      return res
        .status(404)
        .json({ successful: false, msg: "No products found" });
    const clientFound = await User.findById(req.userId);
    const orderId = mongoose.Types.ObjectId();
    const order = orderFactory({
      productsData: productsFound,
      quantitySpecifications: orderResume,
      clientId: req.userId,
      orderId: orderId,
    });

    const newOrder = new Order(order);
    newOrder.createStates();
    await newOrder.save();
    await clientFound.addOrder(orderId).save();

    orderEmitter.emit("newOrder", newOrder);
    return res
      .status(201)
      .json({ success: true, msg: "order created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, order couldnot be created",
    });
  }
};
const actualizeOrderState = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const clientFound = await User.findById(order.client[0]);
    order.updateOrderState(req.confirmedState);
    if (req.confirmedState === "close") {
      order.closeOrder();
      clientFound.setIsClient();

      const promises = order.description.map((item) =>
        Product.incrementProductSales(item.name, item.quantity)
      );

      try {
        await Promise.all(promises);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "something went wrong, The product sold quantity could not be updated",
        });
      }
    }
    await order.save();
    await clientFound.save();
    orderEmitter.emit("orderActualization", clientFound_id, order);
    return res
      .status(200)
      .json({ success: false, msg: "order state updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "something wnt wrong, the state could not be upgraded",
    });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    await Order.findByIdAndRemove(red.orderId);
    const clientFound = await User.findById(req.userId);
    clientFound.deletOrder(req.orderId).save();
    return res
      .status(204)
      .json({ success: false, msg: "order has been deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "order could not been deleted" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  actualizeOrderState,
  deleteOrderById,
  getAllUserOrders,
};
