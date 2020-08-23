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
	register(form){
		let body = new FormData(form);
		// for(var key in fields) body.append(key,fields[key]);
		let obj = {
			method:'POST',
			body: body,
		};
		return fetch(this.apiUrl+'/register',obj);
	}
	imageInfo(ele){
		if(!ele) return false;
		let file = new FileReader();
		file.readAsDataURL(ele.files[0]);
		file.onerror = e => console.log(e);
		file.onload = e => {
			let imgEle = document.getElementById(ele.id+'-view');
			if(imgEle) {
				imgEle.src = e.target.result; imgEle.style.display = 'block';
			}
		};
	}
	setToken(token){
		if(token) localStorage.setItem('r-api-token',token);
	}
	getToken(){
		return localStorage.getItem('r-api-token');
	}
	removeToken(){
		localStorage.removeItem('r-api-token');
	}
}
export default new AuthService();