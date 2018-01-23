import React from 'react';
import Malarquee from 'react-malarquee';
import { getBankNoteData } from '../../../api/DataApi';
import './Head.scss';

import Liandong from '../imgs/icon_hr.png';
import noticeIcon from '../imgs/notic_icon.png';

const NoticeList=({data})=>(
  <div className="notice-contain">
    <Malarquee hoverToPause rate={50}>
      {
        data.map((el,index)=>(
          <span key={index}>
            <img src={noticeIcon} />
            <span>{el.content}</span>
          </span>
        ))
      }
    </Malarquee>
  </div>
)

class Head extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      noteList:[]
    }
  }

  componentDidMount(){
    this.bankNoteList();
  }

  bankNoteList(){
    if(this.props.broadcast){
      getBankNoteData()
      .then((data)=>{
          this.setState({
            noteList:data.bankNoticeDTOs
          })
        },(error)=>{
        })
    } else {
      return false;
    }
  }

  render() {
    const { title,broadcast } = this.props;
    const { noteList } =this.state;
    return(
      <div className="head-components-wrap">
        <div className="head-components clear">
          <div className="left-name">
            <p className="title">{title}</p>
          </div>
          <div className="right-info">
            <img src={Liandong}></img>
            <span className="info-text">您的资金都是由华瑞银行进行存管</span>
          </div>
        </div>
        {
          broadcast&&noteList.length>0&&<NoticeList data={noteList}></NoticeList>
        }
      </div>
    )
  }
}


export default Head;
