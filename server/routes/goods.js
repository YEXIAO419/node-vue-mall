var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods=require('./../models/goods.js');
var User=require('./../models/user.js');

//链接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop_lesson');

mongoose.connection.on('connected', function(){
  console.log('MongoDB connected success');
})

mongoose.connection.on('error', function(){
  console.log('MongoDB connected fail.')
})

mongoose.connection.on('disconnected', function(){
  console.log('MongoDB connected disconnected.')
})

/* 查询商品列表数据 */
router.get('/list', function(req, res, next) {
  let page = parseInt(req.param('page')) || 0;
  let pageSize = parseInt(req.param('pageSize')) || 0;
  let sort = req.param('sort') || 1;
  let skip = (page-1)*pageSize || 0;
  let params = {};
  let startPrice = req.param("startPrice") || '';
  let endPrice = req.param("endPrice") || '';

  if(startPrice != '' && endPrice != ''){
    params = {"salePrice": {$gte: startPrice, $lte: endPrice}};
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function(err, doc){
      if(err){
        res.json({
          status: '1',
          msg: err.message
        })
      }else {
        res.json({
          status: '0',
          msg: '',
          result: {
            count: doc.length,
            list: doc
          }
        })
      }
  })
});

/* 加入购物车 */
router.post("/addCart", function(req, res, next){
  var userId = '100000077';
  var productId = req.body.productId;
  var cartSave = function(userDoc){
    userDoc.save(function (err, doc2) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    })
  }

  User.findOne({userId: userId}, function(err, userDoc){
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else {
      if (userDoc) {
        var goodFlag = false; //判断商品是否已存在购物车
        userDoc.cartList.forEach(function (item) {
          //如果购物车已存在商品则加一
          if (item.productId == productId) {
            goodFlag = true;
            item.productNum++;
          }
        });
        //如果不存在则新增商品
        if (goodFlag == false) {
           Goods.findOne({productId: productId}, function (err, doc) {
             if (err) {
               res.json({
                 status: '1',
                 msg: err.message
               })
             } else {
               doc.productNum = 1;
               doc.checked = 1;
               userDoc.cartList.push(doc);
               console.log(doc);
               cartSave(userDoc);
             }
           })
         }else{
          cartSave(userDoc);
        }
      }
    }
  })
})

module.exports = router;
