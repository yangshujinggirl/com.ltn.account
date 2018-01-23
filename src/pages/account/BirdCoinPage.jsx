import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';

import {
  birdPandectData ,
  useBirdCoinData,
  getBirdCoinData,
  personalInfo
} from '../../api/DataApi';

import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';

import NoData from './comments/NoData';
import './BirdCoinPage.scss';


//tab表格
const BirdList=({data,tab})=>(
    <table className="account-table-list">
      <thead>
        {
          tab=='A'?
          <tr>
            <th>流水编号</th>
            <th>获取方式</th>
            <th>获得数量</th>
            <th>获得时间</th>
          </tr>
          :
          <tr>
            <th>流水编号</th>
            <th>使用途径</th>
            <th>使用数量</th>
            <th>使用时间</th>
          </tr>
        }
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{el.id}</td>
              <td>{el.typeName}</td>
              <td>{el.amount}</td>
              <td>{el.createDate}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
)

class BirdCoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      pandectData:{},
      dataList:[],
      tabShow:'A',
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };
  componentWillMount() {
    document.title = '我的鸟币';
    personalInfo()
    this.birdPandect();
    this.getBirdCoinTab('A',this.state.current);
  }

  //鸟币总览
  birdPandect() {
    birdPandectData()
    .then((data)=>{
      this.setState({
        pandectData:data
      })
    },(error)=>{
    })
  }

  //获得鸟币
  getBirdCoinTab(type,current) {
    //参数映摄
    //I:获得鸟币，O:使用鸟币
    const trans = {
            A:'I',
            B:'o'
          }
    this.setState({
      tabShow:type,
      current
    })
    getBirdCoinData(trans[type],current-1)
    .then((data)=>{
      this.setState({
        dataList:data.birdList,
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
    this.getBirdCoinTab(this.state.tabShow,page);
  }

  render() {
    const { dataList,tabStatus,pandectData,totalCount,current,tabShow }=this.state;
    return(
      <AccountWrapModule itemId='9' {...this.props}>
        <div className="bird-coin-page main-pages-wrap">
          <Head title="我的鸟币"/>
          <div className="content-action">
            <div className="bird-pandect">
              <div className="pandect-wrap">
                <div className="part-one">
                  <div className="item">
                    <div className="key">鸟币余额</div>
                  <div className="value">
                    <span className="big-num">
                      {this.state.pandectData.nowBird}
                    </span>
                    鸟币
                  </div>
                  </div>
                  <div className="item">
                    <div className="key">今日获得鸟币</div>
                    <div className="value">
                      <span className="big-num">
                        {this.state.pandectData.todayBird}
                      </span>
                      鸟币
                    </div>
                  </div>
                </div>
                <div className="part-two">
                  <div className="row">
                    <div className="item">
                      <div className="key">当月获得鸟币</div>
                      <div className="value">{pandectData.mouthBirdI}</div>
                    </div>
                    <div className="item">
                      <div className="key">当月使用鸟币</div>
                      <div className="value">{pandectData.mouthBirdO}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="item">
                      <div className="key">累计获得鸟币</div>
                      <div className="value">{pandectData.totalBirdI}</div>
                    </div>
                    <div className="item">
                      <div className="key">累计使用鸟币</div>
                      <div className="value">{pandectData.totalBirdO}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="get-bird-way">
              <p className="way-title">更多获取鸟币的方式：</p>
              <div className="list">
                <Link to="/account/partner" className="item">
                  <div className="icon"></div>
                  <p className="text">合伙人计划</p>
                </Link>
                {/* <div className="item">
                  <div className="icon"></div>
                  <p className="text">新手活动</p>
                </div> */}
                <div className="item">
                  <div className="icon"></div>
                  <p className="text">敬请期待</p>
                </div>
              </div>
            </div>
            <div className="tips-content">
              <p className="item">
                1.鸟币含义：领投鸟理财的虚拟货币，不能提现，投资时1：1抵扣现金用
              </p>
              <p className="item">
                2.使用要求：投资时和RMB的最大投资配比为1：49，如单笔投资1000元最多可用20鸟币折现；另可提现时抵扣手续费
              </p>
            </div>
            <div className="bird-coin-list">
              <div className="tab-toggle clear">
                <div
                  className={`item ${tabShow=='A'?'selected':''}`}
                  onClick={()=>this.getBirdCoinTab('A',1)}>
                  获得鸟币明细
                </div>
                <div
                  className={`item ${tabShow=='B'?'selected':''}`}
                  onClick={()=>this.getBirdCoinTab('B',1)}>
                  使用鸟币明细
                </div>
              </div>
              {
                dataList.length>0?
                <div>
                  <BirdList data={dataList} tab={tabStatus}/>
                  <Pagination
                    current={current}
                    onChange={(page)=>this.paginationEvent(page)}
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

export default BirdCoinPage;
