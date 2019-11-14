import {auth,db,provider} from './modules/firebase';

let signOutButton = document.querySelector('#sign-out-button');

let userData = {};

document.addEventListener('DOMContentLoaded', () => {

	auth.onAuthStateChanged((user) => {
		if (user) { //If user is logged in from entering new page
			const docRef = db.collection('users').doc(user.uid);

			docRef.get().then((doc) => {
				let data = doc.data();

				userData = {
					userEmail: data.email,
					userFirst: data.first,
					userLast: data.last,
					userPhone: data.phone
				}

				document.querySelector('#firstname').innerHTML = `First Name: ${userData.userFirst}`;
				document.querySelector('#lastname').innerHTML = `First Name: ${userData.userLast}`;
				document.querySelector('#email').innerHTML = `First Name: ${userData.userEmail}`;
				document.querySelector('#phone').innerHTML = `First Name: ${userData.userPhone}`;

			}).catch((error) => {
				console.log(error);
			});


		} else { //If there is an unknown user trying to enter the new page
			console.log('does not exist!!!');
			userData = {};
			window.location = 'index.html';
		}

		signOutButton.addEventListener('click', () => {

			auth.signOut().then(() => {//sign out successful
				window.location = 'index.html';
			}).catch((error) => {//sign out unsuccessful
				console.log(error);
			})


		});




	});
})
