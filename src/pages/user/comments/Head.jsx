import React from 'react';
import { Link } from 'react-router-dom';
import './Head.scss';

import LogoImg from '../../../common/components/imgs/logo.jpg';

const Head =({title,vice})=>(
  <div className="user-components-head">
    <div className="user-wrap">
      <div className="part-l">
        <a href="/" className="go-home-link">
          <img src={LogoImg}></img>
        </a>
        <div className="page-title">
          {title}
          <span className="vice-title">{vice}</span>
        </div>
      </div>
      <div className="part-r">
        <a href="/" className="return-btn">返回首页</a>
      </div>
    </div>
  </div>
)

export default Head;
