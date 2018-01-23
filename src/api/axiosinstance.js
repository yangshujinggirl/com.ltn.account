import axios from 'axios';
import qs from 'qs';
import Utils from '../utils';
import user from '../model/User';

const defaultHeader = {
  // responseType: 'json',
  'Content-Type': 'application/x-www-form-urlencoded',
};

const location = window.location.href;// 获取环境

export default ({ baseURL = '', timeout = 600000, headers = defaultHeader }) => {
  // 创建请求实体
  const axiosinstance = axios.create({
    baseURL,
    timeout,
    headers,
  });
  // 请求头部拦截
  axiosinstance.interceptors.request.use((config) => {
    const { method, params = {} } = config;
    let { data = {}, url } = config;
    if (method === 'get') {
      params.clientType = 'PC';
      params.sessionKey = user.userInfo.sessionKey;
      url += '.json';
    } else if (method === 'post') {
      data.clientType = 'PC';
      data.sessionKey = user.userInfo.sessionKey;
      data = qs.stringify(data);
    } else {
      return Promise.reject({
        message: `不支持的请求${method}`,
      });
    }
    config.params = params;
    config.data = data;
    config.url = url;
    return config;
  }, error => Promise.reject({
    message: error.message || '请求参数配置异常',
  }));

  // 请求响应拦截器
  axiosinstance.interceptors.response.use((response) => {
    const { resultCode, resultMessage, data } = response.data;
    Utils.handlerSessionTimeout(resultCode);
    // 用户登录超时统一处理
    if (resultCode !== '0') {
      return Promise.reject({
        message: resultMessage || '服务器异常',
        data: response.data,
      });
    }
    return data;
  }, error => Promise.reject({
    message: error.message || '请求失败',
  }));
  return axiosinstance;
};
