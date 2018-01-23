import React from 'react';
import { Link } from 'react-router-dom';

import { depositRecommendData } from '../../api/DataApi';
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';
import './CardSuccessPage.scss';

import partnerSuccess from './imgs/success_partner.jpg';

class CardSuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      productList:[]
    }
  }
  componentWillMount() {
    document.title='绑卡成功';
    this.getRecommendProducts()
  }
  //获取推荐列表
  getRecommendProducts() {
    depositRecommendData()
    .then((data)=>{
      this.setState({
        productList:data.productList
      })
    },(error)=>{

    })
  }
  //去投资
  goProduct(id) {
    window.location.href=`/finance/detail/${id}`
  }
  //去合伙人页面
  goPartner() {
    location.hash='/account/partner';
  }

  render() {
    const { productList }=this.state;
    return(
      <div className="card-success-page">
        <DepositHead
          levelOne="绑卡成功"
          levelTwo="恭喜您，绑卡成功，赶紧去投资吧！"
        />
        <div className="main-content-action">
          <div className="pro-title">您可能感兴趣</div>
          <div className="pro-list">
            {
              productList.map((el,index)=>(
                <div className="item" key={index} onClick={this.goProduct.bind(this,el.id)}>
                  <p className="row-one">{el.productName}</p>
                  <p className="row-two">{el.annualIncomeText}</p>
                  <div className="row-thr">
                    <span className="label">{el.convertDay}天持有期</span>
                    {el.staInvestAmount}元起投
                  </div>
                  <div className="bot-content">
                    <p className="money-num">剩余金额{el.productRemainAmount}元</p>
                    <button className={`invest-btn ${el.productStatus!=1?'disabled':''}`}>
                      立即投资
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          <img src={partnerSuccess} onClick={this.goPartner}></img>
        </div>
        <Footer />
      </div>
    )
  }
}

export default CardSuccessPage;
