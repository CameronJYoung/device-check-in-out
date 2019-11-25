import {auth,db} from './modules/firebase';
import {trigger,closeButton,toggleModal,windowOnClick} from './modules/modal';
import Device from './classes/device';

let signOutButton = document.querySelector('#sign-out-button');
let registerDeviceButton = document.querySelector('#register-device-button');

let newDeviceNameFieldValue = document.querySelector('#device-name-field').value;
let newDeviceTypeFieldValue = document.querySelector('#device-type-field').value;
let newDeviceNotesFieldValue = document.querySelector('#device-notes-field').value;

let newDevice;

let userData = {};
let deviceData = {}

let checkDoc;
let data;

let el;
let deviceRowArr;
let tableElement = document.querySelector('.device-table');
let tableBody = document.querySelector('#device-table-body')




let generateTable = () => { //loop that creates rows and adds them to table
	deviceRowArr = [];
	for (let i = tableElement.rows.length - 1; i> 0; i--) {
		tableElement.deleteRow(i);

	}

	db.collection("devices").get().then((deviceCollRef) => {
		deviceCollRef.forEach((doc) => {
			data = doc.data();
			el = `<tr><td>${data.deviceName}</td><td>${data.deviceType}</td><td>${data.deviceAvailability}</td></tr>`;
			deviceRowArr.push(el);

		});
		deviceRowArr = deviceRowArr.join(' ');
		tableBody.insertAdjacentHTML('beforeend', deviceRowArr);
	});


}

let generateTableListener = () => {
	db.collection('devices')
		.onSnapshot(doc => {
			generateTable();
		})
}




let authChangeFunction = () => {
	auth.onAuthStateChanged(user => {
		if (user) {
			const docRef = db.collection('users').doc(user.uid);

			docRef.get().then (doc => {
				data = doc.data();

				userData = {
					userEmail: data.email,
					userFirst: data.first,
					userLast: data.last,
					userPhone: data.phone
				}

			}).catch(error => {
				console.log(error);

			})
		} else {
			console.log(1);

			userData = {};
			window.location = 'index.html';
		}
	})
}

let setButtonListeners = () => {

	trigger.addEventListener("click", toggleModal);
	closeButton.addEventListener("click", toggleModal);
	window.addEventListener("click", windowOnClick);

	signOutButton.addEventListener('click', () => {
		auth.signOut().then(() => {//sign out successful
			window.location = 'index.html';
		}).catch(error => {//sign out unsuccessful
			console.log(error);
		})
	});

	registerDeviceButton.addEventListener('click', () => {
		event.preventDefault();

		newDevice = new Device(newDeviceNameFieldValue.value,newDeviceNotesFieldValue.value,newDeviceTypeFieldValue.value);

		checkDoc = db.collection('devices').doc(deviceData.deviceName);
		checkDoc.get().then(doc => {
			data = doc.data();
			if (data == undefined) {
				if (newDeviceNameFieldValue && newDeviceTypeFieldValue && newDeviceNotesFieldValue) {
					db.collection("devices").doc(newDevice.deviceName).set(Object.assign({},newDevice));
					document.getElementById('completed-register').innerHTML = `set ${deviceData.deviceName}`;
					setTimeout(() => {
						document.getElementById('completed-register').innerHTML = ``;
					}, 1000);
					document.querySelector('#main-device-form').reset();
				} else {
					alert('missing fields');
				}
			} else {
				alert(`${data.deviceName} already exists`);
				document.querySelector('#main-device-form').reset();
				return false;
			}
		})
	});
}

let init = () => {
	authChangeFunction();
	setButtonListeners();
	generateTable();
	generateTableListener();
}

init();
