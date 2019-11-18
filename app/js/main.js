import {auth,db,provider} from './modules/firebase';

let signOutButton = document.querySelector('#sign-out-button');
let registerDeviceButton = document.querySelector('#register-device-button');

let newDeviceNameField = document.querySelector('#device-name-field');
let newDeviceTypeField = document.querySelector('#device-type-field');
let newDeviceNotesField = document.querySelector('#device-notes-field');

let userData = {};
let deviceData = {}

let checkDoc;

let setupModals = () => {
	let modal = document.querySelector(".modal");
	let trigger = document.querySelector(".modal-trigger");
	let closeButton = document.querySelector(".modal-close-button");

	let toggleModal = () => {
		modal.classList.toggle("show-modal");
	}

	let windowOnClick = (event) => {
		if (event.target === modal) {
			toggleModal();
		}
	}

	trigger.addEventListener("click", toggleModal);
	closeButton.addEventListener("click", toggleModal);
	window.addEventListener("click", windowOnClick);

}

document.addEventListener('DOMContentLoaded', () => {

	setupModals();
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
				setNewDeviceData();


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

let setNewDeviceData = () => {
	registerDeviceButton.addEventListener('click', () => {
		event.preventDefault();
		deviceData = {
			deviceName: newDeviceNameField.value,
			deviceType: newDeviceTypeField.value,
			deviceNotes: newDeviceNotesField.value
		}

		if (verifyNewDeviceData(deviceData)) {


			if (newDeviceNameField && newDeviceTypeField && newDeviceNotesField) {

				console.log(deviceData.deviceName);
				db.collection("devices").doc(deviceData.deviceName).set(deviceData);
				document.querySelector('#main-device-form').reset();
			} else {
				console.log('not happening');
			}
		} else {
			console.log('verification is broken!');

		}
	});
}

let verifyNewDeviceData = (object) => {



	if (checkDocFunction(object)) {

		if ((object.deviceName).length < 2) {
			alert(`Name to short`);
			document.querySelector('#main-device-form').reset();
			return false;
		} else if ((object.deviceType).length < 2) {
			alert(`Password has to be over 8 characters.`);
			document.querySelector('#main-device-form').reset();
			return false;
		}
		return true;

	} else {
		alert(`${object.deviceName} already exists. Ask admin to delete`);
		document.querySelector('#main-device-form').reset();
		return false;
	}



}

let checkDocFunction = (object) => {
	checkDoc = db.collection('devices').doc(object.deviceName);

	return checkDoc.get().then((doc) => {
		console.log(`${doc.exists} doc exists`);
		if (doc.exists) {
			return false;
		} else {
			console.log(doc.exists)
			return true;
		}
	});

}
