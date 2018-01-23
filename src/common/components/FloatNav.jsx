import React from 'react';
import { BackTop } from 'antd';
import './FloatNav.scss';

import codeImg from './imgs/code-weixin.png';

class FloatNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show:false};
    this.handleScroll = this.handleScroll.bind(this)
  }
  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll,true);
  }
  //scroll事件
  handleScroll() {
    let scrollTop = document.body.scrollTop;
     if(scrollTop > 100){
         this.setState({
             show : true
         })
     }else{
         this.setState({
             show : false
         })
     }
  }
  //回到顶部
  backTop() {
    document.body.scrollTop=0;
  }
  //触发客服
  openKeFu() {
    let e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.getElementById("udesk_btn").firstChild.dispatchEvent(e);
  }
  render() {
    return(
      <div className="float-left-nav-content">
        <div className="item-kefu" onClick={()=>this.openKeFu()}>
          <span className="ltn-iconfont icon-kefu"></span>
          <p className="server-text">在线<br/>咨询</p>
        </div>
        <div className="item-weixin">
          <span className="ltn-iconfont icon-qcode"></span>
          <p className="saoma-text">扫码关注</p>
          <img src={codeImg} className="code-img"></img>
        </div>
        <div
          className={`ltn-iconfont icon-top-arrow ${this.state.show?'show':''}`}
          onClick={()=>this.backTop()}></div>
      </div>
    )
  }
}


export default FloatNav;
