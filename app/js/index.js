import {auth,db,provider} from './modules/firebase';

let verifyLoginData = (object) => {
	if ((object.phoneNumber).length !== 11) {
		alert(`Phone Number should be an 11 digit mobile number.`);
		document.querySelector('#main-signup-form').reset();
		return false;
	} else if ((object.password).length < 8) {
		alert(`Password has to be over 8 characters.`);
		document.querySelector('#main-signup-form').reset();
		return false;
	} else if (object.password !== object.password2) {
		alert(`The password and password confirmation should be the same.`);
		document.querySelector('#main-signup-form').reset();
		return false;
	}
	return true;
}

let signUp = () => {
	event.preventDefault();
	let accountData = {
		firstName: document.getElementById('first-name-field').value,
		secondName: document.getElementById('second-name-field').value,
		phoneNumber: document.getElementById('phone-number-field').value,
		email: document.getElementById('email-field').value,
		password: document.querySelectorAll('.password-field')[0].value,
		password2: document.querySelectorAll('.password-field')[1].value
	}
	if (verifyLoginData(accountData)) {
		auth.createUserWithEmailAndPassword(accountData.email,accountData.password)
		.then((user) => {
			console.log('successfully created user account with uid: ', user.user.uid);
			db.collection("users").doc(user.user.uid).set({
				first: accountData.firstName,
				last: accountData.secondName,
				phone: accountData.phoneNumber,
				email: accountData.email,
			})
			document.querySelector('#main-signup-form').reset();
		})
		.catch((error) => {
			document.querySelector('#main-signup-form').reset();
			alert(`ERROR: ${error.message}`);
		})
	}
}

let logIn = () => {
	event.preventDefault();
	let loginData = {
		loginEmail: document.getElementById('login-email').value,
		loginPassword: document.getElementById('login-password').value
	}
	auth.signInWithEmailAndPassword(loginData.loginEmail, loginData.loginPassword).catch(function(error) {
		alert(`ERROR: ${error.message}`)
	});
	auth.onAuthStateChanged((user) => {
		if (user) {
			window.location = 'main.html';
		} else {
			console.log('does not exist!!!');
		}
	});

}

document.querySelector('#signupButton').addEventListener('click', signUp);
document.querySelector('#loginButton').addEventListener('click', logIn);
