var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods=require('./../models/goods.js');

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
router.get('/', function(req, res, next) {
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

module.exports = router;
