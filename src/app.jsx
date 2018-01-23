import React,{Component} from 'react';
import ReactDOM,{render} from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import {
  HomeRoutesLoader,
  UserRoutesLoader
} from './pages/PageLoader';

// 公共样式导入
// import './common/style/font.scss';//字体
import './common/style/font-alibaba-ltn.scss';//iconfont
import './common/style/common.scss';

// 导入工具库
import WhiteListRoute from './utils/WhiteListRoute';

import user from './model/User';
console.log('用户信息:',user);
ReactDOM.render(
  <Router>
    <Route path="/" render={({location})=>{
      let routeName = location.pathname;
      if(WhiteListRoute[routeName]){
        return  <Route path="/user" component={UserRoutesLoader} />
      }else{
        if(user.userInfo.sessionKey){
          return (<div>
            <Route path="/account" component={HomeRoutesLoader} />
            <Route path="/user" component={UserRoutesLoader} />
            <Route exact path="/" render={()=>{
              return <Redirect to="/account/viewall"/>
            }} />
            </div>)
        }else{
          return <Redirect to="/user/login"/>
        }
      }
    }}/>
  </Router>,
  document.getElementById('root')
)
