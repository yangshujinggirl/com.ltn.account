import React from 'react';
import { Link } from 'react-router-dom';
import { DatePicker,Pagination } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import {
  returndWaitData,
  returndAlreayData,
  personalInfo
} from '../../api/DataApi';
import NoData from './comments/NoData';
const Accounting = require("accounting");
import AccountWrapModule from './comments/AccountWrapModule';
import './ReturnedMoneyPage.scss';
import Liandong from './imgs/icon_hr.png';

//总览组件
const TotalAmount =({ data ,status})=>(
  <div className="record-pandect">
    <div className="pandect-wrap">
      <div className="item">
        <p className="key">
          {
            status==0?
            '全部待收本息(元)'
            :
            '全部已收本息(元)'
          }
        </p>
        <p className="value">{Accounting.formatMoney(data.allPrincipalInterest,{symbol:''})}</p>
      </div>
      <div className="item">
        <p className="key">
          {
            status==0?
            '下一个月待收本息(元)'
            :
            '本月已收本息(元)'
          }
        </p>
        <p className="value">{Accounting.formatMoney(data.currentPrincipalInterest,{symbol:''})}</p>
      </div>
      <div className="item">
        <p className="key">包含奖励收益(元)</p>
        <p className="value">{Accounting.formatMoney(data.rewardProfit,{symbol:''})}</p>
      </div>
    </div>
  </div>
)

//列表组件
const TabList=({ data,status })=> {
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>到期日期</th>
          <th>项目名称</th>
          <th>
            {
              status==0?'预计回款总额':'已回款总额'
            }
          </th>
          <th>投资金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{el.expirationDate}</td>
              <td>
                <Link to="" className="link-url">{el.productName}</Link>
              </td>
              <td>{Accounting.formatMoney(el.principalAndProfit,{symbol:''})}</td>
              <td>
                <span className="red-c">￥{Accounting.formatMoney(el.orderAmount,{symbol:''})}</span><br/>
                利息：￥{el.interest}<br/>
                奖励：投资返现{el.reward}
              </td>
              <td>
                {el.remark}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class ReturnedMoneyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      totalData:{},
      dataList:[],
      tabStatus:0,//0:待回款，1:已回款
      totalCount:0,//总条数
      current:1,//分页选中时的样式状态
      startTime:'',
      endTime:''
    }
  };
  componentWillMount() {
    document.title = '回款记录';
    personalInfo();
    let { startTime,endTime,current }=this.state;
    this.getDataControl(startTime,endTime,current)
  }
  getDataControl(startTime,endTime,current) {
    if(this.state.tabStatus==0) {
      this.getWait(startTime,endTime,current);
    } else {
      this.getAlready(startTime,endTime,current);
    }
  }
  //获得 待回款
  getWait(startTime,endTime,current) {
    this.setState({
      tabStatus:0,
      current
    });
    //解析moment 格式时间YYYY-MM-DD;
    startTime=lodash.isEmpty(startTime)?'':moment(startTime).format('YYYY-MM-DD');
    endTime=lodash.isEmpty(endTime)?'':moment(endTime).format('YYYY-MM-DD');

    returndWaitData(startTime,endTime,current-1)
    .then((data)=>{
      this.setState({
        totalData:data.header,
        dataList:data.paymentList,
        totalCount:data.totalCount
      })
    },(error)=>{
    })
  }
  //获得 已回款
  getAlready(startTime,endTime,current) {
    this.setState({
      tabStatus:1,
      current
    });
    //解析moment 格式时间YYYY-MM-DD;
    startTime=lodash.isEmpty(startTime)?'':moment(startTime).format('YYYY-MM-DD');
    endTime=lodash.isEmpty(endTime)?'':moment(endTime).format('YYYY-MM-DD');

    returndAlreayData(startTime,endTime,current-1)
    .then((data)=>{
      this.setState({
        totalData:data.header,
        dataList:data.paymentList,
        totalCount:data.totalCount
      })
    },(error)=>{
    })
  }

  //日期选择
  onChange(date,type) {
    let { startTime,endTime } =this.state;
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
    this.getDataControl(startTime,endTime,1)
  }
  //分页
  paginationEvent(page, pageSize) {
    let { startTime,endTime }=this.state;
    this.setState({
      current:page
    });
    this.getDataControl(startTime,endTime,page)
  }
  render() {
    const { totalData,dataList,tabStatus,totalCount,current,startTime,endTime } = this.state;
    return(
      <AccountWrapModule itemId='5' {...this.props}>
        <div className="main-pages-wrap return-money-page">
          <div className="head-components clear">
            <div className="left-name">
              <p
                className={`title ${tabStatus==0?'selected':''}`}
                onClick={()=>this.getWait('','',1)}>待回款</p>
              <p
                className={`title ${tabStatus==1?'selected':''}`} onClick={()=>this.getAlready('','',1)}>已回款</p>
            </div>
            <div className="right-info">
              <img src={Liandong}></img>
            <span className="info-text">您的资金都是由华瑞银行进行存管</span>
            </div>
          </div>
          <div className="content-action">
            <TotalAmount data={totalData} status={tabStatus}/>
            <div className="tips-content">
              {
                tabStatus==0?
                <p className="item">
                  待回款记录了您未收回的本金、利息和奖励(包括返现券、加息券折算的奖励)。请选择相应的起止时间查看。
                </p>
                :
                <p className="item">
                  已回款记录了您已经收回的本金、利息和奖励(包括返现券、加息券折算的奖励)。请选择相应的起止时间查看。
                </p>
              }
            </div>
            <div className="time-line">
              <span className="label">起止时间</span>
              <DatePicker
                value={startTime}
                className="date-form"
                onChange={(date,dateString) => this.onChange(date,'start')}
              />
              <span className="to">至</span>
              <DatePicker
                value={endTime}
                className="date-form"
                onChange={(date,dateString) => this.onChange(date,'end')}
              />
            </div>
            <div className="record-content-list">
            {
              dataList.length>0?
              <div>
                <TabList data={dataList} status={tabStatus}/>
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

export default ReturnedMoneyPage;
