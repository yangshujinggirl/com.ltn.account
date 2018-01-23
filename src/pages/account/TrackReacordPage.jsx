import React from 'react';
import { Link } from 'react-router-dom';
import { DatePicker,Pagination,Modal } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import {
  trackTotalAmountData,
  trackRecordData,
  getSystemTime,
  createProtocolData,
  personalInfo
} from '../../api/DataApi';

// 本地服务
import Utils from '../../utils';
import user from '../../model/User';
import NoData from './comments/NoData';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import ModalDepost from './comments/Modal';
import ButtonAccount from './comments/ButtonAccount';
const Accounting = require("accounting");

import './TrackReacordPage.scss';

class TabList extends React.Component{
  constructor(props) {
    super(props);
  }
  lookProtocol(event) {
    let eleId = event.target.getAttribute('data-orderid');
    this.createProtocol(eleId);
  }
  createProtocol(id) {
    let tempwindow=window.open();
    createProtocolData(id)
    .then((data)=>{
        tempwindow.location='http://192.168.18.196:8082/'+data.redisKey;
    },(error)=>{
      Modal.error({
       title: 'This is an error message',
       content: 'some messages...some messages...',
     });
    })
  }
  render() {
    const { data }=this.props;
    return(
      <table className="account-table-list">
        <thead>
          <tr>
            <th>交易时间</th>
            <th>项目名称</th>
            <th>投资金额</th>
            <th>到期收益</th>
            <th>交易状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((el,index)=>(
              <tr key={index}>
                <td>{el.orderDate}</td>
                <td><a href={`/finance/detail/${el.productId}`} className="link-url">{el.productName}</a></td>
                <td>￥{Accounting.formatMoney(el.orderAmount,{symbol:''})}</td>
                <td>
                  <span className="red-c">￥{Accounting.formatMoney(el.expectedRevenue,{symbol:''})}</span><br />
                  利息：￥{Accounting.formatMoney(el.interest,{symbol:''})}<br />
                  奖励：{el.expectedRevenueTxt}<br />
                  预计还款时间：{el.repaymentDate}<br />
                </td>
                <td>
                  {
                    el.status=="1"?'投标中':(el.status=="2"?'持有中':
                    (el.status=="4"?'已还款':'还款中'))
                  }
              </td>
                <td>
                  {el.orderNo}<br/>
                  {
                    el.status=="1"?''
                    :
                    <span
                      className="ingree"
                      data-orderid={el.orderNo}
                      onClick={this.lookProtocol.bind(this)}>查看协议>></span>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }

}

class TrackReacordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateTab:'All',//All全部，Today今天，One：1个月，Thr：3个月，Six：6个月
      systemTime:'',//系统当前时间
      totalData:{},
      dataList:[],
      tabStatus:'A',
      startTime:'',
      endTime:'',
      totalCount:0,//总条数
      current:1,//分页选中时的样式状态
      showModal:false,//弹框是否显示
      goUrl:'',//url
      status:''//实名，密码是：1，绑卡：2
    }
  };
  componentWillMount() {
    document.title = '投资记录';
    personalInfo();
    let {tabStatus,dateTab,startTime,endTime,current}=this.state;
    this.getSystemDate();
    this.getTotalAmount();
    this.getRecordListTab(tabStatus,startTime,endTime,current);
  }
  //获取系统时间
  getSystemDate() {
    getSystemTime()
    .then((data)=>{
      this.setState({
        systemTime:data.currentDate,
      })
    },(error)=>{
    })
  }
  //总览
  getTotalAmount() {
    trackTotalAmountData()
    .then((data)=>{
      this.setState({
        totalData:data
      })
    },(error)=>{
    })
  }
  //列表
  getRecordListTab(type,startTime,endTime,current) {
    //参数映射
    //10:全部,1:投标中,2：计息中,4：还款中,3：已还款
    const trans = {
            A:10,
            B:1,
            C:2,
            D:4,
            E:3
          }
    this.setState({
      tabStatus:type,
      current
    })
    //解析moment 格式时间YYYY-MM-DD;
    startTime=lodash.isEmpty(startTime)?'':moment(startTime).format('YYYY-MM-DD');
    endTime=lodash.isEmpty(endTime)?'':moment(endTime).format('YYYY-MM-DD');

    trackRecordData(trans[type],startTime,endTime,current-1)
    .then((data)=>{
      this.setState({
        dataList:data.fixedProductOrderInfoList,
        totalCount:data.totalCount
      })
    },(error)=>{

    })
  }
  //时间按钮删选
  coOptionEvent(type) {
    let { tabStatus,dateTab,systemTime,startTime,endTime } =this.state;
    switch(type){
      case 'All':
        startTime=null;
        endTime=null;
        dateTab='All';
        break;
      case 'Today':
        startTime=moment(systemTime, 'YYYY-MM-DD');
        endTime=null;
        dateTab='Today';
        break;
      case 'One':
        endTime=moment(systemTime, 'YYYY-MM-DD');
        startTime=moment(systemTime).subtract(1,"months").format();
        startTime=moment(startTime, 'YYYY-MM-DD');
        dateTab='One';
        break;
      case 'Thr':
        endTime=moment(systemTime, 'YYYY-MM-DD');
        startTime=moment(systemTime).subtract(3,"months").format();
        startTime=moment(startTime, 'YYYY-MM-DD');
        dateTab='Thr';
        break;
      case 'Six':
        endTime=moment(systemTime, 'YYYY-MM-DD');
        startTime=moment(systemTime).subtract(6,"months").format();
        startTime=moment(startTime, 'YYYY-MM-DD');
        dateTab='Six';
        break;
    }
    //set moment格式时间
    this.setState({
      startTime,
      endTime,
      dateTab
    });
    this.getRecordListTab(tabStatus,startTime,endTime,1);
  }
  //日期回调
  onChange(date,type) {
    let { tabStatus,startTime,endTime } =this.state;
    if(type=='start') {
      startTime=date;
    } else {
      endTime=date;
    }
    this.setState({
      startTime,
      endTime
    })
    this.getRecordListTab(tabStatus,startTime,endTime,1);
  }
  //分页
  paginationEvent(page, pageSize) {
    let {tabStatus,dateTab,startTime,endTime} =this.state;
    this.setState({
      current:page
    });
    this.getRecordListTab(tabStatus,startTime,endTime,page)
  }
  //去充值，提现
  goNextUrl(backUrl) {
    this.setState({
      showModal:Utils.goNextUrl(backUrl).visible,
      goUrl:Utils.goNextUrl(backUrl).goUrl,
      status:Utils.goNextUrl(backUrl).status
    })
  }
  handleOk() {
    this.props.history.push(this.state.goUrl);
  }
  handleCancel() {
    this.setState({
      showModal:false
    })
  }

  render() {
    const {
      totalData,dataList,
      current,totalCount,
      tabStatus,dateTab,
      systemTime,oneMonth,
      thrMonth,sixMonth,
      startTime,endTime
    } = this.state;
    return(
      <AccountWrapModule itemId='4' {...this.props}>
        <div className="main-pages-wrap track-reacord-page">
          <Head title="投资记录"/>
          <div className="content-action">
            <div className="record-pandect">
              <div className="pandect-wrap">
                <div className="part-one">
                  <div className="total-head">
                    <div className="key">
                      累计投资(元)
                    </div>
                    <div className="value">{Accounting.formatMoney(totalData.totalOrderAmount,{symbol:''})}</div>
                  </div>
                  <div className="item">
                    <div className="key">当月投资(元)</div>
                    <div className="value">
                      {Accounting.formatMoney(totalData.last30DayInvest,{symbol:''})}
                    </div>
                  </div>
                  <div className="item">
                    <div className="key">当月到期(元)</div>
                    <div className="value">
                      {Accounting.formatMoney(totalData.last30DayExpiration,{symbol:''})}
                      <span className="project-num">（{totalData.last30DayExpirationNum}个项目）</span>
                    </div>
                  </div>
                </div>
                <div className="part-one part-two">
                  <div className="total-head">
                    <div className="key">
                      待收收益(元)
                    </div>
                    <div className="value">{Accounting.formatMoney(totalData.orderWaitedIncome,{symbol:''})}</div>
                  </div>
                  <div className="item">
                    <div className="key">累计收益(元)</div>
                    <div className="value">
                      {Accounting.formatMoney(totalData.orderReceivedIncome,{symbol:''})}
                    </div>
                  </div>
                  <div className="item">
                    <div className="key">账户余额(元)</div>
                    <div className="value">
                      {Accounting.formatMoney(totalData.usableBalance,{symbol:''})}
                    </div>
                  </div>
                  <div className="btn-list">
                    <ButtonAccount onClick={Utils.goProduct}>
                      投资
                    </ButtonAccount>
                    <ButtonAccount
                      className="product-btn"
                      type="hollow"
                      onClick={()=>this.goNextUrl('/account/trade/recharge')}>
                      充值
                    </ButtonAccount>
                  </div>
                </div>
              </div>
            </div>
            <div className="tips-content">
              <p className="item">
                资金明细记录了你各种交易产生的支出和收益明细，请选择时间和交易类型查看。
              </p>
            </div>
            <div className="screen-tabs-list">
              <div className="item">
                <span className="label">起止时间</span>
                <DatePicker
                  className="date-form"
                  value={startTime}
                  onChange={(date,dateString) => this.onChange(date,'start')}
                />
                <span className="to">至</span>
                <DatePicker
                  className="date-form"
                  value={endTime}
                  onChange={(date,dateString) => this.onChange(date,'end')}
                />
                <div className="date-tabs-list clear">
                  <div
                    className={`it-tab ${dateTab=='All'?'selected':''}`}
                    onClick={()=>this.coOptionEvent('All')}>
                    全部
                  </div>
                  <div
                    className={`it-tab ${dateTab=='Today'?'selected':''}`}
                    onClick={()=>this.coOptionEvent('Today')}>
                    今天
                  </div>
                  <div
                    className={`it-tab ${dateTab=='One'?'selected':''}`} onClick={()=>this.coOptionEvent('One')}>
                    一个月
                  </div>
                  <div
                    className={`it-tab ${dateTab=='Thr'?'selected':''}`} onClick={()=>this.coOptionEvent('Thr')}>
                    三个月
                  </div>
                  <div
                    className={`it-tab ${dateTab=='Six'?'selected':''}`} onClick={()=>this.coOptionEvent('Six')}>
                    六个月
                  </div>
                </div>
              </div>
              <div className="item">
                <span className="label">交易类型</span>
                <div className="deal-type-tabs-list clear">
                  <div
                    className={`it-tab ${tabStatus=='A'?'selected':''}`} onClick={()=>this.getRecordListTab('A',startTime,endTime,1)}>全部</div>
                  <div
                    className={`it-tab ${tabStatus=='B'?'selected':''}`} onClick={()=>this.getRecordListTab('B',startTime,endTime,1)}>投标中</div>
                  <div
                    className={`it-tab ${tabStatus=='C'?'selected':''}`} onClick={()=>this.getRecordListTab('C',startTime,endTime,1)}>计息中</div>
                  <div
                    className={`it-tab ${tabStatus=='D'?'selected':''}`} onClick={()=>this.getRecordListTab('D',startTime,endTime,1)}>还款中</div>
                  <div
                    className={`it-tab ${tabStatus=='E'?'selected':''}`} onClick={()=>this.getRecordListTab('E',startTime,endTime,1)}>已还款</div>
                </div>
              </div>
            </div>
            {
              dataList.length>0?
              <div className="record-content-list">
                <TabList data={dataList} />
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
        <ModalDepost
          status={this.state.status}
          goUrl={this.state.goUrl}
          visible={this.state.showModal}
        />
      </AccountWrapModule>

    )
  }
}

export default TrackReacordPage;
