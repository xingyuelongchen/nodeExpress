export default {
  oidc: {
    issuer: 'https://id.yoov.com/oauth/authorize',
    // issuer: 'https://account.connected.hk/oauth/authorize',
    clientId: 'web-app',
    redirectUri: 'http://192.168.2.57:4200/implicit/callback',
    // redirectUri: 'https://enterprise.yoov.com/implicit/callback',
    userinfoUrl: 'https://id.yoov.com/oauth/me',
    // userinfoUrl: 'https://account.connected.hk/auth/user/me',
    scope: 'openid'
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8001/api/messages'
  }
}
