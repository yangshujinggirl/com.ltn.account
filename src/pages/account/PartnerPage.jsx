import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

import { Modal } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Head from './comments/Head';
import {
  getPartnerData,
  addPartnerData,
  depositPersionInfo,
  generateToken,
  personalInfo
} from '../../api/DataApi';
import user from '../../model/User';
const Accounting = require("accounting");
import AccountWrapModule from './comments/AccountWrapModule';

import './PartnerPage.scss';
import normalParImg from './imgs/partner_icon1.png';
import goldParImg from './imgs/partner_icon2.png';
import shareWay0 from './imgs/partner_share_icon0.png';
import shareWay1 from './imgs/partner_share_icon1.png';
import shareWay2 from './imgs/partner_share_icon2.png';
import shareWay3 from './imgs/partner_share_icon3.png';
import shareWay4 from './imgs/partner_share_icon4.png';
import shareWay5 from './imgs/partner_share_icon5.png';
import shareWenzi from './imgs/partner_share_wenzi.png';
import shareLogo from './imgs/partner_share_logo.png';
import zhuceImg from './imgs/partner_keypoint_zhuce.png';

class CaseOne extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      mobileValue:'',
      errorText:''
    }
  }
  changeEvent(event) {
    let value=event.target.value;
    this.setState({
      mobileValue:value
    })
  }
  //校验手机号码
  checkPhone() {
    const value = this.state.mobileValue;
    const regExp = /^1[34578]\d{9}$/;
    if(value.length<11||!regExp.test(value)) {
      this.setState({
        errorText:'请输入正确的手机号码'
      })
      return false
    } else {
      return true;
    }
  }
  submit() {
    if(this.checkPhone()) {
      addPartnerData(this.state.mobileValue)
      .then((data)=>{
        location.reload();
      },(error)=>{
        this.setState({
          errorText:error.message
        })
      })
    }
  }
  render() {
    return(
      <div className="case-one">
        <p className="key">您的推荐人：</p>
        <input
          type="text"
          maxLength="11"
          placeholder="请输入您要补充的推荐人手机号"
          onChange={this.changeEvent.bind(this)}
          className="input"/>
        <button className="recomend-btn" onClick={this.submit.bind(this)}>确定</button>
        <p className="little-tips">补充推荐人，可获得一张10%的加息券！</p>
        <div className="error-text">{this.state.errorText}</div>
      </div>
    )
  }
}
const CaseTwo=()=>(
  <div className="case-two">
    <span className="yuangong">内部员工</span>
    <span className="tips">
      您为内部员工无法补充推荐人，但是您可以推荐其他好友，成为他们的推荐人！
    </span>
  </div>
)
const CaseThr=()=>(
    <div className="case-thr">
      <span className="yuangong">代理商</span>
      <span className="tips">
      您为内部员工无法补充推荐人，但是您可以推荐其他好友，成为他们的推荐人！
      </span>
    </div>
)
const CaseFour=({data})=>(
  <div className="case-four">
    <p className="key">您的推荐人：</p>
    <span className="value">{data}</span>
  </div>
)

class PartnerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partnerData:{},
      mobileNo:'',
      copied:false,
      copyValue:''
    }
  }
  componentWillMount() {
    document.title = '我是合伙人';
    personalInfo();
    this.getMobile()
    this.getPartner()
  }
  //获取个人手机号打码
  getMobile() {
    generateToken()
    .then((data)=>{
      this.setState({
        mobileNo:data.token,
        copyValue:`一起来理财吧！领投鸟，注册实名并绑卡，送你618元返现券。呼朋好友来注册，http://192.168.18.196/account/#/user/login?mobile=${data.token}`
      })
    },(error)=>{

    })
  }
  //合伙人信息
  getPartner() {
    getPartnerData()
    .then((data)=>{
      this.setState({
        partnerData:data
      })
    },(error)=>{

    })
  }
  goCopy() {
    this.setState({
      copied:true
    })
    Modal.success({
     title: '恭喜您，复制成功！',
     content: '您可以通过QQ，微信，短信等方式，将邀请链接发送给您的好友！',
    });
  }
  render() {
    const { partnerData,copyValue }=this.state;
    const weinxinCode=`https://www.lingtouniao.com/static/html/invitation/mystery.html?mobile=${user.userInfo.mobileNo}`;
    let Mod;
    let showEvent=()=> {
      if(partnerData.isStaff==1) {
        Mod=CaseTwo;
      } else if(partnerData.isStaff==2) {
        Mod=CaseThr;
      } else if(partnerData.isPartnerUp==1) {
        Mod=CaseFour
      } else {
        Mod=CaseOne;
      }
    }
    showEvent();
    return(
      <AccountWrapModule itemId='13' {...this.props}>
        <div className="main-pages-wrap partner-page">
          <Head title="我是合伙人"/>
          <div className="content-action">
            <div className="partner-pandect">
              <div className="part-one">
                <div className="total-account">
                  <p className="key">
                    合伙人累计奖励(元)
                    <Link to='/account/awardDetail' className="go-award">>></Link>
                  </p>
                  <p className="value">
                    {Accounting.formatMoney(partnerData.totalReward,{symbol:''})}
                  </p>
                </div>
              </div>
              <div className="part-two">
                <div className="level-row-process">
                  <div className="name-l">合伙人等级</div>
                  <div className="level-r">
                    <div className="pro-line"></div>
                    <div
                      className={
                        `real-time-pro
                        ${partnerData.userLerver=='普通合伙人'?'levelOne':(partnerData.userLerver=='金牌合伙人'?'levelTwo':'')}`}></div>
                    <div className="circle-list clear">
                      <span className="cir-ite"></span>
                      <span className="cir-ite"></span>
                      <span className="cir-ite"></span>
                      <span className="cir-ite"></span>
                      <span className="cir-ite"></span>
                      <span className="cir-ite"></span>
                    </div>
                    <div className={`level-status sta-one  ${partnerData.userLerver=='1001'?'current':''}`}>
                      LV1
                      <span className="par-lev">普通合伙人</span>
                    </div>
                    <div className={`level-status sta-two  ${partnerData.userLerver=='1002'?'current':''}`}>
                      LV2
                      <span className="par-lev">金牌合伙人</span>
                    </div>
                    <div className="level-status sta-thr">
                      LV3
                      <span className="par-lev">未完待续...</span>
                    </div>
                  </div>
                </div>
                <div className="level-row-value">
                  <p className="it">
                    累计一级好友奖励(元) ：
                    <span className="value">
                      {Accounting.formatMoney(partnerData.fatherReward,{symbol:''})}
                    </span>
                  </p>
                  <p className="it">
                    累计二级好友奖励(元) ：
                    <span className="value">
                      {Accounting.formatMoney(partnerData.grandfatherReward,{symbol:''})}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="partner-introduce clear">
              <div className="ite">
                <div className="ll">
                  <img src={normalParImg}></img>
                  <p className="leve-name">普通合伙人</p>
                </div>
                <div className="rr">
                  推荐者本人进行过一次投资（仅限固收），并推荐一个好友完成绑卡后，即成为平台的普通合伙人。 可以获得：
                  <p className="rows">一级好友每次投资<span className="high-col">固收类产品收益的7%</span>的平台奖励，按日计提。</p>
                  <p className="rows">二级好友每次投资<span className="high-col">固收类产品收益的3%</span>的平台奖励，按日计提。</p>
                </div>
              </div>
              <div className="ite clear">
                <div className="ll">
                  <img src={goldParImg}></img>
                  <p className="leve-name">金牌合伙人</p>
                </div>
                <div className="rr">
                  推荐者本人进行过一次投资（仅限固收），并推荐三个好友完成绑卡后，即升级为平台的金牌合伙人。 可以获得：
                  <p className="rows">
                    一级好友每次投资<span className="high-col">固收类产品收益的10%</span>的平台奖励，按日计提。
                  </p>
                  <p className="rows">
                    二级好友每次投资<span className="high-col">固收类产品收益的3%</span>的平台奖励，按日计提。
                  </p>
                </div>
              </div>
            </div>
            <div className="get-partner-ways">
              <p className="get-title">轻松三步做合伙人：</p>
              <div className="ways-wrap">
                <div className="ways-list">
                  <div className="tt">
                    <CopyToClipboard
                      text={copyValue}
                      onCopy={()=> this.goCopy()}>
                        <img src={shareWay0} className="share-icon" />
                    </CopyToClipboard>
                  </div>
                  <div className="tt weixin-tt">
                    <img src={shareWay1} className="share-icon" />
                    <div className="share-weixin clear">
                      <div className="code-wrap">
                        <QRCode value={weinxinCode} />
                      </div>
                      <div className="r-intro">
                        <p className="tit">扫描分享额外福利</p>
                        <p>
                          扫描分享，好友打开分享链接注册成功后，好友可获得10000元体验金和10元返现券，投资成功后，你将成为合伙人并获得合伙人奖励。
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="tt">
                    <a
                      className="share-link-url"
                      target="_blank"
                      href="http://connect.qq.com/widget/shareqq/index.html?url=/user/register/&title=领投鸟，筑家，助赢&desc=领投鸟(lingtouniao.com)，中国不动产理财领导者，时间短，收益高，期限5天-6个月，任选，现在注册就送518元红包哟。&summary=领投鸟(lingtouniao.com)，中国不动产理财领导者，时间短，收益高，期限5天-6个月，任选，现在注册就送518元红包。&site=领投鸟理财&pics=http://www.lingtouniao.com/html/img/favicon.ico'">
                      <img src={shareWay2} className="share-icon" />
                    </a>
                  </div>
                  <div className="tt">
                     <a
                       className="share-link-url"
                       target="_blank"
                       href="http://v.t.sina.com.cn/share/share.php?url=/user/register/&amp;title=领投鸟(lingtouniao.com)，中国不动产理财领导者，时间短，收益高，期限5天-6个月，任选，现在注册就送518元红包。&amp;pic=http://www.funet8.com/wp-content/uploads/file/jimixiu-pi.jpg">
                       <img src={shareWay3} className="share-icon"/>
                     </a>
                  </div>
                  <div className="tt">
                    <a
                      className="share-link-url"
                      target="_blank"
                      href="
                      https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=/user/register/&title=领投鸟(lingtouniao.com)，中国不动产理财领导者，时间短，收益高，期限5天-6个月，任选，现在注册就送518元红包。&pic=undefined&content=我在领投鸟玩理财，年化收益率最高18%，期限灵活，现在注册就送10000元体验金，你也玩一下吧！">
                      <img src={shareWay4} className="share-icon" />
                    </a>
                  </div>
                  {/* <div className="tt">
                    <a
                      className="share-link-url"
                      target="_blank" href="http://share.v.t.qq.com/index.php?c=share&amp;a=index&amp;url=/user/register/&amp;title=好玩吧分享到腾讯微博&amp;pic=http://www.funet8.com/wp-content/uploads/file/jimixiu-pi.jpg">
                      <img src={shareWay5} className="share-icon" />
                    </a>
                  </div> */}
                </div>
                <img src={shareWenzi}></img>
              </div>
            </div>
            <div className="recommend-award-content">
              <p className="info-one">
                推荐人： 推荐者完成一次投资后(无论活期/固收)，每次推荐一个好友完成固定收益类投资，那么推荐者即可获得10鸟币。
              </p>
              <Mod data={partnerData.sysUserName}/>
              <div className="info-two">
                被推荐人： 被推荐人获得一张10%的加息券，可用于购买固定类产品（非活期），投资时使用该加息券，投资收益可增加10%。
              </div>
              <div className="label">推荐有奖</div>
            </div>
            <div className="static-recomend">
              <p className="title">
                好友通过您的链接注册，对方注册界面会显示推荐人为“您的手机号”！请把上面的链接发送给您的好友，邀请他注册吧！
              </p>
              <img src={shareLogo}/>
              <img src={zhuceImg}/>
              <div className="label">有效推荐确认关键点</div>
            </div>
          </div>
        </div>
      </AccountWrapModule>
    )
  }
}

export default PartnerPage;
