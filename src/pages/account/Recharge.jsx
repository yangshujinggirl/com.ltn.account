import React from 'react';
import { Checkbox, Tabs, Modal, Button } from 'antd';
import { Link } from 'react-router-dom';
import Malarquee from 'react-malarquee';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import {
  getBankList,
  rechargeMoney,
  getCardInfoData,
  detailMoneyTotalData,
  orderAmountLimitApi,
  getPersonData
} from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
// 本地服务
import user from '../../model/User';
import Utils from '../../utils';
import Cookies from '../../utils/Cookies';
import ModalDepost from './comments/Modal';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';
const Accounting = require("accounting");
import EbankLimitList from './comments/EbankLimitList';
import './Recharge.scss';

import bankIcon from './imgs/icon_recharge.png';
import conner from './imgs/conner.png';
import conner1 from './imgs/conner1.png';

class RechargePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      remainMoney:'',//可用余额
      cardInfo:{},//银行卡信息
      payWay: true,//快捷／银行卡充值选择切换（default 银行卡：true）
      quickPay: user.userInfo.agreementCz==="1"?true:false,//快捷支付免密充值勾选状态
      agreementCz: user.userInfo.agreementCz==="1"?true:false,//用户是否开通免密充值
      chargeDateLimit: user.userInfo.chargeDateLimit,//用户绑定的银行卡单日限额
      chargeTimeLimit: user.userInfo.chargeTimeLimit,//用户绑定的银行卡单笔限额
      isChecked: true,//协议勾选
      toastInfo: false,//充值超额提醒
      money: 0,//充值金额
      key: '1',//充值面板key值
      bankCardGateId: '',//选中的银行卡gateId
      disabled: true,//是否可以充值（default：充值按钮置灰）
      visible: false,
      bankCardList:[],//充值银行卡列表
      bankLimitVisible:false,
      errorText:'',
      errorVisible:false,
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:'',//实名，密码是：1，绑卡：2
    }
  };

  componentWillMount(){
    document.title='充值';
    this.getPersonUser()
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
      this.bankCardList();
        this.getCardInfo();
        this.getTotalAmount();
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
  //可用余额
  getTotalAmount() {
    detailMoneyTotalData()
    .then((data)=>{
      this.setState({
        remainMoney:data
      })
    },(error)=>{
    })
  }
  //银行卡列表
  bankCardList(){
    getBankList()
    .then((data) =>{
      this.setState({
        bankCardList:data.bankList
      });
    },(err)=>{

    })
  }
  //获取银行卡久息
  getCardInfo() {
    getCardInfoData()
    .then((data)=>{
      this.setState({
        cardInfo:data
      })
    },(error)=>{
      // if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
      //   location.hash=`/user/login?backUrl=${this.props.match.path}`;
      // }
    })
  }
  //表单change事件,校难正则，限额
  changeEvent(e){
    let {
      payWay,
      bankCardGateId,
      isChecked,
      money
    } =this.state;

    money =lodash.trim(e.target.value);
    let disabled = lodash.isEmpty(money)||(payWay&&lodash.isEmpty(bankCardGateId))||!isChecked;
    this.setState({
      money,
      disabled,
      errorVisible:false
    });
    //正则 ，限额
    if(!RegExpUtil.money.test(money)) {
      this.setState({
        errorVisible:true,
        errorText:"请输入正确的金额",
        disabled:true
      })
    }
  }
  //协议开关
  checkProtocol(e){
    let {
      payWay,
      bankCardGateId,
      money,
      isChecked,
      errorVisible
    } =this.state;
    isChecked= e.target.checked;
    let disabled = lodash.isEmpty(money)||(payWay&&lodash.isEmpty(bankCardGateId))||!isChecked||errorVisible;
    this.setState({
      isChecked,
      disabled
    });
  }
  //切换快捷支付开关
  changeQuickPay(){
    this.setState({
      quickPay: !this.state.quickPay
    });
  }
  //选中银行卡
  checkBank(id){
    let { money,isChecked,bankCardGateId,payWay,errorVisible } =this.state;
    bankCardGateId = id;
    let disabled=!isChecked||(payWay&&lodash.isEmpty(bankCardGateId))||lodash.isEmpty(money)||errorVisible;
    this.setState({
      disabled,
      bankCardGateId,
      bankLimitVisible:true
    })
  }

  //切换支付方式
  changePayWay(){
    let { money,isChecked,bankCardGateId,payWay,errorVisible } =this.state;
    payWay = !payWay;
    let disabled = lodash.isEmpty(money)||(payWay&&lodash.isEmpty(bankCardGateId))||!isChecked||errorVisible;
    this.setState({
      payWay,
      key:payWay?'1':'2',
      disabled
    })
  }
  //快捷充值 url
  quickPayUrl() {
    let { agreementCz,quickPay,money }=this.state;
    let parmas = `money=${money}`;
    if(agreementCz&&quickPay){
      location.hash=`/user/comfimrecharge?${parmas}`;
    } else if (agreementCz&&(!quickPay)) {
      //TODO 1，去开通 2，之后到确认充值页面
      location.hash=`/user/changePassState/0?${parmas}`;
    } else if (!agreementCz&&quickPay) {
      //TODO 1,去取消 2，之后到确认充值页面2（要输入手机验证码）
      location.hash=`/user/changePassState/1?${parmas}`;
    } else {
      //TODO 去确认充值页面2（要输入手机验证码）
      location.hash=`/user/comfirmWithCode?${parmas}`
    }
  }
  //快捷充值
  quickRecharge() {
    orderAmountLimitApi(this.state.money)
    .then((data)=>{
      this.quickPayUrl();
    })
    .catch((error)=>{
      this.setState({
        errorVisible:true,
        errorText:error.data.resultMessage,
        disabled:true
      })
    })

  }
  //检查投资限额
  checkPayWay() {
    let { money,payWay,bankCardGateId }=this.state;
    if(payWay) {
      this.showModal();
      let popup = window.open('about:blank', '_blank');
      rechargeMoney(money,'B2CDEBITBANK',bankCardGateId)
      .then((data)=>{
        popup.location = data.url;
      },(err)=>{

      })
    } else {
      this.quickRecharge();
    }
  }
  //点击充值按钮
  rechargeSubmit(){
    const { payWay,quickPay,money,bankCardGateId,agreementCz,disabled } = this.state;
    if(disabled) {
      return false;
    } else {
      if(!RegExpUtil.money.test(money)) {
        this.setState({
          errorVisible:true,
          errorText:"请输入正确的金额",
          disabled:true
        })
      } else {
        this.checkPayWay()
      }
    }
  }
  //银行卡列表
  showBankCard(){
    return this.state.bankCardList.map((cardObj, index) => {
        return (
          <div className={(this.state.bankCardGateId === cardObj.gateId)?'bank checked-bank':'bank'}>
            <img key={index}
              onClick={() =>this.checkBank(cardObj.gateId)}
              src={cardObj.picUrl} alt={cardObj.bankName} />
          </div>
        )
      })
  }
  uRecharge(){
    this.setState({
      key:'1',
      payWay:true
    });
  }
  //网银充值是否成功弹窗
  showModal(){
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ loading: false, visible: false });
    location.hash="/account/trade";
  }
  handleCancel = () => {
    this.setState({ visible: false });
    window.location.href="/help/trade";
  }
  goOnRechage(){
    this.setState({ visible: false });
    window.location.reload();
  }

  render() {
    const {
      payWay,
      disabled,
      toastInfo,
      visible,
      chargeDateLimit,
      chargeTimeLimit,
      key,
      cardInfo,
      remainMoney
     } = this.state;
    const TabPane = Tabs.TabPane;
    let quickPayIcon = this.state.quickPay?conner1:conner;
    return(
      <AccountWrapModule
        itemId='2'
        {...this.props}>
        <div className="main-pages-wrap detail-recharge-page">
          <Head title="充值" broadcast={true} />
          <p className="vice-title">充值金额</p>
          <div className="recharge-money">
            <div className="money-input">
              <input
                type="number"
                onChange={(e)=>this.changeEvent(e)}
                min="1"
                step="100" />
              <span>元</span>
            </div>
            <ErrorText visible={this.state.errorVisible} className="sub-note">
              {this.state.errorText}
            </ErrorText>
            <p className="rase-money">
              可用余额：
              <i>
                {Accounting.formatMoney(remainMoney.balance,{symbol:''})}元
              </i>
            </p>
            {
              !payWay&&<p className="note-text">
                超过每日充值限额{chargeDateLimit}元，
                建议使用
                <a onClick={() => this.uRecharge()}>网银充值</a>
              </p>
            }
          </div>
          <p className="vice-title">充值方式</p>
          <div className="bank-contain">
            <Tabs activeKey={key} onChange={() =>this.changePayWay()}>
              <TabPane tab="网银充值" key="1">
                <p className="vice-title">选择银行</p>
                <div className="bank-list">
                  {
                    this.showBankCard()
                  }
                  {
                    this.state.bankLimitVisible&&
                    <EbankLimitList gateId={this.state.bankCardGateId}/>
                  }
                </div>
              </TabPane>
              <TabPane tab={<span><img className="bank-icon" src={bankIcon} />快捷充值</span>} key="2">
                <div className="card-info">
                  <div className="row-one clear">
                    <p className="bank-name">{cardInfo.belongBank}</p>
                  </div>
                  <p className="bank-code">{cardInfo.bankCardId}</p>
                  <p className="row-thr">
                    <span className="userName">{cardInfo.userName}</span>
                    添加于：{cardInfo.bindDate}
                  </p>
                </div>
                <div className="card-info-right">
                  <div onClick={() => this.changeQuickPay()} className={this.state.quickPay?'selected-top top':'top'}>
                    <img src={quickPayIcon} />
                    <div>
                      <p>免密充值开关</p>
                      <p>开通免密后，您将免输入支付密码，充值更方便快捷</p>
                    </div>
                  </div>
                  <p className="note">
                    充值限额: 单笔限额{chargeTimeLimit}元，
                    每日累计限额{chargeDateLimit}元，
                    如果需要进行大额充值，请选择"网银充值"。
                  </p>
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className="checkbox-wrap">
            <Checkbox
              checked={this.state.isChecked}
              onChange={(e) => this.checkProtocol(e)}>
              我同意并接受
            </Checkbox>
            <a className="proto-name">《领投鸟投资咨询与管理服务电子协议》</a>
          </div>
          <p
            className={`recharge-submit ${disabled?'disabled':''}`}
            onClick={()=>{this.rechargeSubmit()}}>
            立即充值
          </p>
          <p className="vice-title">充值说明</p>
          <p className="recharge-explain">1.请注意您的浏览器对各银行网银的拦截，建议使用IE浏览器进行充值；</p>
          <p className="recharge-explain">2.各银行充值限额仅供参考，以银行官方公告为准，如疑详询银行客服热线；</p>
          <p className="recharge-explain">3.如果充值金额未及时到账，请与在线客服联系或拨打客服热线400-999-9980。</p>
        </div>
        <Modal
          visible={visible}
          title="您是否充值成功？"
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          wrapClassName="depost-confim-modal"
          closable={false}
          footer={[
            <Button key="back" size="large" onClick={() => this.handleCancel()}>帮助中心</Button>,
            <Button key="submit" type="primary" size="large" onClick={() => this.handleOk()}>
              是
            </Button>,
          ]}
          >
          <div className="confirm-content">
            <p>1）查看充值流水，请点击“是”按钮；</p>
            <p>2）建议您查看“帮助中心”页；</p>
            <p>3）<a onClick={() =>{this.goOnRechage()}}>继续充值>></a></p>
          </div>
        </Modal>
        <ModalDepost
          status={this.state.status}
          goUrl={this.state.goUrl}
          visible={this.state.showModal}
          closable='closable'
        />
      </AccountWrapModule>

    )
  }
}

export default RechargePage;
