import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button,Icon } from 'antd';
import {
  confirmRechargeSendPhone,
  changePassState,
  rechargeMoney
} from '../../api/DataApi';

// 外部服务
import lodash from 'lodash';
import user from '../../model/User';
import Utils from '../../utils';
import RegExpUtil from '../../api/RegExpUtil';

const Accounting = require("accounting");
import Head from './comments/Head';
import Footer from './comments/Footer';
import ErrorText from '../comments/ErrorText';//错误消息
import './DepositComponent.scss';

const confirm = Modal.confirm;

class ComfirmRechageWithCodePage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      identityCard: user.userInfo.idCard,//身份证号码
      bankName: user.userInfo.belongBank,//绑定银行名称
      userName: user.userInfo.userName,//用户名
      idCard: user.userInfo.idCard,//身份证
      cardId: user.userInfo.bankNo,//银行卡号
      money: Utils.searchFormat(this.props.location.search).money,//充值金额
      mobileNo: user.userInfo.mobileNo,//手机号码
      phoneCodeValue:'',//手机验证码
      errorText:'',//错误信息
      errorVisible:false,//错误信息
      disabled:true,//是否可以点击充值按钮
      isSend:false,
      count: 60,//倒计时
      getCodeText:'获取验证码',
      loading:false,
      loading2:false,
      visible:false,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  componentWillMount() {
    document.title='确认充值';
  }
  //表单改变事件（手机验证码）
  changeEvent(event) {
    let value = lodash.trim(event.target.value);
    this.setState({
      phoneCodeValue:value,
      disabled: lodash.isEmpty(value),
      errorVisible:false
    })
  }

  //校验手机验证码
  checkPhoneCode() {
    let value = this.state.phoneCodeValue;
    if(!RegExpUtil.phoneCode.test(value)) {
      this.setState({
        errorText:'请输入正确的手机验证码',
        errorVisible:true
      })
      return false
    } else {
      return true;
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
    let { isSend,money } =this.state;
    if(!isSend) {
      this.setState({
        loading2:true,
        isSend:true
      })
      confirmRechargeSendPhone(money)
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
          loading2:false,
        })
      })
    }
  }

  //我要离开
  abandon(){
    location.hash='/account/viewall';
  }
  rechargeApi() {
    let { money,phoneCodeValue } =this.state;
    this.setState({
      loading:true,
      disabled:true
    })
    rechargeMoney(money,'DEBITCARD','',phoneCodeValue)
    .then((data)=>{
      this.setState({
        loading:false,
        visible:true
      });
    },(err)=>{
      this.setState({
        errorText:err.message,
        errorVisible:true,
        loading:false
      })
    })
  }
  //确认充值页面
  comfirmRecharge(){
    if(!this.state.disabled&&this.checkPhoneCode()) {
      this.rechargeApi()
    }
  }
  goNext(url){
    location.hash=url;
  }
  render() {
    const {
      identityCard,
      mobileNo,
      userName,
      bankName,
      cardId,
      money,
      isSend,
      loading2,
      getCodeText,
      errorVisible,
      errorText,
      disabled,
      loading,
      visible
     } =this.state;
    return(
      <div className="deposit-component-page depost-verifycard-page">
        <Head
          title="快捷充值"
          vice="(非免密充值)"
        />
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
                <p className="value">{bankName}({cardId})</p>
              </div>
              <div className="row-ver">
                <p className="key">充值金额</p>
                <p className="value">
                  {Accounting.formatMoney(money,{symbol:''})}元
                </p>
              </div>
              <div className="row-ver">
                <p className="key">手续费</p>
                <p className="value">0.00元（商户承担）</p>
              </div>
              <div className="row-ver">
                <p className="key">交易金额</p>
                <p className="value">
                  {Accounting.formatMoney(money,{symbol:''})}元
                </p>
              </div>
            </div>
          </div>
          <div className="part-r">
            <div className="verfiy-right-content">
              <div className="form-content">
                <div className="row">
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="请输入验证码"
                    className="code-input" onChange={(e) => (this.changeEvent(e))}/>
                  <div className={`phone-code ${isSend?'disabled':''}`}>
                    <Button
                      type="primary"
                      loading={loading2}
                      onClick={this.getPhoneCode.bind(this)}>
                     {getCodeText}
                   </Button>
                  </div>
                </div>
                <ErrorText visible={errorVisible}>
                  {errorText}
                </ErrorText>
                <p className="phone-text">验证码发送到{mobileNo}</p>
                <div className={`submit-btn-row ${disabled?'disabled':''}`}>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={this.comfirmRecharge.bind(this)}>
                   确认
                 </Button>
                </div>
                <div className="go-leave-btn" onClick={()=>this.abandon()}>我要离开</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Modal
          title="恭喜您，充值完成！"
          visible={visible}
          onOk={()=>this.goNext("/account/viewall")}
          onCancel={()=>this.goNext("/account/trade")}
          okText="完成"
          cancelText="充值记录"
          wrapClassName="depost-confim-modal"
          closable={false}
        >
          <div className="confirm-content">
            <p>1）完成充值，返回“账户中心”请点击“完成”按钮；</p>
            <p>2）查看充值流水，请点击“充值流水”按钮；</p>
            <p>3）<Link to='/account/trade/recharge'>继续充值>></Link></p>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ComfirmRechageWithCodePage;
