/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1597902597920_3310';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  config.security = {
    // 关闭安全模式
    csrf: {
      enable: false,
    },
    // 网络白名单
    // domainWhiteList: [ '*' ],
  };

  config.cors = {
    // 哪些跨域(上面网络白名单了这就不设)
    origin: '*',
    //  允许cook跨域
    credentials: true,
    //  哪些请求可跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 配置egg-mysql
  config.mysql = {
    // database configuration
    client: {
      // host
      host: '120.26.162.121',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: 'yu1092517087',
      // database
      database: 'listbuilder', // 操作的数据库表
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  // 上传文件配置
  config.multipart = {
    mode: 'file',
    fileExtensions: [ // 新增文件类型  fileExtensions属性为 whilelist 新增文件白名单  此处支持 .xlsx 后缀文件
      'bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp',
    ],
  };

  return {
    ...config,
    ...userConfig,
  };
};
