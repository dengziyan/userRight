const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const table = require('./table')
const home = require('./home')
const userList = require('./userList')
const roleList = require('./roleList')
const menuList = require('./menuList')
const resourceList = require('./resourceList')
const opeDiary = require('./opeDiary')
const logDiary = require('./logDiary')
const online = require('./online')

const mocks = [
  ...user,
  ...table,
  ...home,
  ...userList,
  ...roleList,
  ...menuList,
  ...resourceList,
  ...opeDiary,
  ...logDiary,
  ...online
]


function mockXHR() {
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}

