import React from 'react';
// import PropTypes from 'prop-types';
import {Form,Navbar,Col,Button,Nav,Alert} from 'react-bootstrap';
import styles from './Login.module.css';
import AuthService from '../../services/AuthService.js';

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {fields:{},errors:{},alert:false,alertType:'danger',message:''};
		this.submitHandler = this.submitHandler.bind(this);
		this.updateField = this.updateField.bind(this);
		this.validator = this.validator.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
		this.alertref = React.createRef();
	}
	hideMessage(){
		this.setState({alert:false});
	}
	render() { 
	return	(
  	<div className={styles.Login}>
  		<div className="d-flex justify-content-center">
    		<Form className="col-lg-4 mt-5" onSubmit={this.submitHandler.bind(this)}>
    			<Alert as="div" ref={this.alertref} show={this.state.alert} onClose={this.hideMessage} variant={this.state.alertType} dismissible>{this.state.message}</Alert>
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
     			<Form.Group className="text-center">
     				<Button type="submit">Login</Button>
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
			AuthService.login(this.state.fields).then((res)=>{
				res.json().then(resp => {
					if(resp.code == 200){
						this.setState({alert:true,alertType:'success',message:resp.message});
						AuthService.setToken(resp.data.api_token);
						setTimeout(this.props.history.push('profile'),1000);
					} else if(resp.code == 400) {
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

		if(!fields['email']) errors['email'] = "Please enter email";
		else errors['email'] = '';

		if(!fields['password']) errors['password'] = "Please enter password";
		else errors['password'] = '';

		this.setState(errors);

		return !errors['name'] && !errors['email'] && !errors['password'] && !errors['confirm'];
	}
}

export default Login;
