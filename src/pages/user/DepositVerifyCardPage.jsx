import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button } from 'antd';
import {
  depositPersionInfo,
  depositSendCodeData,
  depositBindCardData,
  personalInfo
} from '../../api/DataApi';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';

import './DepositComponent.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';

// 外部服务
import lodash from 'lodash';
// 本地服务
import Utils from '../../utils';
import user from '../../model/User';
import Cookies from '../../utils/Cookies';
const confirm = Modal.confirm;


class DepositVerifyCardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      bankName :Utils.searchFormat(this.props.location.search).bankName,//卡名
      gateId :Utils.searchFormat(this.props.location.search).gateId,//卡id
      cardId :Utils.searchFormat(this.props.location.search).cardValue,//卡号
      identityCard:'',//身份证
      mobileNo:'',//手机号
      mobileNoShow:'',//手机号发送显示
      userName:'',//用户名
      phoneCodeValue:'',//手机验证码
      errorText:'',
      visible:false,
      visible2:false,
      disabled:true,//按钮是否可点
      isSend:false,//短信验证码是否可点
      count: 60,
      getCodeText:'获取验证码',
      loading:false,
      loading2:false,
      changeMbStatus:false,//修改手机号状态
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  componentWillMount() {
    document.title='绑卡';
    this.getUserInfo()
  }
  //修改手机号 状态
  goChangeMb(){
    this.setState({
      changeMbStatus:!this.state.changeMbStatus
    })
  }
  //确定 修改手机号
  submitChangeMb() {
    let { changeMbStatus,mobileNoShow,mobileNo } =this.state;
    if(this.checkPhone()) {
      this.setState({
        changeMbStatus:!changeMbStatus,
        mobileNoShow:mobileNo
      })
    }
  }
  //验证码表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    if(eleId==0) {//修改手机号
      this.setState({
        mobileNo:value,
        visible2:false
      })
    } else if(eleId==1) {//手机验证码
      this.setState({
        phoneCodeValue:value,
        disabled:lodash.isEmpty(value),
        visible:false
      })
    }

  }
  //校验手机号码
  checkPhone() {
    const value = this.state.mobileNo;
    if(!RegExpUtil.mobile.test(value)) {
      this.setState({
        errorText:'请输入正确的手机号码',
        visible2:true
      })
      return false
    } else {
      return true;
    }
  }
  //校验手机验证码
  checkPhoneCode() {
    let value = this.state.phoneCodeValue;
    if(!RegExpUtil.phoneCode.test(value)) {
      this.setState({
        errorText:'请输入正确的手机验证码',
        visible:true
      })
      return false
    } else {
      return true;
    }
  }
  //获取绑卡人信息
  getUserInfo() {
    depositPersionInfo()
    .then((data)=>{
      this.setState({
        identityCard:data.idCard,
        mobileNo:data.mobileNo,
        mobileNoShow:data.mobileNo,
        userName:data.userName
      })
    },(error)=>{

    })
  }
  //倒计时
  handleClick() {
    const timer = setInterval(()=> {
        let count = this.state.count;
        count-=1;
        if(count<1) {
          window.clearInterval(timer);
          this.setState({
            isSend:true,
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
  //获取手机验证码
  getPhoneCode() {
    let { isSend,mobileNo } =this.state;
    if(!isSend) {
      this.setState({
        isSend:true,
        loading2:true
      });
      depositSendCodeData('3',mobileNo)
      .then((data)=>{
        this.setState({
          loading2:false
        })
        this.handleClick()
      })
      .catch((error)=>{
        this.setState({
          errorText:error.message,
          visible:true,
          loading2:false
        })
      })
    }
  }
  //去绑卡
  submit() {
    let {
      search,
      disabled,
      bankName,
      cardId,
      gateId,
      phoneCodeValue,
      mobileNo
     } =this.state;

    if(!disabled&&this.checkPhoneCode()) {
      this.setState({
        disabled:true,
        loading:true
      });

      depositBindCardData(bankName,cardId,gateId,phoneCodeValue,mobileNo)
      .then((data)=>{
        this.setState({
          disabled:true,
          loading:false
        });
        //更新用户消息
        personalInfo()
      })
      .then((data)=>{
        let backUrl = search.backUrl?search.backUrl:'/user/cardSuccess';
        this.props.history.push(backUrl);
      })
      .catch((error)=>{
        if(error.data.resultCode==10000021){
          this.props.history.push(backUrl);
        }else {
          let parmas=search.backUrl?`backUrl=${search.backUrl}`:'';
          if(error.data.resultCode==1) {
            confirm({
              title: '温馨提示',
              content: `${error.message}，请重新填写信息`,
              onOk:()=> {
                this.props.history.push(`/user/depostCard?${parmas}`);
              },
              onCancel() {},
            })
          } else {
            this.setState({
              errorText:error.message,
              visible:true,
            });
          }
          this.setState({
            disabled:true,
            loading:false
          });
        }
      })
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }
  render() {
    const { identityCard,mobileNo,mobileNoShow,userName,bankName,gateId,cardId } =this.state;
    return(
      <div className="deposit-component-page depost-verifycard-page">
        <DepositHead
          levelOne="银行卡验证"
          levelTwo="目前仅支持绑定一张本人名下的借记卡进行存管账户快捷充值、投资或提现等操作"
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
                <p className="key">绑卡类型</p>
                <p className="value">快捷支付银行卡</p>
              </div>
              <div className="row-ver">
                <p className="key">银行卡信息</p>
                <p className="value">{bankName}({cardId})</p>
              </div>
              <div className="row-ver row-five">
                <p className="key">银行预留手机号</p>
                <div className="value">
                  {
                    this.state.changeMbStatus?
                    <div>
                      <input
                        placeholder="请输入手机号"
                        maxLength="11"
                        data-id="0"
                        className="change-mobile-input"
                        onChange={this.changeEvent.bind(this)}/>
                        <span className="high-col go-change" onClick={this.submitChangeMb.bind(this)}>确定</span>
                      </div>
                    :
                    <div>
                      <span className="change-mb">{mobileNo}</span>
                      <span className="high-col go-change" onClick={this.goChangeMb.bind(this)}>修改</span>
                    </div>
                  }
                </div>
              </div>
              <ErrorText visible={this.state.visible2} className="error-text-wrap">
                {this.state.errorText}
              </ErrorText>
              <div className="tips-mb">
                请确认银行卡的预留手机号是否正确！
              </div>
            </div>
          </div>
          <div className="part-r">
            <div className="verfiy-right-content">
              <div className="form-content">
                <div className="row label-row-one">
                  <input
                    type="text"
                    maxLength="4"
                    data-id="1"
                    placeholder="请输入验证码"
                    className="code-input"
                    onChange={this.changeEvent.bind(this)}/>
                  <div className={`phone-code ${this.state.isSend?'disabled':''}`}>
                    <Button
                      type="primary"
                      loading={this.state.loading2}
                      onClick={this.getPhoneCode.bind(this)}>
                     {this.state.getCodeText}
                   </Button>
                  </div>
                </div>
                <ErrorText visible={this.state.visible}>
                  {this.state.errorText}
                </ErrorText>
                <p className="phone-text">验证码将发送到{mobileNoShow}</p>
                <div className={`submit-btn-row ${this.state.disabled?'disabled':''}`}>
                  <Button
                    type="primary"
                    loading={this.state.loading}
                    onClick={this.submit.bind(this)}>
                   申请开通
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

export default DepositVerifyCardPage;
