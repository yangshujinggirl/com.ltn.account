import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button } from 'antd';
import {
  drawMoneySendPhone,
  withDrawMoney,
  getwithdrawalsTimeApi
} from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
import user from '../../model/User';
import Utils from '../../utils';

import Head from './comments/Head';
import Footer from './comments/Footer';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息

import './DepositComponent.scss';
const Accounting = require("accounting");
const confirm = Modal.confirm;

class ComfirmDrawMoneyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      identityCard: user.userInfo.idCard,//身份证
      mobileNo: user.userInfo.mobileNo,//手机号
      userName: user.userInfo.userName,//用户名
      belongBank: user.userInfo.belongBank,//银行卡名称
      bankNo: user.userInfo.bankNo,//银行卡号码
      drawMoney: Utils.searchFormat(this.props.location.search).drawMoney,//提现金额
      actualMoney: Utils.searchFormat(this.props.location.search).actualMoney,//实际到账金额
      drawMoneyFee: Utils.searchFormat(this.props.location.search).drawMoneyFee,//手续费
      accountingDate:'',//到账时间
      phoneCodeValue:'',//手机验证码
      passCodeValue:'',//交易密码
      errorText:'',
      errorVisible:false,
      visible: false,
      disabled:true,
      isSend:false,
      count: 60,
      pageType: props.match.params.type,
      getCodeText:'获取验证码',
      loading:false,
      loading2:false,
      withdrawalsTime:''
    }
  }
  componentWillMount() {
    document.title='确认提现';
    this.getwithdrawalsTime()
  }
  getwithdrawalsTime() {
    getwithdrawalsTimeApi()
    .then(data=>{
      this.setState({
        withdrawalsTime:data.withdrawalsPromptMessage
      })

    })
  }
  //表单改变事件（密码）
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { passCodeValue,phoneCodeValue } =this.state;
    if(eleId==1) {
      passCodeValue=value;
    } else if(eleId==2) {
      phoneCodeValue=value;
    }
    let disabled=lodash.isEmpty(passCodeValue)||lodash.isEmpty(phoneCodeValue);
    this.setState({
      passCodeValue,
      phoneCodeValue,
      disabled,
      errorVisible:false
    })
  }
  //提交表单
  checkForm() {
    let { phoneCodeValue,passCodeValue }=this.state;
    let errorText,errorVisible=true;
    if(!RegExpUtil.phoneCode.test(phoneCodeValue)) {
      errorText='请输入正确的手机验证码';
    } else if(!RegExpUtil.payPassword.test(passCodeValue)) {
      errorText='请输入6位数字密码';
    } else {
      errorText='';
      errorVisible=false;
    }
    this.setState({
      errorText,
      errorVisible
    })
    return {
      errorText,
      errorVisible
    }
  }
  //倒计时
  handleClick() {
    const timer = setInterval(()=> {
      let count = this.state.count;
      count-=1;
      if(count<1) {
        window.clearInterval(timer);
        this.setState({
          isSend:false,
          count:60,
          getCodeText:'重新获取'
        });
      } else {
        this.setState({
          count,
          getCodeText:`${count}秒后重发`
        });
      }
    },1000)
  }
  //获取图形验证码
  getPhoneCode() {
    let { isSend,drawMoney } =this.state;
    if(!isSend) {
      this.setState({
        isSend:true,
        loading2:true
      })
      drawMoneySendPhone(drawMoney)
      .then((data)=>{
        this.setState({
          loading2:false
        })
        this.handleClick()
      },(error)=>{
        this.setState({
          errorText:error.message,
          errorVisible:true,
          isSend:false,
          loading2:false
        })
      })
    }
  }
  //提现确认Api
  DrawMoneyApi() {
    let {
      phoneCodeValue,
      drawMoney,
      passCodeValue,
      withdrawType
    } =this.state;
    this.setState({
      disabled:true,
      loading:true
    })
    withDrawMoney(phoneCodeValue,drawMoney,passCodeValue)
    .then((data) =>{
      this.setState({
        disabled:false,
        loading:false,
        accountingDate:data.withdrawalsPromptMessage
      })
      this.showModal();
    },(err) =>{
      this.setState({
        loading:false,
        errorText:err.message,
        errorVisible:true,
      })
    })
  }
  //提交 提现确认
  drawMoneySubmit(){
    if(this.state.disabled){
      return false
    }
    let checkFormRes = this.checkForm();
    if(!checkFormRes.errorVisible){
      this.DrawMoneyApi()
    }
  }
  //我要离开
  abandon(){
    location.hash='/account/trade/recharge';
  }
  //网银充值是否成功弹窗
  showModal(){
    this.setState({
      visible: true,
    });
  }
  //账户中心
  handleOk = () => {
    this.setState({ loading: false, visible: false });
    location.hash="/account/viewall";
  }
  //提现流水
  handleCancel = () => {
    this.setState({ visible: false });
    location.hash="/account/trade";
  }
  render() {
    const {
      identityCard,
      mobileNo,
      userName,
      belongBank,
      bankNo,
      drawMoney,
      actualMoney,
      drawMoneyFee,
      visible,
      accountingDate,
      withdrawalsTime
     } =this.state;
    return(
      <div className="deposit-component-page depost-verifycard-page">
        <Head title="提现确认"/>
        <div className="deposit-content-wrap clear">
          <div className="part-l">
            <div className="verfiy-left-content">
              <div className="row-ver">
                <p className="key">商户名称</p>
                <p className="value">领投鸟</p>
              </div>
              <div className="row-ver">
                <p className="key">身份信息</p>
                <p className="value">{userName}({identityCard})</p>
              </div>
              <div className="row-ver">
                <p className="key">银行卡信息</p>
                <p className="value">{belongBank}({bankNo})</p>
              </div>
              <div className="row-ver">
                <p className="key">提现金额</p>
                <p className="value">
                  {Accounting.formatMoney(drawMoney,{symbol:''})}
                </p>
              </div>
              <div className="row-ver">
                <p className="key">手续费</p>
                <p className="value">
                  {Accounting.formatMoney(drawMoneyFee,{symbol:''})}元
                </p>
              </div>
              <div className="row-ver">
                <p className="key">到账金额</p>
                <p className="value">
                  {Accounting.formatMoney(actualMoney,{symbol:''})}
                </p>
              </div>
              <div className="row-ver">
                <p className="key">预计到账时间</p>
                <p className="value high-col">
                  {withdrawalsTime}
                </p>
              </div>
            </div>
          </div>
          <div className="part-r">
            <div className="verfiy-right-content">
              <p className="verfiy-title">华瑞银行资金存管支付密码，非您银行卡的交易密码</p>
              <div className="form-content">
                <div className="row">
                  <input
                    type="password"
                    data-id="1"
                    maxLength="6"
                    value={this.state.passCodeValue}
                    placeholder="请输交易密码"
                    className="code-input" onChange={(e) => (this.changeEvent(e))}/>
                  <a href="/#/user/resetPsd">
                    <span className="phone-code pass-code">忘记密码</span>
                  </a>
                </div>
                <div className="row">
                  <input
                    type="text"
                    maxLength="4"
                    data-id="2"
                    placeholder="请输入验证码"
                    className="code-input" onChange={(e) => (this.changeEvent(e))}/>
                  <div className={`phone-code ${this.state.isSend?'disabled':''}`}>
                    <Button
                      type="primary"
                      loading={this.state.loading2}
                      onClick={this.getPhoneCode.bind(this)}>
                     {this.state.getCodeText}
                   </Button>
                  </div>
                </div>
                <ErrorText visible={this.state.errorVisible}>
                  {this.state.errorText}
                </ErrorText>
                <p className={`phone-text ${this.state.isSend?'':'disabled'}`}>验证码发送到{mobileNo}</p>
                <div className={`submit-btn-row ${this.state.disabled?'disabled':''}`}>
                  <Button
                    type="primary"
                    loading={this.state.loading}
                    onClick={this.drawMoneySubmit.bind(this)}>
                   确认
                 </Button>
                </div>
                <div className="go-leave-btn" onClick={this.abandon}>我要离开</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Modal
          visible={visible}
          title="恭喜您！提现成功"
          wrapClassName="depost-confim-modal"
          onOk={() => this.handleOk()}
          closable={false}
          footer={[
            <Button key="back" size="large" onClick={() => this.handleCancel()}>
              提现记录
            </Button>,
            <Button key="submit" type="primary" size="large" onClick={() => this.handleOk()}>
              完成
            </Button>,
          ]}
        >
          <div className="confirm-content">
          <p>1）完成提现，返回账户中心请点击“完成”按钮；</p>
          <p>2）查看提现流水，请点击“提现记录”按钮；</p>
          <p>3）<Link to="/account/trade/drawmoney">继续提现>></Link></p>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ComfirmDrawMoneyPage;
