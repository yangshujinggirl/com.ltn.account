import React from 'react';
import ModLoader from './ModLoader';
// 首页路由
import AccountRoutes from 'bundle-loader?lazy&name=[name]!./account/AccountRoutes';
import UserRoutes from 'bundle-loader?lazy&name=[name]!./user/UserRoutes';

export const HomeRoutesLoader = () => (
  <ModLoader mod={AccountRoutes} />
);
export const UserRoutesLoader = () => (
  <ModLoader mod={UserRoutes} />
);
