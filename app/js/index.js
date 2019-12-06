import {auth,db} from './modules/firebase';
import NewUser from './classes/newUser';

let accountData;

let verifyLoginData = (object) => {
	if ((object.phone).length !== 11) {
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

let signUp = (event) => {
	event.preventDefault();

	accountData = new NewUser(
		document.getElementById('first-name-field').value,
		document.getElementById('second-name-field').value,
		document.getElementById('phone-number-field').value,
		document.getElementById('email-field').value,
		document.querySelectorAll('.password-field')[0].value,
		document.querySelectorAll('.password-field')[1].value,
	)

	if (verifyLoginData(accountData)) {
		auth.createUserWithEmailAndPassword(accountData.email,accountData.password)
		.then((user) => {
			alert('successfully created user account');
			delete accountData.password;
			delete accountData.password2;
			accountData.uid = user.user.uid;
			accountData = Object.assign({}, accountData);
			db.collection("users").doc(user.user.uid).set(accountData);
			document.querySelector('#main-signup-form').reset();
		})
		.catch((error) => {
			document.querySelector('#main-signup-form').reset();
			alert(`ERROR: ${error.message}`);
		})
	}
}

let logIn = (event) => {
	event.preventDefault();
	let loginData = {
		loginEmail: document.getElementById('login-email').value,
		loginPassword: document.getElementById('login-password').value
	}
	auth.signInWithEmailAndPassword(loginData.loginEmail, loginData.loginPassword).catch((error) => {
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

document.querySelector('#signupButton').addEventListener('click', signUp, false);
document.querySelector('#loginButton').addEventListener('click', logIn, false);
