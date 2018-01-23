import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button,BackTop } from 'antd';
const Accounting = require("accounting");
import echarts  from 'echarts';

import {
  getBankShowData,
  getTotalAccountData,
  getWelfareData,
  RecommendProductData,
  personalInfo
} from '../../api/DataApi';

import Utils from '../../utils';
import user from '../../model/User';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import ModalDepost from './comments/Modal';
import ButtonAccount from './comments/ButtonAccount';
import './ViewallPage.scss';

import birdIcon from './imgs/viewall_icon_bird.png';
import tickitIcon from './imgs/viewall_icon_tickit.png';
import tickitIcon1 from './imgs/viewall_icon_tickit1.png';

const confirm = Modal.confirm;
//实名
const RealNameModule =()=>{
  return(
    <div className="has-realName-content banner-toggle-show">
      <div className="toggle-wrap">
        <p className="info-text">
          为保障您的资金安全<br/>请先开通存管账户
        </p>
        <Link to="/user/depostReal" className="go-btn">立即开户</Link>
      </div>
    </div>
  )
}
//绑卡
class BindCardModule extends React.Component{
  render() {
    return(
      <div className="has-bindCard-content banner-toggle-show">
        <div className="toggle-wrap">
          <p className="info-text">
            完成绑卡操作即可参与理财<br/>
            赶紧完成绑卡吧
          </p>
          <button className="go-btn"
          onClick={this.props.goBindCard}>立即绑卡</button>
        </div>
      </div>
    )
  }

}
//新手标
const XsbModule =()=>{
  return(
    <div className="has-xsb-content banner-toggle-show">
      <div className="toggle-wrap">
        <p className="info-text">
          历史年化收益达10%以上<br/>
          让新手也能赚更多
        </p>
        <a href="/finance/detail/27050749" className="go-btn">立即投资</a>
      </div>
    </div>
  )
}
//休验标
const TybModule =()=>{
  return(
    <div className="has-tyb-content banner-toggle-show">
      <div className="toggle-wrap">
        <div className="item">
          <div className="label">我的体验金</div>
          <div className="value">60000</div>
        </div>
        <div className="item">
          <div className="label">到期收益</div>
          <div className="value">
            13.18<span className="unit">鸟币</span>
          </div>
        </div>
        <a href="/finance/detail/1" className="go-btn">立即体验</a>
      </div>
    </div>
  )
}
//广告
const AdModule =()=>{
  return(
    <div className="has-ad-content banner-toggle-show">
      <p className="info-text">邀请好友双重礼</p>
      <a href='/other/mypartner' className="share-btn">他投我就赚</a>
    </div>
  )
}
//总账户chart
class ChartContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dom:null
    }
  }
  componentDidMount(){
    this.setState({
      dom:document.getElementById('viewall')
    })
  }
  render() {
    if(this.state.dom && this.props.totalAccount.collectRevenue != null){
      let option = {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          icon: 'circle',
        },
        series: [
          {
            name:'账户总览',
            type: 'pie',
            minAngle:'2',
            radius : ['40%','60%'],
            center: ['50%', '50%'],
            data:[
              {value:this.props.totalAccount.collectRevenue, name:'待收收益'},
              {value:this.props.totalAccount.usableBalance, name:'可用余额'},
              {value:this.props.totalAccount.collectCapital, name:'待收本金'},
              {value:this.props.totalAccount.frozenAmount, name:'冻结余额'},
            ]
          }
        ],
        color:['#ec5401','#fcd160','#78e8b8','#42b9fd']
      }
      const myChart = echarts.init(this.state.dom);
      myChart.setOption(option);
    }
    return(
      <div className="chart-contain" refs="mydiv" id="viewall" ></div>
    )
  }
}
//推荐理财
class RecommendList extends React.Component{
  goProductDetail(id){
   window.location.href=`/finance/detail/${id}`;
  }
  render() {
    const {data}=this.props;
    return(
    <div className="list">
      {
        data.map((el,index)=>(
          <div className="item" key={index}>
            <p className="value">{el.annualIncomeText}</p>
            <p className="label">历史年化收益</p>
            <p className="start-info"> {el.staInvestAmount}元起投    |    {el.convertDay}天 </p>
            <p className="residue-money">剩余金额：{el.productRemainAmount}元</p>
            {
              el.productStatus==1?
              <button className="invest-btn" onClick={()=>this.goProductDetail(el.id)}>立即投资</button>
              :
              <button className="invest-btn disabled">募集结束</button>
            }

          </div>
        ))
      }
    </div>
  )
  }
}

class ViewallPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCardAuth:'',//是否绑卡
      isNameAuth:'',//是否实名
      isTyb:'',//是否体验标
      isXsb:'',//是否新手标
      isAd:'',//广告位
      recommendList:[],//推荐理财
      totalAccount:{},//总数据
      welfare:{},//福利
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:''//实名，密码是：1，绑卡：2
    }
  };

  componentWillMount(){
    document.title = '账户总览';
    personalInfo();
    this.getBannerShow();//banner展示
    this.getTotalAccount();//totalAccount
    this.getWelfare();//福利
    this.recommendProduct();//推荐理财
  }
  //头部推荐banner显示
  getBannerShow() {
    getBankShowData()
    .then((data)=>{
      this.setState({
        isCardAuth:data.bannerFlag_BK,
        isXsb:data.bannerFlag_GS,
        isAd:data.bannerFlag_HD,
        isNameAuth:data.bannerFlag_SM,
        isTyb:data.bannerFlag_TYB
      })
    },(error)=>{
    })
  }
  //推荐理财
  recommendProduct() {
    RecommendProductData()
    .then((data)=>{
      this.setState({
        recommendList:data.productList
      })
    },(error)=>{
    })
  }
  //totalAccount
  getTotalAccount() {
    getTotalAccountData()
    .then((data)=>{
      this.setState({
        totalAccount:data
      })
    },(error)=>{
    })
  }
  //获取福利数据
  getWelfare() {
    getWelfareData()
    .then((data)=>{
      this.setState({
        welfare:data
      })
    },(error)=>{
    })
  }
  //去充值，提现
  goNextUrl(backUrl) {
    this.setState({
      showModal:Utils.goNextUrl(backUrl).visible,
      goUrl:Utils.goNextUrl(backUrl).goUrl,
      status:Utils.goNextUrl(backUrl).status
    })
  }
  //去绑卡
  goBindCard() {
    let backUrl = this.props.location.pathname;
    this.setState({
      showModal:Utils.goBindCardUrl(backUrl).visible,
      goUrl:Utils.goBindCardUrl(backUrl).goUrl,
      status:Utils.goBindCardUrl(backUrl).status
    })
  }
  render() {
    const {
      recommendList,
      totalAccount,
      welfare,
      isTyb,
      isNameAuth,
      isCardAuth,
      status,goUrl,showModal,isXsb } =this.state;
    let TodModule;
    let moduleShow = ()=>{
      if(isTyb=='1') {
        TodModule=TybModule;
      } else if(isNameAuth=='1') {
        TodModule=RealNameModule
      } else if(isCardAuth=='1') {
        TodModule=BindCardModule
      } else if(isXsb=='1') {
        TodModule=XsbModule
      } else {
        TodModule=AdModule
      }
    }
    moduleShow();
    return(
      <AccountWrapModule itemId='0' {...this.props}>
        <div className="main-pages-wrap track-account-page">
          <Head title="账户总览"/>
          <TodModule goBindCard={()=>this.goBindCard()}/>
          <div id="viewallpppp"></div>
          <div className="chart-data-wrap">
            <div className="part-l">
              <ChartContent totalAccount={totalAccount}/>
              <div className="account-num-contain">
                <p className="value">{Accounting.formatMoney(totalAccount.collectRevenue,{symbol:''})}</p>
                <Link to="/account/returnedMoney">待收收益（元）>></Link >
                <p className="value">
                  {Accounting.formatMoney(totalAccount.collectCapital,{symbol:''})}
                </p>
                <Link to="/account/returnedMoney">待收本金（元）>></Link >
                <p className="value">
                  {Accounting.formatMoney(totalAccount.usableBalance,{symbol:''})}
                </p>
                <Link to="/account/detailmoney">可用余额（元）>></Link>
                <p className="value">{Accounting.formatMoney(totalAccount.frozenAmount,{symbol:''})}</p>
                <p>冻结金额（元）</p>
              </div>
            </div>
            <div className="account-rase-contain">
              <p className="rase-money">
                {Accounting.formatMoney(totalAccount.usableBalance,{symbol:''})}
              </p>
              <p className="rase-unit">可用余额(元)</p>
              <div className="btn-contain">
                <ButtonAccount onClick={()=>this.goNextUrl('/account/trade/recharge')}>
                  充值
                </ButtonAccount>
                <ButtonAccount className="drawmoney-btn"
                  type="hollow" onClick={()=>this.goNextUrl('/account/trade/drawmoney')}>
                  提现
                </ButtonAccount>
                <ButtonAccount className="product-btn"
                  type="hollow" onClick={Utils.goProduct}>
                  投资
                </ButtonAccount>
              </div>
              <div className="prod">
                <div>
                  <p className="num">
                    {Accounting.formatMoney(totalAccount.totalRevenue,{symbol:''})}
                  </p>
                  <p>累计收益（元）</p>
                </div>
                <div>
                  <p className="num">
                    {Accounting.formatMoney(totalAccount.collectRevenue,{symbol:''})}
                  </p>
                  <Link to="/account/returnedMoney">待收收益（元）>></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="welfare-list">
            <div className="item">
              <img src={birdIcon} className="icon"/>
              <span className="text">鸟币金额</span>
              <Link to="/account/birdCoin" className="link-url">
                <span className="num">{welfare.birdCoin}</span>
                >>
              </Link>
            </div>
            <div className="item">
              <img src={tickitIcon} className="icon"/>
              <span className="text">返现券</span>
              <Link to="/account/returnTickit" className="link-url">
                <span className="num">{welfare.fXQNum}</span>张
                >>
              </Link>
            </div>
            <div className="item">
              <img src={tickitIcon1} className="icon"/>
              <span className="text">加息券</span>
              <Link to="/account/raiseTickit" className="link-url">
                <span className="num">{welfare.jXQNum}</span>张
                >>
              </Link>
            </div>
          </div>
          <div className="recommend-finance">
            <p className="rec-title">推荐理财</p>
            <RecommendList data={recommendList}/>
          </div>
        </div>
        <ModalDepost
          status={status}
          goUrl={goUrl}
          visible={showModal}
        />
      </AccountWrapModule>
    )
  }
}

export default ViewallPage;
