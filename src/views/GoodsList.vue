<template>
  <div class="goodslist">
    <nav-header></nav-header>
    <nav-breader>
      <span>商品列表</span>
    </nav-breader>
    <div class="accessory-result-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur" @click="defaultSortGoods">默认</a>
          <a href="javascript:void(0)" class="price" :class="{'shor-up': sortFlag}" @click="sortGoods">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby" @click.stop="showFilterPop">筛选</a><!--stop阻止冒泡-->
        </div>

        <div class="accessory-result">
          <!-- filter -->
          <div class="filter" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>价格区间:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur': priceChecked == 'all'}" @click="setPriceFilter('all')">选择价格</a></dd>
              <dd v-for="(item, index) in priceFilter">
                <a href="javascript:void(0)" :class="{'cur': priceChecked == index}" @click="setPriceFilter(index)">￥ {{item.startPrice}} - {{item.endPrice}} 元</a>
              </dd>
            </dl>
          </div>

          <!-- 商品列表 -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/' + item.productImage" alt="" lazy="loading" width="100%" height="100%"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice | currency}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!--滚动分页-->
            <div class="view-more-normal"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="busy"
                 infinite-scroll-distance="20">
              <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>

    <!--要求登录提示框-->
    <modal :mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登陆，否则无法加入购物车中！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:void(0)" @click="mdShow=false">关闭</a>
      </div>
    </modal>

    <!--加入购物车成功-->
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:void(0);" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>

    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBreader from '@/components/NavBreader'
  import Modal from '@/components/Modal'
  import {currency} from './../util/currency'
  import axios from 'axios'
  import './../assets/css/goods-list.css'
  export default {
    name: 'GoodsList',
    data () {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false,
        mdShowCart: false,
        priceFilter: [{
          startPrice:'0.00',
          endPrice:'100.00'
        },
          {
            startPrice:'100.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'2000.00'
          },
          {
            startPrice:'2000.00',
            endPrice:'3000.00'
          },
          {
            startPrice:'3000.00',
            endPrice:'6000.00'
          }],
        startPrice: '',
        endPrice: '',
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false　
      }
    },
  filters: {
    currency: currency
  },
    components: {
      NavHeader,
      NavFooter,
      NavBreader,
      Modal
    },
    methods: {
      getGoodsList(flag){
        this.loading = true;
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          startPrice: this.startPrice,
          endPrice: this.endPrice,
        };
        axios.get("/goods/list", {
          params: param
        }).then((result) => {
          var res = result.data;
          this.loading = false;
          if(res.status == '0'){
            if(flag){ //判断是否滚动拉数据，是，则数据相加
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count == 0){ //判断是否还有数据，否则true不会发起ajax请求
                this.busy = true;
              }else{
                this.busy = false;
              }
            }else{
              this.goodsList = res.result.list;
              this.busy = false; //busy为false则可继续拉数据
            }
          }else{
            this.goodsList = [];
          }
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      defaultSortGoods(){
        this.sortFlag = true;
        this.page = 1;
        this.getGoodsList();
      },
      setPriceFilter(index){
        this.priceChecked = index;
        if(index != 'all'){
          this.startPrice = (this.priceFilter)[index].startPrice;
          this.endPrice = (this.priceFilter)[index].endPrice;
        }else {
          this.startPrice = "";
          this.endPrice = "";
        }
        this.page = 1;
        this.getGoodsList();
      },
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop(){
        this.filterBy = false;
        this.overLayFlag = false;
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500)
      },
      addCart(productId){
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          var res = res.data;
          if(res.status == 0){
            this.mdShowCart = true;
          }else{
            this.mdShow = true;
          }
        })
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      }
    },
  mounted(){
    this.getGoodsList();
  }
  }
</script>
