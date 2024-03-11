export const oktaConfig = {
	clientId: '0oafpm3o3pyDCdkoT5d7',
	issuer: 'https://dev-96325729.okta.com/oauth2/default',
	redirectUri: 'http://localhost:3000/login/callback',
	scopes: ['openid', 'profile', 'email'],
	pkce: true,
	disableHttpsCheck: true,
};
