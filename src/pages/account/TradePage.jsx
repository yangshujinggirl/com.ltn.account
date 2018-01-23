import React from 'react';
import { Link } from 'react-router-dom';
import { DatePicker,Pagination,Tooltip,Icon  } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import {
  getTotalAccountData,
  getTradeListData,
  getSystemTime,
  getAccountInfo,
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

import './TradePage.scss';

const dealType={
  CZ:'充值',
  TX:'提现'
}
//流水列表
const TabList=({ data })=>{
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>交易时间</th>
          <th>交易类型</th>
          <th>交易金额</th>
          <th>交易状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{el.operateDate}</td>
              <td>{dealType[el.operateType]}</td>
              <td className={el.operateType=='CZ'?'cz-col':'tx-col'}>
                {el.operateType=='CZ'?'+':'-'}
                ￥{Accounting.formatMoney(el.amount,{symbol:''})}
              </td>
              <td>{el.status}</td>
              <td>订单编号{el.orderNo}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class TradePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateTab:'All',//All全部，Today今天，One：1个月，Thr：3个月，Six：6个月
      systemTime:'',//系统当前时间
      tabStatus:'A',//A:ALL,CZ:B,C
      totalData:{},
      dataList:[],
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
    document.title = '充值提现';
    personalInfo()
    let {tabStatus,startTime,endTime,current}=this.state;
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
  //头部总账户
  getTotalAmount() {
    getAccountInfo()
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
    //全部:ALL,CZ:充值,TX：提现
    const trans = {
            A:'ALL',
            B:'CZ',
            C:'TX',
          }
    this.setState({
      tabStatus:type,
      current
    })
    //解析moment 格式时间YYYY-MM-DD;
    startTime=lodash.isEmpty(startTime)?'':moment(startTime).format('YYYY-MM-DD');
    endTime=lodash.isEmpty(endTime)?'':moment(endTime).format('YYYY-MM-DD');

    getTradeListData(trans[type],startTime,endTime,current-1)
    .then((data)=>{
      this.setState({
        dataList:data.pcWaterCourseList,
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
      startTime=date
    } else {
      endTime=date
    }
    this.setState({
      startTime,
      endTime
    })
    this.getRecordListTab(tabStatus,startTime,endTime,1)
  }
  //分页
  paginationEvent(page, pageSize) {
    let {tabStatus,dateTab,startTime,endTime,current}=this.state;
    this.setState({
      current:page
    });
    this.getRecordListTab(tabStatus,startTime,endTime,page);
  }

  //去充值，提现
  goNextUrl(backUrl) {
    this.setState({
      showModal:Utils.goNextUrl(backUrl).visible,
      goUrl:Utils.goNextUrl(backUrl).goUrl,
      status:Utils.goNextUrl(backUrl).status
    })
  }
  //去绑卡
  goBindCard() {
    let backUrl = this.props.location.pathname;
    this.setState({
      showModal:Utils.goBindCardUrl(backUrl).visible,
      goUrl:Utils.goBindCardUrl(backUrl).goUrl,
      status:Utils.goBindCardUrl(backUrl).status
    })
  }

  render() {
    const {
            totalData,dataList,
            totalCount,current,
            startTime,endTime,
            tabStatus,dateTab,
            systemTime,oneMonth,
            thrMonth,sixMonth
          } = this.state;
    const logoUrl =user.userInfo.logoUrl;
    return(
      <AccountWrapModule itemId='2' {...this.props}>
        <div className="main-pages-wrap track-reacord-page account-trade-page">
          <Head title="充值提现"/>
          <div className="content-action">
            <div className="trade-record-pandect">
              <div className="part-same">
                <div className="item">
                  <div className="key">
                    账户余额(元)
                  </div>
                  <div className="big-value">
                    {Accounting.formatMoney(totalData.usableBalance,{symbol:''})}
                  </div>
                </div>
                <div className="item-two">
                  可提现金额(元)：
                  <span className="value">
                    {Accounting.formatMoney(totalData.cashAvailable,{symbol:''})}
                  </span>
                  <Tooltip placement="topLeft" title='充值金额当日不可提现！'>
                    <Icon type="question-circle" />
                  </Tooltip>
                </div>
                <div className="btns-list">
                  <ButtonAccount onClick={()=>this.goNextUrl('/account/trade/recharge')}>
                    充值
                  </ButtonAccount>
                  <ButtonAccount className="drawmoney-btn"
                    type="hollow" onClick={()=>this.goNextUrl('/account/trade/drawmoney')}>
                    提现
                  </ButtonAccount>
                </div>
              </div>
              <div className="part-same">
                <div className="item-r clear">
                  <span className="label">提现银行卡</span>
                  <Link to="/account/card" className="more">更多>></Link>
                </div>
                {
                  user.isBindCard()?
                  <div className="bank-wrap">
                    <img src={logoUrl} alt='银行卡'></img>
                  </div>
                  :
                  <div className="add-btn" onClick={()=>this.goBindCard()}>+添加银行卡</div>
                }
              </div>
            </div>
            <div className="tips-content">
              <p className="item">
                充值提现明细记录了您在充值和提现交易过程明细，请选择时间和交易类型查看。
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
                  value={endTime}
                  className="date-form"
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
                    className={`it-tab ${this.state.tabStatus=='A'?'selected':''}`} onClick={()=>this.getRecordListTab('A',startTime,endTime,1)}>全部</div>
                  <div
                    className={`it-tab ${this.state.tabStatus=='B'?'selected':''}`} onClick={()=>this.getRecordListTab('B',startTime,endTime,1)}>充值</div>
                  <div
                    className={`it-tab ${this.state.tabStatus=='C'?'selected':''}`} onClick={()=>this.getRecordListTab('C',startTime,endTime,1)}>提现</div>
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

export default TradePage;
