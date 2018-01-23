import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox,Icon,Tooltip } from 'antd';
import Head from './comments/Head';
import {
  getCardInfoData,
  getAccountInfo,
  getPersonData,
  getwithdrawalsTimeApi
} from '../../api/DataApi';

// 外部服务
import lodash from 'lodash';
// 本地服务
import user from '../../model/User';
import Utils from '../../utils';
import Cookies from '../../utils/Cookies';
import RegExpUtil from '../../api/RegExpUtil';

import ModalDepost from './comments/Modal';
import ErrorText from '../comments/ErrorText';
const Accounting = require("accounting");
import AccountWrapModule from './comments/AccountWrapModule';
import './DrawMoney.scss';


class DrawMoneyPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bankName: '',
      bankNo: '',
      userName: '',
      bindDate: '',
      totalAsset: '',
      usableBalance: '',//可用金额
      cashAvailable:'',//可提金额
      drawMoneyFee:0,
      actualMoney:0,
      disabled:true,
      getMoneyTime:"最晚下一个工作日",
      birdCoin:0,
      freeCount:0,
      feeText:'',
      withdrawalsTime:'',
      feeTextDisplay:'none',
      birdCoinDisplay:'none',
      errorText:'',//错误信息
      errorVisible:false,
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:'',//实名，密码是：1，绑卡：2
    }
  };

  componentWillMount(){
    document.title='提现';
    this.getPersonUser();
    this.getwithdrawalsTime();
  }
  //页面拦截
  checkStatus() {
    let backUrl = this.props.location.pathname;
    if(!user.isSetPwd()||!user.isBindCard()) {//是否绑卡//支付密码
      //去充值，提现
      this.setState({
        showModal:Utils.goNextUrl(backUrl).visible,
        goUrl:Utils.goNextUrl(backUrl).goUrl,
        status:Utils.goNextUrl(backUrl).status,
      })
      return false;
    } else {
      return true;
    }
  }
  //渲染页面
  goRenderPage() {
    if(this.checkStatus()) {
      this.getCardInfoList();
    } else {
      return false;
    }
  }
  //更新用户信息
  getPersonUser() {
    getPersonData()
    .then(data=>{
      Cookies.updateUser(data)
      user.updateUserFromCookie();
    })
    .then(data=>{
      this.goRenderPage()
    })
  }
  //卡信息
  getCardInfoList() {
    getCardInfoData()
    .then((data) =>{
      this.setState({
        bankName: data.belongBank,
        bankNo: data.bankCardId,
        userName: data.userName,
        bindDate: data.bindDate
      });
    },(err) =>{
    });
    getAccountInfo()
    .then((data) =>{
      this.setState({
        totalAsset:data.totalAsset,
        usableBalance:data.usableBalance,
        cashAvailable:data.cashAvailable,
        birdCoin:data.birdCoin,
        freeCount:data.freeCounter
      });
    },(err)=>{

    });
  }
  //表单change,1：正则校验，2：输入金额变更
  onChangeInput(e){
    const value = lodash.trim(e.target.value);
    let { errorText,errorVisible,disabled,cashAvailable,actualMoney } =this.state;
    if(!RegExpUtil.money.test(value)) {
      errorText='请输入正确的金额';
      errorVisible=true;
      disabled=true;
      actualMoney=0;//实际金额置0
    } else if(value>cashAvailable){
      errorText='输入的金额不能大于账户可提现金额';
      errorVisible=true;
      disabled=true;
    } else {
      disabled=false;
      errorVisible=false;
    }
    this.setState({
      errorText,
      errorVisible,
      disabled,
      actualMoney,
      value
    })
    this.mathDrawMoneyFee(value);
  }
  //手续费
  mathDrawMoneyFee(value){
    let { freeCount,birdCoin } =this.state;
    if(value>0){
      let drawMoneyFee = 0;
      let feeText = '';
      let feeTextDisplay = 'none';
      let birdCoinDisplay = 'none';
      let actualMoney = 0;
      if(freeCount>0){
        drawMoneyFee = 0;
        feeText = `（您当月还有${freeCount}次免费提现机会，提现即使用）`;
        feeTextDisplay = 'inline-block';
      } else if (birdCoin>2) {
        drawMoneyFee = 0;
        feeText = `（您当月无免费提现机会，系统将自动使用鸟币进行抵扣）`;
        feeTextDisplay = 'inline-block';
        birdCoinDisplay = 'inline-block';
      } else{
        drawMoneyFee = 2;
      }
      actualMoney = Accounting.formatMoney(value - drawMoneyFee,{symbol:''});
      if(actualMoney<=0) {//实际提现<0时，按钮不可点
        this.setState({
          disabled:true,
          actualMoney:0
        })
      } else {
        this.setState({
          actualMoney
        });
      }
      this.setState({
        drawMoneyFee,
        feeText,
        feeTextDisplay,
        birdCoinDisplay
      });
      // this.getwithdrawalsTime();
    }
  }
  //获取到账时间
  getwithdrawalsTime() {
    getwithdrawalsTimeApi()
    .then(data=>{
      this.setState({
        withdrawalsTime:data.withdrawalsPromptMessage
      })

    })
  }
  submit(){
    let parmasOne;
    let parmasThr;
    let { value,actualMoney,disabled,drawMoneyFee } =this.state;
    if(!disabled){
      parmasOne = `drawMoney=${value}&&actualMoney=${actualMoney}`;
      if(drawMoneyFee===0){
        parmasThr = "drawMoneyFee=0元（商户承担）";
      } else {
        parmasThr =`drawMoneyFee=${drawMoneyFee}元`;
      }
      location.hash=`/user/comfirmDrawMoney?${parmasOne+'&&'+'&&'+parmasThr}`;
    }
  }
  render() {
    const {
      bankName,
      bankNo,
      userName,
      bindDate,
      totalAsset,
      usableBalance,
      actualMoney,
      drawMoneyFee,
      disabled,
      withdrawalsTime,
      birdCoin,
      feeText,
      feeTextDisplay,
      birdCoinDisplay,
      cashAvailable
    } = this.state;

    return(
      <AccountWrapModule itemId='2' {...this.props}>
        <div className="main-pages-wrap detail-drawmoney-page">
          <Head title="提现" broadcast={true} />
          <p className="vice-title">提现至该银行卡</p>
          <div className="card-contain">
            <p className="card-name">{bankName}</p>
            <p className="card-number">{bankNo}</p>
            <p className="card-mes">
              <span>{userName}</span>
              <span>添加于：{bindDate}</span>
            </p>
          </div>
          <p className="vice-title">提现金额</p>
          <div className="draw-money-input">
            <p>
              <span>可用余额：</span>
              <span className="orange">
                {Accounting.formatMoney(usableBalance,{symbol:''})}元
              </span>
            </p>
            <p>
              <span>可提金额：</span>
              {Accounting.formatMoney(cashAvailable,{symbol:''})}元
              <Tooltip placement="topLeft" title='充值金额当日不可提现！'>
                <Icon type="question-circle" />
              </Tooltip>
            </p>
            <div>
              <span>提现金额：</span>
              <span className="input">
                <input
                  onChange={(e) =>this.onChangeInput(e)}
                  type="number" />
                元
              </span>
              <ErrorText visible={this.state.errorVisible} className="sub-note">
                {this.state.errorText}
              </ErrorText>
            </div>
            <p>
              <span>付手续费：</span>
              {drawMoneyFee}元
              <span style={{display:feeTextDisplay}} className="text-exp">{feeText}</span>
            </p>
            <p style={{display:birdCoinDisplay}}>
              <span>鸟币抵扣：</span>
              2.00鸟币
              <span className="text-exp">(当前剩余鸟币：{birdCoin}元)</span>
            </p>
            <p>
              <span>实际到账：</span>
              <span className="orange">{actualMoney}元</span>
            </p>
            <div className="submit-contain">
              <button
                onClick={() =>this.submit()} className={disabled?'disabled':''}>
                申请提现
              </button>
              <p>{withdrawalsTime}</p>
            </div>
          </div>
          <p className="vice-title">提现说明</p>
          <div className="rule-explain">
            在工作时间段(工作日16:30前)提现，可当日到账；<br/>
            在非工作时间段提现，一般在第二个工作日到账，节假日顺延。<br/>
            (1)每个月有一次免费提现机会；<br/>
            (2)免费提现机会用完后可以使用鸟币进行抵扣(1个鸟币等于1元人民币)，如果您有相应的鸟币，系统会自动为您匹配鸟币；<br/>
            (3)当鸟币不够抵扣或者用完，系统会优先从您的提现金额中扣除手续费。
          </div>
          <ModalDepost
            status={this.state.status}
            goUrl={this.state.goUrl}
            visible={this.state.showModal}
            closable='closable'
          />
        </div>
      </AccountWrapModule>

    )
  }
}

export default DrawMoneyPage;
