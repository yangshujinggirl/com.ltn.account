import React from 'react';
import { Modal,message ,Button,Pagination} from 'antd';
import 'antd/dist/antd.css';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import AccountWrapModule from './comments/AccountWrapModule';
import {
  cashBackTickData ,
  sendTickData,
  personalInfo
} from '../../api/DataApi';
import Head from './comments/Head';
import NoData from './comments/NoData';
import Utils from '../../utils';
import './ReturnTickitPage.scss';

class TickitList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ModalShow:false,
      userCouponId:'',
      copied:false,
      copyValue:''
    }
  }
  getpresentCode(id,couponName,remark,endDate) {
    sendTickData(id)
    .then((data)=>{
      this.setState({
        ModalShow:true,
        userCouponId:data.presentCode,
        copyValue:`我赠送你一张${couponName}(${remark})，
        在投资下单确认页面填入券码${data.presentCode}即可使用，
        ${endDate}日前有效，登录领投鸟官网www.lingtouniao.com赶紧使用吧！`
      })
    },(error)=>{
      Modal.info({
        title: '温馨提示',
        content: (
          <div>
            <p>{error.message}</p>
          </div>
        ),
        onOk() {},
      });
    })
  }
  handleCancel() {
    this.setState({
      ModalShow:false
    })
  }
  goCopy() {
    this.setState({
      ModalShow:false,
      copied:true
    })
    Modal.success({
      title: '温馨提示',
      content: (
        <div>
          <p>恭喜你复制成功</p>
          <p>您可以通过微信，QQ，短信等方式，将返现券分享给您的好友</p>
        </div>
      ),
      onOk() {},
    });
  }
  render() {
      const { data ,status } = this.props;
      let classStaus='';
      if(status=='A') {
        classStaus='item clear';
      } else if(status=='B') {
        classStaus='item clear used';
      } else if(status=='C') {
        classStaus='item clear staleDated';
      }
    return(
      <div>
        <div className="list clear">
          {
            data.map((el,index)=>(
              <div className={classStaus} key={index}>
                <div className="l-ac">
                  <div className="tick-head clear">
                    <span className="name">{el.activityType}券</span>
                    {
                      status=='A'?
                      <span
                        className="send"
                        onClick={
                          ()=>this.getpresentCode(el.id,el.couponName,el.desc,el.couponDate)
                        }>
                          赠送好友>>
                      </span>
                      :
                      ''
                    }
                  </div>
                  <div className="detail-info">
                    <p className="key">使用规则：</p>
                    <p className="value">
                      {el.desc}
                    </p>
                  </div>
                  <div className="detail-info">
                    <p className="key">有效期限：</p>
                    <p className="value">
                      {el.couponDate}
                    </p>
                  </div>
                  <div className="detail-info">
                    <p className="key">活动来源：</p>
                    <p className="value">
                      系统赠送
                    </p>
                  </div>
                </div>
                <div className="r-ac">
                  <p className="key">{el.amount}</p>
                  <p className="value">投资返现券(元)</p>
                </div>
              </div>
            ))
          }
        </div>
        <Modal
          visible={this.state.ModalShow}
          title="提示"
          onCancel={this.handleCancel.bind(this)}
          footer={
            <CopyToClipboard
              text={this.state.copyValue}
              onCopy={()=> this.goCopy()}>
                <button className="go-copy-btn">复制</button>
            </CopyToClipboard>
          }
        >
          <div className="return-modal-content-diy">
            <p >券码：<span className="userCouponId">{this.state.userCouponId}</span></p>
            <p className="lit-tips">不能再次兑换，只能投资下单时使用。<br/>请点击复制赠送给好友</p>
          </div>

        </Modal>
      </div>
    )
  }
}


class ReturnTickitPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      dataList:[],
      tabShow:'A',
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };

  componentWillMount() {
    document.title = '返现券';
    personalInfo()
    this.getTickitsTab('A',this.state.current);
  }

  //返现券
  getTickitsTab(type,current) {
    //参数据映摄
    //YX:有效，SYZ:已使用，GQ:已失效
    const trans = {
            A:'YX',
            B:'SYZ',
            C:'GQ'
          }
    this.setState({
      tabShow:type,
      current
    })
    cashBackTickData(trans[type],current-1)
    .then((data)=>{
      this.setState({
        dataList:data.coupons,
        totalCount:data.totalCount
      })
    },(error)=>{

    })
  }
  //分页
  paginationEvent(page, pageSize) {
    this.setState({
      current:page
    });
    this.getTickitsTab(this.state.tabShow,page);
  }
  goExcharge() {
    location.hash=`/account/exchange?backUrl=${this.props.match.path}`;
  }
  render() {
    const { dataList,tabShow,totalCount,current }=this.state;
    return(
      <AccountWrapModule itemId='10' {...this.props}>
        <div className="main-pages-wrap return-tickit-page">
          <Head title="返现券"/>
          <div className="content-action">
            <div className="get-tickit-way">
              <p className="way-title">获取返现券方式：</p>
              <div className="list">
                <div className="item item-code" onClick={this.goExcharge.bind(this)}>
                  <div className="icon"></div>
                  <p className="text">兑换码兑换</p>
                </div>
                {/* <div className="item item-newuser">
                  <div className="icon"></div>
                  <p className="text">新手注册</p>
                </div> */}
                <div className="item item-wait">
                  <div className="icon"></div>
                  <p className="text">敬请期待</p>
                </div>
              </div>
            </div>
            <div className="tips-content">
              <p className="item">
                1.返现券含义：奖励给投资者的一种现金券，投资时使用、还款时折换成等额现金，用户可继续投资或提现。
              </p>
              <p className="item">
                2.返现券使用：
                <span className="two-level">
                  (1) 仅限投资普通固定收益类产品(散标和理财计划)，不适用于新手标；<br/>
                  (2) 需满足券面规定的投资金额时才可用，每笔投资仅限使用一张，且不能和其他券叠加使用。
                </span>
              </p>
            </div>
            <div className="tickits-contents">
              <div className="tab-toggle clear">
                <div
                  className={`item ${tabShow=='A'?'selected':''}`}
                  onClick={()=>this.getTickitsTab('A',1)}>未使用</div>
                <div
                  className={`item ${tabShow=='B'?'selected':''}`}
                  onClick={()=>this.getTickitsTab('B',1)}>已使用</div>
                <div
                  className={`item ${tabShow=='C'?'selected':''}`}
                  onClick={()=>this.getTickitsTab('C',1)}>已失效</div>
                <div
                  className='go-use-btn'
                  onClick={()=>Utils.goProduct()}>立即使用</div>
              </div>
              {
                dataList.length>0?
                <div>
                  <TickitList data={dataList} status={tabShow}/>
                  <Pagination
                    current={current}
                    onChange={this.paginationEvent.bind(this)}
                    defaultPageSize={6}
                    total={totalCount} />
                </div>
                :
                <NoData />
              }

            </div>
          </div>
        </div>
      </AccountWrapModule>

    )
  }
}

export default ReturnTickitPage;
