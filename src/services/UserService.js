import apiUrl from './ApiConfig.js';
import AuthService from './AuthService.js';
class UserService{
	constructor(){
		this.apiUrl = apiUrl;
		this.apiToken = AuthService.getToken();
	}
	getUserData(){
		return fetch(this.apiUrl+'/user?api_token='+this.apiToken);
	}
	updateProfile(form){
		let data = new FormData(form);
		// data.append('api_token',this.apiToken);
		data.append('_method','PUT');
		let headerData = new Headers();
		// headerData.append('Accept','multipart/form-data');
		// headerData.append('Origin','http://localhost:3000');
		// headerData.append('Host','localhost:3000');
		headerData.append('Authorization','Bearer '+this.apiToken);
		// headerData.append('Content-Type','application/json');
		let obj = {
			method:'POST',
			body:data,
			headers:headerData,
			// cache:'no-cache',
			mode:'cors',
			// credentials:'include',
		};
		return fetch(this.apiUrl+'/user/update-profile',obj);
	}
	deleteUserData(){
		let headerData = new Headers();
		headerData.append('Authorization','Bearer '+this.apiToken);
		let obj = {
			method:'DELETE',
			headers:headerData,
		};
		return fetch(this.apiUrl+'/user/delete-profile',obj);
	}
}
export default new UserService();