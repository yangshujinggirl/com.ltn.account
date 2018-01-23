import React from 'react';
import { Link } from 'react-router-dom';
import { DatePicker,Pagination } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
import {
  detailMoneyTotalData ,
  detailMoneyListData,
  getSystemTime,
  personalInfo
} from '../../api/DataApi';

// 本地服务
import Utils from '../../utils';
import user from '../../model/User';

import NoData from './comments/NoData';
import ButtonAccount from './comments/ButtonAccount';
import ModalDepost from './comments/Modal';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
const Accounting = require("accounting");
import './TrackReacordPage.scss';
import './DetailmoneyPage.scss';
//列表组件
const TabList=({ data })=>{
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>交易时间</th>
          <th>交易类型</th>
          <th>交易金额</th>
          <th>余额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{el.operateDate}</td>
              <td>{el.operateType}</td>
              <td className={el.amountText=='-'?'gre':'red'}>
                {el.amountText}
                ￥
                {el.amount}
              </td>
              <td>{Accounting.formatMoney(el.total,{symbol:''})}</td>
              <td>{el.orderNo}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class DetailmoneyPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateTab:'All',//All全部，Today今天，One：1个月，Thr：3个月，Six：6个月
      systemTime:'',//系统当前时间
      totalData:{},
      dataList:[],
      tabStatus:'A',//A:全部,B:充值,C：提现,D：投资,E：回款,F:返现,G:其他
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
    document.title = '资金明细';
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
        systemTime:data.currentDate
      })
    },(error)=>{

    })
  }
  //总览
  getTotalAmount() {
    detailMoneyTotalData()
    .then((data)=>{
      this.setState({
        totalData:data
      })
    },(error)=>{

    })
  }
  //列表 type:业务类型，dateTab：全部，今天，1个月，3个月，6个月
  getRecordListTab(type,startTime,endTime,current) {
    //参数映射
    //ALL:全部,CZ:充值,TX：提现,TZ：投资,HK：回款,FX:返现,QT:其他
    const trans = {
            A:'ALL',
            B:'CZ',
            C:'TX',
            D:'TZ',
            E:'HK',
            F:'FX',
            G:'QT'
          }
    this.setState({
      tabStatus:type,
      current,
    })
    //解析moment 格式时间YYYY-MM-DD;
    startTime=lodash.isEmpty(startTime)?'':moment(startTime).format('YYYY-MM-DD');
    endTime=lodash.isEmpty(endTime)?'':moment(endTime).format('YYYY-MM-DD');

    detailMoneyListData(trans[type],startTime,endTime,current-1)
    .then((data)=>{
      this.setState({
        dataList:data.assetList,
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
  //日期选择回调
  onChange(date,type) {

    let { tabStatus,startTime,endTime } =this.state;
    if(type=='start') {
      startTime=date;
    } else {
      endTime=date;
    }
    //set moment格式时间
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

  render() {
    const {
            totalData,dataList,
            tabStatus,dateTab,
            current,totalCount,
            startTime,endTime,
            systemTime,oneMonth,
            thrMonth,sixMonth,
            status,goUrl,showModal
          } = this.state;
    return(
      <AccountWrapModule itemId='1' {...this.props}>
        <div className="main-pages-wrap track-reacord-page detail-money-page">
          <Head title="资金明细"/>
          <div className="content-action">
            <div className="record-pandect">
              <div className="pandect-wrap">
                <div className="part-one">
                  <div className="row">
                    <div className="key">{Accounting.formatMoney(totalData.balance,{symbol:''})}</div>
                    <div className="value">可用余额(元)</div>
                  </div>
                  <div className="btn-list">
                    <ButtonAccount onClick={()=>this.goNextUrl('/account/trade/recharge')}>
                      充值
                    </ButtonAccount>
                    <ButtonAccount className="drawmoney-btn"
                      type="hollow" onClick={()=>this.goNextUrl('/account/trade/drawmoney')}>
                      提现
                    </ButtonAccount>
                    <ButtonAccount className="product-btn"
                      type="hollow" onClick={Utils.goProduct}>
                      投资
                    </ButtonAccount>
                  </div>
                </div>
                <div className="part-two">
                  <div className="item">
                    <p className="key">累计充值(元)：</p>
                    <p className="value">{Accounting.formatMoney(totalData.rechargeAmount,{symbol:''})}</p>
                  </div>
                  <div className="item">
                    <p className="key">累计提现(元)：</p>
                    <p className="value">{Accounting.formatMoney(totalData.withdrawAmount,{symbol:''})}</p>
                  </div>
                  <div className="item">
                    <p className="key">累计投资(元)：</p>
                    <p className="value">{Accounting.formatMoney(totalData.investAmount,{symbol:''})}</p>
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
                    className={`it-tab ${dateTab=='One'?'selected':''}`}
                    onClick={()=>this.coOptionEvent('One')}>
                    一个月
                  </div>
                  <div
                    className={`it-tab ${dateTab=='Thr'?'selected':''}`}
                    onClick={()=>this.coOptionEvent('Thr')}>
                    三个月
                  </div>
                  <div
                    className={`it-tab ${dateTab=='Six'?'selected':''}`}
                    onClick={()=>this.coOptionEvent('Six')}>
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
                    className={`it-tab ${tabStatus=='B'?'selected':''}`} onClick={()=>this.getRecordListTab('B',startTime,endTime,1)}>充值</div>
                  <div
                    className={`it-tab ${tabStatus=='C'?'selected':''}`} onClick={()=>this.getRecordListTab('C',startTime,endTime,1)}>提现</div>
                  <div
                    className={`it-tab ${tabStatus=='D'?'selected':''}`} onClick={()=>this.getRecordListTab('D',startTime,endTime,1)}>投资</div>
                  <div
                    className={`it-tab ${tabStatus=='E'?'selected':''}`} onClick={()=>this.getRecordListTab('E',startTime,endTime,1)}>回款</div>
                  <div
                    className={`it-tab ${tabStatus=='F'?'selected':''}`} onClick={()=>this.getRecordListTab('F',startTime,endTime,1)}>返现</div>
                  <div
                    className={`it-tab ${tabStatus=='G'?'selected':''}`} onClick={()=>this.getRecordListTab('G',startTime,endTime,1)}>其他</div>
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
          status={status}
          goUrl={goUrl}
          visible={showModal}
        />
      </AccountWrapModule>

    )
  }
}

export default DetailmoneyPage;
