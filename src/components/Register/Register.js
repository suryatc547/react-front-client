import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Register.module.css';
import {Form,Button,Alert} from 'react-bootstrap';
import AuthService from '../../services/AuthService.js';

class Register extends React.Component{ 
	constructor(props){
		super(props);
		this.state = {fields:{},errors:{},alert:false,alertType:'danger',message:''};
		this.submitHandler = this.submitHandler.bind(this);
		this.updateField = this.updateField.bind(this);
		this.validator = this.validator.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
		this.alertref = React.createRef();
		document.title = 'Register';
	}
	hideMessage(){
		this.setState({alert:false});
	}
	render(){
	return (
  	<div className={styles.Register}>
  		<div className="d-flex justify-content-center">
    		<Form id="register-form" className="col-lg-4 mt-5" onSubmit={this.submitHandler.bind(this)}>
    			<Alert as="div" ref={this.alertref} show={this.state.alert} onClose={this.hideMessage} variant={this.state.alertType} dismissible>{this.state.message}</Alert>
     			<Form.Group className="text-left">
     				<Form.Label>User Name</Form.Label>
     				<Form.Control id="name" name="name" type="text" onChange={this.updateField}/>
     				<label style={{display:this.state.errors['name']?'block':'none'}} className="error">{this.state.errors['name']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Email</Form.Label>
     				<Form.Control id="email" name="email" type="email" onChange={this.updateField} />
     				<label style={{display:this.state.errors['email']?'block':'none'}} className="error">{this.state.errors['email']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Password</Form.Label>
     				<Form.Control id="password" name="password" type="password" onChange={this.updateField} />
     				<label style={{display:this.state.errors['password']?'block':'none'}} className="error">{this.state.errors['password']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Confirm Password</Form.Label>
     				<Form.Control id="confirm" name="confirm"  onChange={this.updateField} type="password" />
     				<label style={{display:this.state.errors['confirm']?'block':'none'}} className="error">{this.state.errors['confirm']}</label>
     			</Form.Group>
     			<Form.Group className="text-left">
     				<Form.Label>Profile</Form.Label>
     				<Form.Control id="profile" accept="image/jpeg,image/jpg,image/png" name="profile"  onChange={this.updateField} type="file" />
     				<label style={{display:this.state.errors['profile']?'block':'none'}} className="error">{this.state.errors['profile']}</label>
     			</Form.Group>
     			<Form.Group className="text-center">
     				<img alt="profile" style={{display:'none'}} id="profile-view" src="" width="100" height="100" />
     			</Form.Group>
     			<Form.Group className="text-center">
     				<Button type="submit">Register</Button>
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
			AuthService.register(document.getElementById('register-form')).then(res => {
				res.json().then(resp => {
					if(resp.code === 200){
						this.setState({alert:true,alertType:'success',message:resp.message});
						setTimeout(this.props.history.push('login'),1000);
					} else if(resp.code === 400) {
						let errors = {};
						for(var key in resp.data) errors[key] = resp.data[key][0];
						this.setState({errors:errors});
					} else 
						this.setState({alert:true,alertType:'danger',message:resp.message});
				}).catch(e => console.log(e));
			}).catch(e => console.log(e));
		}
		console.log(this.state.fields)
	}
	validator(){
		let fields = this.state.fields;
		let errors = this.state.errors;

		if(!fields['name']) errors['name'] = "Please enter username";
		else if(!fields['name'].match(/^[a-zA-Z ]+$/)) errors['name'] = "Enter valid username";
		else errors['name'] = '';

		if(!fields['email']) errors['email'] = "Please enter email";
		else if(!fields['email'].match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/))
			errors['email'] = "Please enter valid email";
		else errors['email'] = '';

		if(!fields['password']) errors['password'] = "Please enter password";
		else if(fields['password'].length < 8) errors['password'] = "Password should have minimum 8 characters";
		else if(fields['password'].length > 13) errors['password'] = "Password should not exceed maximum 13 characters";
		else errors['password'] = '';

		if(!fields['confirm']) errors['confirm'] = "Please enter confirm password";
		else if(fields['confirm'] !== fields['password']) errors['confirm'] = "Confirm password should be same as password";
		else errors['confirm'] = '';

		if(!fields['profile']) errors['profile'] = "Please update profile picture";
		else if(fields['profile']){
			let file = document.getElementById('profile');
			let extension = (file && file.files[0] && file.files[0].type) ? file.files[0].type.split('/')[1] :'';
			if(['jpeg','png','jpg'].indexOf(extension) === -1){
				errors['profile'] = "Only jpeg / jpg / png images allowed";
			} else {
				AuthService.imageInfo(file);
				errors['profile'] = '';
			}
		} else errors['profile'] = '';

		this.setState(errors);

		return !errors['name'] && !errors['email'] && !errors['password'] && !errors['confirm'] && !errors['profile'];
	}
}

export default Register;
