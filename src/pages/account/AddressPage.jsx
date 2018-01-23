import React from 'react';
import { Cascader,Modal } from 'antd';
import addressData  from './comments/addressData';
import AccountWrapModule from './comments/AccountWrapModule';
import Head from './comments/Head';
import {
  getAddressData,
  addAddressData,
  upDateAddressData,
  delAddressData,
  personalInfo
} from '../../api/DataApi';

import lodash from 'lodash';
import Cookies from '../../utils/Cookies';
import user from '../../model/User';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';

import './AddressPage.scss';

const confirm = Modal.confirm;
const manageData=(value)=>{
  var str=value.join(',');
  return str;
}
//有地址
class HasAddress extends React.Component {
  constructor(props) {
    super(props);
  }
  goDelete() {
    confirm({
      title: '温馨提示',
      content: '你确定删除地址吗？',
      onOk:()=> {
        this.deleteAddress(this.props.data.id);
      }
    });
  }
  //删除地址API
  deleteAddress(id) {
    delAddressData(id)
    .then((data)=>{
      location.reload();
    },(error)=>{
      confirm({
        title: '温馨提示',
        content: error.message
      });
    })
  }
  render() {
    const { data,toggleEvent }=this.props;
    return(
        <table className="account-table-list">
          <thead>
            <tr>
              <th>收货人</th>
              <th>所在地区</th>
              <th>详细地址</th>
              <th>手机号码</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.consigneeName}</td>
              <td>{data.location}</td>
              <td>{data.detailAddress}</td>
              <td>{data.mobileNo}</td>
              <td>
                <span className="go-edit" onClick={()=>toggleEvent('3')}>编辑</span>
                <span className="go-del" onClick={()=>this.goDelete()}>删除</span>
              </td>
            </tr>
          </tbody>
        </table>
    )
  }
}
//编辑地址
class EditAddress extends React.Component {
  constructor(props) {
    const { data } = props;
    super(props);
    this.state={
      userValue:data.consigneeName,
      mobileValue:data.mobileNo,
      locationValue:data.location,
      addressValue:data.detailAddress,
      disabled:false,
      id:data.id,
      errorText:'',
      visible:false
    }
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { userValue,mobileValue,addressValue } =this.state;
    switch(eleId) {
      case '0':
        userValue=value;
        break;
      case '1':
        mobileValue=value;
        break;
      case '2':
        addressValue=value;
        break;
    }
    let disabled= lodash.isEmpty(userValue)||lodash.isEmpty(mobileValue)||lodash.isEmpty(addressValue);
    this.setState({
      disabled,
      userValue,
      mobileValue,
      addressValue,
      visible:false
    })
  }
  //校验手机号码
  checkPhone() {
    const value = this.state.mobileValue;
    if(!RegExpUtil.mobile.test(value)) {
      this.setState({
        errorText:'请输入正确的手机号码'
      })
      return false
    } else {
      return true;
    }
  }
  //表单校验
  checkForm() {
    let { mobileValue,userValue } =this.state;
    let errorText,visible=true;
    if(!RegExpUtil.userName.test(userValue)){
      errorText = '请输入正确收件人姓名';
    } else if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    } else {
      errorText='';
      visible=false;
    }
    this.setState({
      errorText,
      visible
    })
    return {
      errorText,
      visible
    }
  }
  //  城市选择事件
  addressChange(value) {
    this.setState({
      locationValue:manageData(value)
    })
  }
  //编辑地址
  upDateAddress(userValue,mobileValue,locationValue,addressValue,id) {
    upDateAddressData(userValue,mobileValue,locationValue,addressValue,id)
    .then((data)=>{
      location.reload();
    },(error)=>{
      confirm({
        title: '温馨提示',
        content: error.message,
      });
    })
  }
  //提交
  submit() {
    let {
          userValue,
          mobileValue,
          locationValue,
          addressValue,
          id,
          disabled
        } = this.state;
    if(disabled) {
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.upDateAddress(userValue,mobileValue,locationValue,addressValue);
    }
  }

  render() {
    const {
            userValue,
            mobileValue,
            locationValue,
            addressValue,
            disabled,
            visible,
            errorText
          } =this.state;
    return(
      <div className="edit-address-content">
        <div className="row">
          <p className="label">收货人姓名</p>
          <input
            type="text"
            data-id="0"
            onChange={(e)=>this.changeEvent(e)}
            defaultValue={userValue}
            placeholder="收货人姓名"
            className="input-one"/>
        </div>
        <div className="row">
          <p className="label">手机号码</p>
          <input
            type="text"
            data-id="1"
            maxLength="11"
            defaultValue={mobileValue}
            onChange={(e)=>this.changeEvent(e)}
            placeholder="请输入真实的手机号码"
            className="input-one"/>
        </div>
        <div className="row">
          <p className="label">
            所在地区
          </p>
          <div className="input-two">
            <Cascader
              defaultValue={locationValue.split(',')}
              options={addressData.district}
              onChange={(value)=>this.addressChange(value)} />
          </div>
        </div>
        <div className="row">
          <p className="label">详细地址</p>
          <textarea
            type="text"
            defaultValue={addressValue}
            data-id="2"
            onChange={(e)=>this.changeEvent(e)}
            placeholder="详细地址"
            className="input-textarea"/>
        </div>
        <ErrorText visible={visible} className="account-error-wrwp">
          {errorText}
        </ErrorText>
        <div className="btn-wrap">
          <button className={`save-btn ${disabled?'disabled':''}`} onClick={()=>this.submit()}>
            保存
          </button>
        </div>
      </div>
    )
  }
}
//无地址
class NoAddress extends React.Component {
  render() {
    const { toggleEvent } =this.props;
    return(
      <div className="add-address-content">
        添加收货地址
        <button className="add-btn" onClick={()=>toggleEvent('2')}>
          添加地址
        </button>
      </div>
    )
  }
}
//添加地址
class AddAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      userValue:'',
      mobileValue:'',
      locationValue:'',
      addressValue:'',
      disabled:true,
      errorText:'',
      visible:false
    }
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { userValue,mobileValue,addressValue } =this.state;
    switch(eleId) {
      case '0':
        userValue=value;
        break;
      case '1':
        mobileValue=value;
        break;
      case '2':
        addressValue=value;
        break;
    }
    let disabled= lodash.isEmpty(userValue)||lodash.isEmpty(mobileValue)||lodash.isEmpty(addressValue);
    this.setState({
      disabled,
      userValue,
      mobileValue,
      addressValue,
      visible:false
    })
  }
  //表单校验
  checkForm() {
    let { mobileValue,userValue } =this.state;
    let errorText,visible=true;
    if(!RegExpUtil.userName.test(userValue)){
      errorText = '请输入正确收件人姓名';
    } else if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    } else {
      errorText='';
      visible=false;
    }
    this.setState({
      errorText,
      visible
    })
    return {
      errorText,
      visible
    }
  }
  //  城市选择事件
  addressChange(value) {
    this.setState({
      locationValue:manageData(value)
    })
  }
  //添加地址
  addAddress(userValue,mobileValue,locationValue,addressValue) {
    addAddressData(userValue,mobileValue,locationValue,addressValue)
    .then((data)=>{
      location.reload();
    },(error)=>{
      confirm({
        title: '提示',
        content: error.message
      });
    })
  }
  //提交
  submit() {
    let {
          userValue,
          mobileValue,
          locationValue,
          addressValue,
          id,
          disabled
         } = this.state;
    if(disabled) {
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.addAddress(userValue,mobileValue,locationValue,addressValue);
    }
  }
  render() {
    const { disabled,visible,errorText } =this.state;
    return(
      <div className="edit-address-content">
        <div className="row">
          <p className="label">收货人姓名</p>
          <input
            type="text"
            data-id="0"
            placeholder="收货人姓名"
            onChange={(e)=>this.changeEvent(e)}
            className="input-one"/>
        </div>
        <div className="row">
          <p className="label">手机号码</p>
          <input
            type="text"
            data-id="1"
            maxLength="11"
            onChange={(e)=>this.changeEvent(e)}
            placeholder="请输入真实的手机号码"
            className="input-one"/>
        </div>
        <div className="row">
          <p className="label">
            所在地区
          </p>
          <div className="input-two">
            <Cascader
              placeholder={'请输入地区'}
              options={addressData.district}
              onChange={(value)=>this.addressChange(value)} />
          </div>
        </div>
        <div className="row">
          <p className="label">详细地址</p>
          <textarea
            type="text"
            data-id="2"
            onChange={(e)=>this.changeEvent(e)}
            placeholder="详细地址"
            className="input-textarea"/>
        </div>
        <ErrorText visible={visible} className="account-error-wrwp">
          {errorText}
        </ErrorText>
        <div className="btn-wrap">
          <button
            className={`save-btn ${disabled?'disabled':''}`} onClick={()=>this.submit()}>
            保存
          </button>
        </div>
      </div>
    )
  }
}

