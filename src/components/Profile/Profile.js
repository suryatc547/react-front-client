import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Profile.module.css';
import {Form,Alert,Button} from 'react-bootstrap';
import AuthService from '../../services/AuthService.js';
import UserService from '../../services/UserService.js';

class Profile extends React.Component {
	constructor(props){
		super(props);
		this.state = {fields:{name:'',email:'',phone:'',profile:''},errors:{},alert:false,alertType:'danger',message:''};
		this.submitHandler = this.submitHandler.bind(this);
		this.updateField = this.updateField.bind(this);
		this.validator = this.validator.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
		this.alertref = React.createRef();
		this.getUserData = this.getUserData.bind(this);
		this.deleteUserData = this.deleteUserData.bind(this);
		document.title = 'Profile';
	}
	componentDidMount(){
		this.getUserData();
	}
	hideMessage(){
		this.setState({alert:false});
	}
	deleteUserData(){
		if(window.confirm('Are you sure? Do you want to delete your account?')){
			UserService.deleteUserData().then(res => {
				res.json().then(resp => {
					if(resp.code === 200 && resp.data){
						this.setState({alert:true,alertType:'success',message:resp.message});
						AuthService.removeToken();
						setTimeout(() => {
							window.location.href = window.location.origin+'/login';
						},1000);
					} else this.setState({alert:true,alertType:'danger',message:resp.message});
				}).catch(e => console.log(e));
			}).catch(e => console.log(e));
		}
	}
	getUserData(){
		UserService.getUserData().then(res => {
			res.json().then(resp => {
				if(resp.code === 200 && resp.data) {
					let userData = {};
					for(var key in resp.data) userData[key] = resp.data[key];
					this.setState({fields:userData});
				} else 
					this.setState({alert:true,alertType:'danger',message:resp.message});
			}).catch(e => console.log(e));
		}).catch(e => console.log(e));
	}
	render() { 
	return	(
  	<div className={styles.Profile}>
  		<div className="d-flex justify-content-center">
    		<Form id="update-profile" className="col-lg-4 mt-5" onSubmit={this.submitHandler.bind(this)}>
    			<Alert as="div" ref={this.alertref} show={this.state.alert} onClose={this.hideMessage} variant={this.state.alertType} dismissible>{this.state.message}</Alert>
     			<Form.Group className="text-left">
     				<Form.Label>User Name</Form.Label>
     				<Form.Control id="name" name="name" type="text" onChange={this.updateField} value={this.state.fields['name']}/>
     				<label style={{display:this.state.errors['name']?'block':'none'}} className="error">{this.state.errors['name']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Email</Form.Label>
     				<Form.Control disabled="disabled" id="email" name="email" type="email" onChange={this.updateField} value={this.state.fields['email']} />
     				<label style={{display:this.state.errors['email']?'block':'none'}} className="error">{this.state.errors['email']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Phone</Form.Label>
     				<Form.Control id="phone" name="phone" type="tel" onChange={this.updateField} value={this.state.fields['phone']} />
     				<label style={{display:this.state.errors['phone']?'block':'none'}} className="error">{this.state.errors['phone']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Profile</Form.Label>
     				<Form.Control id="profile" name="profile"  onChange={this.updateField} type="file" />
     				<label style={{display:this.state.errors['profile']?'block':'none'}} className="error">{this.state.errors['profile']}</label>
     			</Form.Group>
     			<Form.Group className="text-center">
     				<img alt="profile" accept="image/jpeg,image/jpg,image/png" style={{display:this.state.fields['profile']?'block':'none'}} id="profile-view" src={this.state.fields['profile']} width="100" height="100" />
     			</Form.Group>
     			<Form.Group className="text-center">
     				<Button type="submit">Update Profile</Button>&nbsp;
     				<Button variant="danger" onClick={this.deleteUserData} type="button">Delete Profile</Button>
     			</Form.Group>
   		 	</Form>
   		</div>
    </div>
	);
	}
	updateField(e){
		let fields = this.state.fields;
		fields[e.target.name] = e.target.value;
		this.validator();
		this.setState({fields});
	}
	submitHandler(e){
		e.preventDefault();
		if(this.validator()){
			UserService.updateProfile(document.getElementById('update-profile')).then((res)=>{
				res.json().then(resp => {
					if(resp.code === 200){
						this.setState({alert:true,alertType:'success',message:resp.message});
						setTimeout(this.props.history.push('profile'),1000);
					} else if(resp.code === 400) {
						let errors = {};
						for(var key in resp.data) errors[key] = resp.data[key][0];
						this.setState({errors:errors});
					} else 
						this.setState({alert:true,alertType:'danger',message:resp.message});
				}).catch(e=>console.log(e))
			}).catch(e=>console.log(e))
		}
		console.log(this.state.fields)
	}
	validator(){
		let fields = this.state.fields;
		let errors = this.state.errors;

		if(!fields['name']) errors['name'] = "Please enter username";
		else if(!fields['name'].match(/^[a-zA-Z+$]/)) errors['name'] = "Enter valid username";
		else errors['name'] = '';

		if(!fields['phone']) errors['phone'] = "Please enter phone number";
		else if(fields['phone'].length < 10) errors['password'] = "Phone number should have minimum 10 numbers";
		else if(fields['phone'].length > 15) errors['phone'] = "Phone number should not exceed maximum 15 characters";
		else errors['phone'] = '';

		let file = document.getElementById('profile');
		if(fields['profile'] && file.value){
			let extension = (file && file.files[0] && file.files[0].type) ? file.files[0].type.split('/')[1] :'';
			if(['jpeg','png','jpg'].indexOf(extension) === -1){
				errors['profile'] = "Only jpeg / jpg / png images allowed";
			} else {
				AuthService.imageInfo(file);
				errors['profile'] = '';
			}
		} else errors['profile'] = '';

		this.setState(errors);

		return !errors['name'] && !errors['email'] && !errors['phone'] && !errors['profile'];
	}
}

export default Profile;
