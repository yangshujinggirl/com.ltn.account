import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button,Checkbox } from 'antd';
import { changeAgreementState, changePassState,personalInfo } from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
import user from '../../model/User';
import Utils from '../../utils';

import Head from './comments/Head';
import Footer from './comments/Footer';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息

import './DepositComponent.scss';

const confirm = Modal.confirm;

class ChangePasswordStatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      identityCard: user.userInfo.idCard,//身份证
      mobileNo: user.userInfo.mobileNo,//手机号
      userName: user.userInfo.userName,//用户名
      phoneCodeValue:'',//手机验证码
      passCodeValue:'',//交易密码
      errorText:'',
      visible:false,
      disabled:true,
      isSend:false,
      count: 60,
      pageType: props.match.params.type,
      getCodeText:'获取验证码',
      loading2:false,
      loading:false,
      money:Utils.searchFormat(this.props.location.search).money
    }
  }
  componentWillMount() {
    document.title='重置支付密码';
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { passCodeValue,phoneCodeValue } =this.state;
    if(eleId==1) {
      passCodeValue=value;
    } else if(eleId==2) {
      phoneCodeValue=value;
    }
    let disabled =lodash.isEmpty(passCodeValue)||lodash.isEmpty(phoneCodeValue);
    this.setState({
      passCodeValue,
      phoneCodeValue,
      disabled,
      visible:false
    })
  }
  //表单校验
  checkForm() {
    let { passCodeValue,phoneCodeValue } =this.state;
    let errorText,visible=true;
    if(!RegExpUtil.payPassword.test(passCodeValue)){
      errorText='请输入6位数字密码';
    } else if(!RegExpUtil.phoneCode.test(phoneCodeValue)) {
      errorText='请输入正确的手机验证码';
    } else {
      errorText='';
      visible=false;
    }
    this.setState({
      errorText,
      visible
    })
    return {
      errorText,
      visible
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
          getCodeText:'获取验证码'
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
    if(!this.state.isSend) {
      this.setState({
        loading2:true,
        isSend:true
      })
      changeAgreementState()
      .then((data)=>{
        this.setState({
          loading2:false
        })
        this.handleClick()
      },(error)=>{
        this.setState({
          errorText:error.message,
          visible:true,
          isSend:false,
          loading2:false
        })
      })
    }
  }
  //充值
  toggleApi() {
    let { phoneCodeValue,passCodeValue,money } =this.state;
    this.setState({
      loading:true,
      disabled:false
    })
    const agreementCz = this.props.match.params.type === '0'?"0":"1";//0关闭，1开通
    changePassState(agreementCz,phoneCodeValue,passCodeValue)
    .then((data) =>{``
      this.setState({
        loading:false
      })
      //更新用户信息
      personalInfo()
    })
    .then((data)=>{
      let parmas = `money=${money}&&agreementCz=${agreementCz}`;
      if (agreementCz==="0"){
        location.hash=`/user/comfirmWithCode?${parmas}`;
      } else {
        location.hash=`/user/comfimrecharge?${parmas}`;
      }
    })
    .catch((error)=>{
      this.setState({
        errorText:error.data.resultMessage,
        visible:true,
        visible:true,
        loading:false,
        disabled:true
      });
    })
  }
  //切换免密充值状态
  changePassState(){
    if(this.state.disabled) {
      return false
    }
    let checkFormRes = this.checkForm();
    if(!checkFormRes.visible){
      this.toggleApi()
    }
  }

  //我要离开
  goLeave(){
    location.hash='/account/trade/recharge';
  }

  render() {
    const {
      identityCard,
      mobileNo,
      userName,
      pageType,
      passCodeValue,
      isSend,
      loading2,
      getCodeText,
      visible,
      errorText,
      disabled,
      loading
     } =this.state;
     const backUrl = `${this.props.location.pathname}?money=${this.state.money}`;
    return(
      <div className="deposit-component-page depost-verifycard-page">
        <Head
          title={pageType==='0'?"授权解约":"授权开通"}
          vice={pageType==='0'?"(关闭免密充值)":"(开通免密充值)"}
        />
        <div className="deposit-content-wrap clear">
          <div className="part-l">
            <div className="verfiy-left-content">
              <div className="row-ver">
                {
                  pageType==='0'?
                  <p className="key">解约协议</p>
                  :
                  <p className="key">签约协议</p>
                }
                <div className="value">
                  借记卡快捷免密协议
                  {
                    pageType==='1'&&
                    <div className="check-row-ver">
                      <Checkbox
                        checked='true'>
                        我已阅读并同意《免密服务协议》
                      </Checkbox>
                    </div>
                  }
                </div>
              </div>

              <div className="row-ver">
                <p className="key">商户信息</p>
                <p className="value">领投鸟</p>
              </div>
              <div className="row-ver">
                <p className="key">身份信息</p>
                <p className="value">{userName}({identityCard})</p>
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
                    value={passCodeValue}
                    data-id="1"
                    maxLength="6"
                    placeholder="请输交易密码"
                    className="code-input"
                    onChange={(e) => (this.changeEvent(e))}/>
                  <Link to={`/user/resetPsd?backUrl=${backUrl}`}>
                    <span className="forget-btn-enter">忘记密码</span>
                  </Link>
                </div>
                <div className="row">
                  <input
                    type="text"
                    maxLength="4"
                    data-id="2"
                    placeholder="请输入验证码"
                    className="code-input"
                    onChange={(e) => (this.changeEvent(e))}/>
                  <div className={`phone-code ${isSend?'disabled':''}`}>
                    <Button
                      type="primary"
                      loading={loading2}
                      onClick={this.getPhoneCode.bind(this)}>
                     {getCodeText}
                   </Button>
                  </div>
                </div>
                <ErrorText visible={visible} className="error-text-wrap">
                  {errorText}
                </ErrorText>
                <p className="phone-text">验证码发送到{mobileNo}</p>
                <div className={`submit-btn-row ${disabled?'disabled':''}`}>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={this.changePassState.bind(this)}>
                   确认
                 </Button>
                </div>
                <div className="go-leave-btn" onClick={()=>this.goLeave()}>我要离开</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default ChangePasswordStatePage;
