import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import LimitsModal from '../user/comments/LimitsModal';
import {
  getCardInfoData,
  getZtCapitalData,
  personalInfo
} from '../../api/DataApi';
// 本地服务
import Utils from '../../utils';
import user from '../../model/User';
import ModalDepost from './comments/Modal';

import './CardPage.scss';
const confirm = Modal.confirm;
import BOC from './imgs/card_BOC.png';
import ABC from './imgs/card_ABC.png';
import ACBC from './imgs/card_ACBC.png';
import CCB from './imgs/card_CCB.png';
import COMM from './imgs/card_COMM.png';
//未绑定银行卡
class BindCard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:''//实名，密码是：1，绑卡：2
    }
  }
  //去充值，提现
  goNextUrl(backUrl) {
    this.setState({
      showModal:Utils.goNextUrl(backUrl).visible,
      goUrl:Utils.goNextUrl(backUrl).goUrl,
      status:Utils.goNextUrl(backUrl).status
    })
  }
  //去充值，提现
  goBindCard() {
    let backUrl = this.props.location.pathname;
    this.setState({
      showModal:Utils.goBindCardUrl(backUrl).visible,
      goUrl:Utils.goBindCardUrl(backUrl).goUrl,
      status:Utils.goBindCardUrl(backUrl).status
    })
  }
  render() {
    const {status,goUrl,showModal} =this.state;
    return(
      <div>
        <div className="unbind-card-status">
          <p className="main-title">未绑定银行卡</p>
          <div
            className="unbind-btn"
            onClick={()=>this.goBindCard()}>
            +绑定银行卡
          </div>
          <p className="main-title">推荐绑定银行卡</p>
          <div className="recommend-card-list">
            <div className="item">
              <img src={BOC}></img>
            </div>
            <div className="item">
              <img src={ABC}></img>
            </div>
            <div className="item">
              <img src={ACBC}></img>
            </div>
            <div className="item">
              <img src={CCB}></img>
            </div>
            <div className="item">
              <img src={COMM}></img>
            </div>
          </div>
        </div>
        <ModalDepost
          status={status}
          goUrl={goUrl}
          visible={showModal}
        />
      </div>
    )
  }
}
//银行卡信息
class CardInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      cardInfo:{},
      isFlag:0
    }
  };
  componentWillMount() {
    this.getAccountAmount();
  }
  //是否有在再资金
  getAccountAmount() {
     getZtCapitalData()
     .then((data)=>{
       this.setState({
         isFlag:data.accoutAmountFlag
       })
     },(error)=>{
       // console.log(error)
     })
  }
  //去换卡
  goChangeCard() {
    let backUrl = this.props.match.path;
    if(user.isSetPwd()) {
      if(this.state.isFlag=='1') {
        confirm({
          title: '您的账号里有在途资金',
          content: '您的账号里有在途资金，确定换卡吗？',
          onOk:()=> {
            this.props.history.push(`/user/changeCard/?backUrl=${backUrl}`);
          }
        });
      } else {
        this.props.history.push(`/user/changeCard/?backUrl=${backUrl}`);
      }
    } else {
      this.props.history.push(`/user/depostPsd/?backUrl=${backUrl}`);
    }
  }
  render() {
    const { data }=this.props;
    return(
      <div className="bind-card-status">
        <p className="main-title">已绑定的银行卡</p>
        <div className="card-info">
          <div className="row-one clear">
            <p className="bank-name">{data.belongBank}</p>
            <button
              className="change-btn"
              onClick={this.goChangeCard.bind(this)}>
              更换银行卡
            </button>
          </div>
          <p className="row-two">{data.bankCardId}</p>
          <p className="row-thr">
            <span className="userName">{data.userName}</span>
            添加于：{ data.bindDate}
          </p>
        </div>
        <div className="card-tips-detail">
          <p className="main-title">温馨提示</p>
          <p>
            根据实际换卡实际情况的不同，可能需要提交额外的资料。<br/>
            如在换卡过程中有任何疑问可拨打领投鸟客服电话400-999-9980。<br/>
            自提交资料后2-3个工作日反馈审核结果。
            <Link to="/account/inCardProcess" className="blue-col">了解更换银行卡流程>></Link>
          </p>
        </div>
      </div>
    )
  }
}

class CardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      cardInfo:{},
      visible:false
    }
  };
  componentWillMount() {
    document.title = '我的银行卡';
    personalInfo()
    this.getCardInfo();
  }
  handleOk() {
    this.setState({
      visible:true
    })
  }
  handleCancel() {
    this.setState({
      visible:false
    })
  }
  getCardInfo() {
    getCardInfoData()
    .then((data)=>{
      this.setState({
        cardInfo:data
      })
    },(error)=>{
    })
  }

  render() {
      const { cardInfo } =this.state;
    return(
      <AccountWrapModule itemId='3' {...this.props}>
        <div className="main-pages-wrap card-page">
          <Head title="我的银行卡"  broadcast={true}/>
          <div className="content-action">
            {
              user.isBindCard()?
              <CardInfo data={cardInfo} {...this.props}/>
              :
              <BindCard {...this.props}/>
            }
            <div className="card-tips-detail">
              <p className="main-title">我的银行卡</p>
              <p>
              1.仅支持储蓄卡(借记卡)，不支持信用卡(借贷卡)；<br/>
              2.该银行卡可用于网站及手机APP充值与提现，目前可支持中国工商银行、中国农业银行、中国建设银行、中国银行、浦东发展银行、中国交通银行、中国民生银行、广发银行、中信银行、兴业银行、广大银行、招商银行、平安银行，以上银行在快捷充值时均有限额。
              <span className="blue-col" onClick={this.handleOk.bind(this)}>查看快捷充值限额表>></span><br/>
              3.为保障您的账户安全，如需更换快捷银行卡账户，需通过线下人工审核流程。
              </p>
            </div>
          </div>
          <LimitsModal
            visible={this.state.visible}
            handleCancel={()=>this.handleCancel()}/>
        </div>
      </AccountWrapModule>
    )
  }
}

export default CardPage;
