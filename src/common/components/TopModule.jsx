// 公共头部
import React from 'react';
import { Link } from 'react-router-dom';

import user from '../../model/User';
import Cookies from '../../utils/Cookies';

import './TopModule.scss';
import codeImg from './imgs/top_code.png';
import arrowImg from './imgs/arrow_code.png'
import logoImg from './imgs/logo.jpg';
import sloginGif from './imgs/logo.gif';

class TopModule extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userInfo:user.userInfo
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      userInfo:user.userInfo
    })
  }
  // 退出登录
  loginOut(e) {
    Cookies.clearCookie();
    user.updateUserFromCookie();
    location.hash='/user/login';
    // this.props.history.push();
  }
  render() {
    const {userInfo}=this.state;
    return(
      <div className="components-top-content">
        <div className="top-module-content">
          <div className="top-wrap clear">
            <div className="part-l">
              <span className="kefu">客服电话：400-999-9980</span>
              <span className="ltn-iconfont icon-weixin">
                <span className="weixin-code">
                  <img src={arrowImg} className="arrow"></img>
                  <img src={codeImg}></img>
                </span>
              </span>
              <a href="http://weibo.com/u/5935757405" target="_blank" className="weibo-link">
                <span className="ltn-iconfont icon-weibo"></span>
              </a>
            </div>
            <div className="part-r">
              <p className="item">
                欢迎您！{userInfo.userName || userInfo.mobileNo}
              </p>
              <p className="item safe-loginOut" onClick={(e)=>this.loginOut(e)}>安全退出</p>
              <a href="/other/actlist" className="item">最新活动</a>
              <a href="/other/downloadapp" className="item">下载APP</a>
              <a href="/help/aboutltn" className="item">帮助中心</a>
            </div>
          </div>
        </div>
        <div className="nav-head-content">
          <div className="top-wrap clear">
            <div className="part-l">
              <a href="/" className="logo">
                <img src={logoImg}></img>
              </a>
              <img src={sloginGif} className="slogin-gif"></img>
            </div>
            <div className="part-r">
              <a href="/" className="item">首页</a>
              <a href="/finance/list/0/1/0/0" className="item">投资</a>
              <a href="http://bbs.lingtouniao.com" className="item" target="_blank">社区</a>
              <a href="/other/downloadapp" className="item">下载APP</a>
              <a href="/other/safeguards#0" className="item">安全保障</a>
              <Link to="/#/account/viewall" className="item account-item">我的账户</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TopModule;