class AddressPage extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      data:{},
      toggle:0//0无地址，1有地址，2添加地址，3编辑地址
    }
  }
  componentWillMount() {
    document.title = '收货地址';
    personalInfo();
    this.searchAddress();
  }
  //获取地址
  searchAddress() {
    getAddressData()
    .then((data)=>{
      this.setState({
        data:data.addressDTO,
        toggle:data.addressDTO?'1':'0'
      })
    },(error)=>{
      if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
        location.hash=`/user/login?backUrl=${this.props.match.path}`;
      }
    })
  }

  toggleEvent(value) {
    this.setState({
      toggle:value
    })
  }

  render() {
    const { data,toggle }= this.state;
    let Mod;
    if(toggle==1) {//0无地址，1有地址，2添加地址，3编辑地址
      Mod=HasAddress
    } else if(toggle==3) {//3编辑地址
      Mod=EditAddress
    } else if(toggle==0) {//0无地址
      Mod=NoAddress
    } else if(toggle==2) {//2添加地址
      Mod=AddAddress
    }
    return(
      <AccountWrapModule itemId='8' {...this.props}>
        <div className="main-pages-wrap address-page">
          <Head title="我的地址"/>
          <div className="content-action">
            <Mod data={data} toggleEvent={(value)=>this.toggleEvent(value)}/>
          </div>
        </div>
      </AccountWrapModule>
    )
  }
}


export default AddressPage;
