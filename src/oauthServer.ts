var oauthServer = require('oauth2-server')
var Request = oauthServer.Request
var Response = oauthServer.Response

import * as Model from './oauthModelUtil'

let oauthServerInstance

const oauthModel = {
  getAccessToken: Model.getAccessToken,
  getRefreshToken: Model.getRefreshToken,
  getClient: Model.getClient,
  getUser: Model.getUser,
  saveToken: Model.saveToken,
  getUserFromClient: Model.getUserFromClient,
  revokeToken: Model.revokeToken
}

function checkOAuthServer() {
  if(!oauthServerInstance) {
    oauthServerInstance = new oauthServer({
      model: oauthModel
    })
  }
}

export const getOAuthServer = () => {
  checkOAuthServer()

  return oauthServerInstance
}

