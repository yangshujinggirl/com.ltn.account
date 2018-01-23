import React from 'react';
import './DepositHead.scss';

import LogoImg from '../../../common/components/imgs/logo.jpg';

const DepositHead =({levelOne,levelTwo})=>(
  <div className="deposit-components-head">
    <div className="user-wrap">
      <a href="/" className="logo">
        <img src={LogoImg}></img>
      </a>
      <div className="page-title">
        <p className="level-one">{levelOne}</p>
        <p className="level-two">{levelTwo}</p>
      </div>
    </div>
  </div>
)

export default DepositHead;
