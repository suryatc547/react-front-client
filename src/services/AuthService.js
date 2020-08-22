import apiUrl from './ApiConfig.js';
class AuthService{
	constructor(){
		this.apiUrl = apiUrl;
	}
	login(fields){
		let body = new FormData();
		body.append('email',fields['email']);
		body.append('password',fields['password']);
		let obj = {
			method: 'POST',
			body: body,
		};
		return fetch(this.apiUrl+'/login',obj);
	}
	register(fields){
		let body = new FormData();
		for(var key in fields) body.append(key,fields[key]);
		let obj = {
			method:'POST',
			body: body,
		};
		return fetch(this.apiUrl+'/register',obj);
	}
	setToken(token){
		localStorage.setItem('r-api-token',token);
	}
	getToken(){
		return localStorage.getItem('r-api-token');
	}
	removeToken(){
		localStorage.removeToken('r-api-token');
	}
}
export default new AuthService();