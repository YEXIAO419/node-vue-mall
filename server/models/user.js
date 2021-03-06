var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [{
    "productId": String,
    "productName": String,
    "salePrice": String,
    "checked": String,
    "productNum": String,
    "productImage": String
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": Number,
    "tel": Number,
    "isDefault": Boolean
  }],
  "orderList": [{
    orderId: String,
    orderTotal: Number,
    addressInfo:String,
    goodsList: Array,
    orderStatus: String,
    createDate:Date
  }]
});

module.exports = mongoose.model("User", userSchema);
