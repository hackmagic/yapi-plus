/**
 * YAPI 常量定义
 * 用于前后端共享配置
 */

// HTTP 方法配置
const HTTP_METHOD = {
  'GET': {
    name: 'GET',
    desc: 'GET请求',
    request_body: false
  },
  'POST': {
    name: 'POST',
    desc: 'POST请求',
    request_body: true
  },
  'PUT': {
    name: 'PUT',
    desc: 'PUT请求',
    request_body: true
  },
  'DELETE': {
    name: 'DELETE',
    desc: 'DELETE请求',
    request_body: true
  },
  'HEAD': {
    name: 'HEAD',
    desc: 'HEAD请求',
    request_body: false
  },
  'OPTIONS': {
    name: 'OPTIONS',
    desc: 'OPTIONS请求',
    request_body: false
  },
  'PATCH': {
    name: 'PATCH',
    desc: 'PATCH请求',
    request_body: true
  }
};

// 默认请求方法
const DEFAULT_METHOD = 'GET';

// 请求数据类型
const REQ_BODY_TYPE = {
  FORM: 'form',
  JSON: 'json',
  FILE: 'file',
  RAW: 'raw'
};

// 默认请求数据类型
const DEFAULT_REQ_BODY_TYPE = REQ_BODY_TYPE.FORM;

// 接口状态
const INTERFACE_STATUS = {
  UNDONE: 'undone',
  DONE: 'done',
  DEPRECATED: 'deprecated'
};

// 默认接口状态
const DEFAULT_INTERFACE_STATUS = INTERFACE_STATUS.UNDONE;

// 标签类型
const TAG_TYPE = {
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info'
};

// 用户角色
const USER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
  OWNER: 'owner',
  DEV: 'dev',
  GUEST: 'guest'
};

// 项目权限类型
const PROJECT_PERMISSION = {
  PRIVATE: 'private',
  PUBLIC: 'public'
};

// 默认分页大小
const DEFAULT_PAGE_SIZE = 10;

// 最大分页大小
const MAX_PAGE_SIZE = 100;

// 本地存储键名
const STORAGE_KEY = {
  TOKEN: '_yapi_token',
  UID: '_yapi_uid',
  PROJECT_ID: '_yapi_project_id',
  GROUP_ID: '_yapi_group_id'
};

module.exports = {
  HTTP_METHOD,
  DEFAULT_METHOD,
  REQ_BODY_TYPE,
  DEFAULT_REQ_BODY_TYPE,
  INTERFACE_STATUS,
  DEFAULT_INTERFACE_STATUS,
  TAG_TYPE,
  USER_ROLE,
  PROJECT_PERMISSION,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  STORAGE_KEY
};
