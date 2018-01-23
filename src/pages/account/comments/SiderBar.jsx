import React from 'react';
import { Link } from 'react-router-dom';
// 本地服务
import user from '../../../model/User';
import Utils from '../../../utils';
import Cookies from '../../../utils/Cookies';

import './SiderBar.scss';

import leveImg0 from './imgs/account_left_leve0.png';
import leveImg1 from './imgs/account_left_leve1.png';
import leveImg2 from './imgs/account_left_leve2.png';
import leveImg3 from './imgs/account_left_leve3.png';
import leveImg4 from './imgs/account_left_leve4.png';
import iconMb from './imgs/icon-mb.png';
import iconMb0 from './imgs/icon-mb0.png';
import iconReal from './imgs/icon-real.png';
import iconReal0 from './imgs/icon-real0.png';
import iconCard from './imgs/icon-card.png';
import iconCard0 from './imgs/icon-card0.png';

const CodeMap={
'1000':'普通用户',
'1001':'普通合伙人',
'1002':'金牌合伙人',
'1003':'钻石合伙人'
}
//头部用户信息
class TopUserInfo extends React.Component {
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
  //去绑卡
  goBindCard() {

    if(!user.isNameAuth()) {
      location.hash=`/user/depostReal/?backUrl=${this.props.location.pathname}`;
    } else if(!user.isSetPwd()) {
      location.hash=`/user/depostPsd/?backUrl=${this.props.location.pathname}`;
    } else {
      location.hash=`/user/depostCard/?backUrl=${this.props.location.pathname}`;
    }
  }
  //去实名
  goRealName() {
    location.hash=`/user/depostReal/?backUrl=${this.props.location.pathname}`
  }
  render() {
    let { userInfo } = this.state;
    let getLevelImg=()=> {
      if(userInfo.isStaff=='2') {
        return <img src={leveImg4}/>
      }else if(userInfo.userLerver=='1000') {
        return <img src={leveImg0}/>
      }else if(userInfo.userLerver=='1001') {
        return <img src={leveImg1}/>
      }else if(userInfo.userLerver=='1002') {
        return <img src={leveImg2}/>
      }else if(userInfo.userLerver=='1003') {
        return <img src={leveImg3}/>
      }
    }
    return(
      <div className="user-info-content">
        <div className="mascot"></div>
        <div className="info-list">
          <p className="welcome">
            您好，
            <span className="add-thick">
              { userInfo.userName||userInfo.mobileNo }
            </span>
          </p>
          <div className="level-status">
            {
              getLevelImg()
            }
            <span className="partner">
            {
              userInfo.isStaff=='2'?'合作伙伴'
              :
              CodeMap[userInfo.userLerver]
            }
            </span>
          </div>
        </div>
        <div className="status-user clear">
          <div className="item">
            <img src={iconMb}></img>
            <span className="tips">已登录</span>
          </div>
          {
            user.isNameAuth()?
            <div className="item">
              <img src={iconReal}></img>
              <span className="tips">已开户</span>
            </div>
            :
            <div className="item" onClick={()=>this.goRealName()}>
              <img src={iconReal0}></img>
              <span className="tips">未开户</span>
            </div>
          }
          {
            user.isBindCard()?
            <div className="item">
              <img src={iconCard}></img>
              <span className="tips">已绑卡</span>
            </div>
            :
            <div className="item" onClick={()=>this.goBindCard()}>
              <img src={iconCard0}></img>
              <span className="tips">未绑卡</span>
            </div>
          }

        </div>
      </div>
    )
  }
}
//type 0:导航可点,1:标题可点,2:标题不可点
const navList =[
  {
    text:'账户总览',
    itemId:0,
    router:'/account/viewall',
    type:'1'
  },
  {
    text:'资金管理',
    itemId:'',
    router:'',
    type:'2'
  },
  {
    text:'资金明细',
    itemId:1,
    router:'/account/detailmoney',
    type:'0'
  },
  {
    text:'充值提现',
    itemId:2,
    router:'/account/trade',
    type:'0'
  },
  {
    text:'我的银行卡',
    itemId:3,
    router:'/account/card',
    type:'0'
  },
  {
    text:'我的投资',
    itemId:'',
    router:'',
    type:'2'
  },
  {
    text:'投资记录',
    itemId:4,
    router:'/account/trackReacord',
    type:'0'
  },
  {
    text:'回款记录',
    itemId:5,
    router:'/account/returnedMoney',
    type:'0'
  },
  {
    text:'个人设置',
    itemId:'',
    router:'',
    type:'2'
  },
  {
    text:'个人资料',
    itemId:6,
    router:'/account/personalInfo',
    type:'0'
  },
  {
    text:'我的消息',
    itemId:7,
    router:'/account/infolist',
    type:'0'
  },
  {
    text:'收货地址',
    itemId:8,
    router:'/account/address',
    type:'0'
  },
  {
    text:'我的福利',
    itemId:'',
    router:'',
    type:'2'
  },
  {
    text:'我的鸟币',
    itemId:9,
    router:'/account/birdCoin',
    type:'0'
  },
  {
    text:'返现券',
    itemId:10,
    router:'/account/returnTickit',
    type:'0'
  },
  {
    text:'加息券',
    itemId:11,
    router:'/account/raiseTickit',
    type:'0'
  },
  {
    text:'我的积分',
    itemId:12,
    router:'/account/integral',
    type:'0'
  },
  {
    text:'推广赚钱',
    itemId:'',
    router:'',
    type:'2'
  },
  {
    text:'我是合伙人',
    itemId:13,
    router:'/account/partner',
    type:'0'
  },
  {
    text:'邀请记录',
    itemId:14,
    router:'/account/inviteRecord',
    type:'0'
  },
  {
    text:'奖励明细',
    itemId:15,
    router:'/account/awardDetail',
    type:'0'
  }
]

class SiderBar extends React.Component {

  render() {
    return(
      <div className="siderbar-content">
        <TopUserInfo  {...this.props}/>
        <ul className="pages-list">
        {
          navList.map((el,index)=>(
          <li
            className={`item ${this.props.itemId==el.itemId?'selected':''} ${el.type==0?'':'item-center'}`}
            key={index}>
            {
              el.type==2?
              <span>{el.text}</span>
              :
              <Link to={el.router} className="link">{el.text}</Link>
            }
          </li>
          ))
        }
        </ul>
      </div>
    )
  }
}


export default SiderBar;
