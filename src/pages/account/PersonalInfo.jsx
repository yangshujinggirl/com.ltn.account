import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { getPersonData } from '../../api/DataApi';
import user from '../../model/User';
import Utils from '../../utils';

import Head from './comments/Head';
import ModalDepost from './comments/Modal';
import AccountWrapModule from './comments/AccountWrapModule';

import './PersonalInfo.scss';
import greenStar from './imgs/personal/greenstar.png';
import yellowStar from './imgs/personal/yellowstar.png';
import noStar from './imgs/personal/nostar.png';
import redStar from './imgs/personal/redstar.png';
import phone from './imgs/personal/phone.png';
import cite from './imgs/personal/cite.png';
import lock from './imgs/personal/lock.png';
import card from './imgs/personal/card.png';

const confirm = Modal.confirm;

class PersonalInfoPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      personalInfo:{},
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:''//实名，密码是：1，绑卡：2
    }
  };

  componentWillMount(){
    document.title = '个人资料';
    this.getUserInfo();
  }
  //用户信息
  getUserInfo(){
    getPersonData().then(
      (data)=>{
        this.setState({
          personalInfo: data
        });
      },(error)=>{
        //TODO
        // if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
        //   location.hash=`/user/login?backUrl=${this.props.match.path}`;
        // }
      }
    )
  }
  //绑定事件
  // goEvent() {
  //   if(!user.isNameAuth()) {
  //     location.hash=`/user/depostReal/?backUrl=${this.props.match.path}`;
  //   } else if(!user.isSetPwd()) {
  //     location.hash=`/user/depostPsd/?backUrl=${this.props.match.path}`;
  //   } else if(!user.isBindCard()) {
  //     location.hash=`/user/depostCard/?backUrl=${this.props.match.path}`;
  //   }
  // }
  //去绑卡
  goEvent() {
    let backUrl = this.props.location.pathname;
    this.setState({
      showModal:Utils.goBindCardUrl(backUrl).visible,
      goUrl:Utils.goBindCardUrl(backUrl).goUrl,
      status:Utils.goBindCardUrl(backUrl).status
    })
  }
  render() {
    const { personalInfo,status,goUrl,showModal } = this.state;
    return(
      <AccountWrapModule itemId='6' {...this.props}>
        <div className="main-pages-wrap detail-personal-page">
          <Head title="个人资料"/>
          {
            personalInfo.totleNum === '2' &&<div className="safe-star-contain cf">
              <span>安全级别</span>
              <img src={redStar} alt="安全级别低" />
              <img src={redStar} alt="安全级别低" />
              <img src={noStar} alt="安全级别低" />
              <img src={noStar} alt="安全级别低" />
              <img src={noStar} alt="安全级别低" />
              <span className="right">账户安全等级为低，请继续验证，提高安全等级！</span>
            </div>
          }
          {
            personalInfo.totleNum === '3' &&<div className="safe-star-contain cf">
              <span>安全级别</span>
              <img src={yellowStar} alt="安全级别中" />
              <img src={yellowStar} alt="安全级别中" />
              <img src={yellowStar} alt="安全级别中" />
              <img src={noStar} alt="安全级别中" />
              <img src={noStar} alt="安全级别中" />
              <span className="right">账户安全等级为中，请继续验证，提高安全等级！</span>
            </div>
          }
          {
            personalInfo.totleNum === '4' &&<div className="safe-star-contain cf">
              <span>安全级别</span>
              <img src={yellowStar} alt="安全级别中" />
              <img src={yellowStar} alt="安全级别中" />
              <img src={yellowStar} alt="安全级别中" />
              <img src={yellowStar} alt="安全级别中" />
              <img src={noStar} alt="安全级别中" />
              <span className="right">账户安全等级为中，请继续验证，提高安全等级！</span>
            </div>
          }
          {
            personalInfo.totleNum === '5' &&<div className="safe-star-contain cf">
              <span>安全级别</span>
              <img src={greenStar} alt="安全级别高" />
              <img src={greenStar} alt="安全级别高" />
              <img src={greenStar} alt="安全级别高" />
              <img src={greenStar} alt="安全级别高" />
              <img src={greenStar} alt="安全级别高" />
              <span className="right">您的账户安全等级非常高！</span>
            </div>
          }
          <div className="info-wrap">
            <div className="list cf">
              <span className="icon">
                <img src={phone} alt="phone" />
              </span>
              <span className="name">手机验证</span>
              <span>已绑定</span>
              <div className="right">
                <p>{personalInfo.mobileNo}</p>
                <p>(手机号一经注册就不能更改)</p>
              </div>
            </div>
            {
              personalInfo.nameAuthStatus === '0'&&<div className="list cf">
                <span className="icon">
                  <img src={cite} alt="身份" />
                </span>
                <span className="name">身份认证</span>
                <span className="no-certificate">未认证</span>
                <span>完成身份认证才能投标和借款</span>
                <span className="edit" onClick={()=>this.goEvent()}>去认证</span>
              </div>
            }
            {
              personalInfo.nameAuthStatus === '1'&&<div className="list cf">
                <span className="icon">
                  <img src={cite} alt="身份" />
                </span>
                <span className="name">身份认证</span>
                <span>已认证</span>
                <div className="right">
                  <p>{personalInfo.userName}({personalInfo.idCard})</p>
                  <p>身份证不允许修改、更换或注销</p>
                </div>
              </div>
            }
            <div className="list cf">
              <span className="icon">
                <img src={lock} alt="登录密码" />
              </span>
              <span className="name">登录密码</span>
              <span>已设置</span>
              <Link to={`/user/changeLoginPsd/?backUrl=${this.props.match.path}`} className="edit">修改</Link>
            </div>
            {
              personalInfo.pwdAuthStatus === '1'&&<div className="list cf">
                <span className="icon">
                  <img src={lock} alt="交易密码" />
                </span>
                <span className="name">交易密码</span>
                <span>已设置</span>
                <Link to={`/user/resetPsd/?backUrl=${this.props.match.path}`} className="edit">修改</Link>
              </div>
            }
            {
              personalInfo.pwdAuthStatus === '0'&&<div className="list cf">
                <span className="icon">
                  <img src={lock} alt="交易密码" />
                </span>
                <span className="name">交易密码</span>
                <span className="no-certificate">未设置</span>
                <span>交易密码可以提高非免密交易的安全</span>
                <span className="edit" onClick={()=>this.goEvent()}>去设置</span>
              </div>
            }
            {
              personalInfo.bankAuthStatus === '0'&&<div className="list cf">
                <span className="icon">
                  <img src={card} alt="银行卡" />
                </span>
                <span className="name">银行卡</span>
                <span className="no-certificate">未绑定</span>
                <span>提现，快捷充值须先绑定银行卡</span>
                <span className="edit" onClick={()=>this.goEvent()}>去绑定</span>
              </div>
            }
            {
              personalInfo.bankAuthStatus === '1'&&<div className="list cf">
                <span className="icon">
                  <img src={card} alt="银行卡" />
                </span>
                <span className="name">银行卡</span>
                <span>已绑定</span>
                <Link to='/account/card' className="edit">管理</Link>
              </div>
            }
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

export default PersonalInfoPage;
