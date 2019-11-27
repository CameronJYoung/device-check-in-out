import {auth,db,fieldValue} from './modules/firebase';
import Device from './classes/device';

let signOutButton = document.querySelector('#sign-out-button');
let registerDeviceButton = document.querySelector('#register-device-button');
let currentUser;

let newDeviceNameFieldValue;
let newDeviceTypeFieldValue;
let newDeviceNotesFieldValue;

let newDevice;

let userData = {};
let newDeviceObj;

let currentDeviceButton;

let checkOutSelect = document.getElementById('device-select-out');
let checkOutButton = document.getElementById('device-button-out');
let checkOutDate = document.getElementById('device-date-out');
let checkOutTime = document.getElementById('device-time-out');
let checkOutDateVal;
let checkOutTimeVal;
let selectValue;
let checkOutData = {};//set data to this object then add it to the one on database

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

	db.collection("devices").get().then(deviceCollRef => {
		deviceCollRef.forEach((doc) => {
			data = doc.data();
			el = `<tr class="dynamic-table-row" ><td>${data.deviceName}</td><td>${data.deviceType}</td><td>${data.deviceAvailability}</td></tr>`;
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
			generateSelections();
			CheckInInit();
		})
}

let generateSelections = () => {
	document.querySelectorAll('.device-option-out').forEach(n => n.remove());
	db.collection("devices").where('deviceAvailability', '==', 'available').get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc = doc.data();
			el = `<option value="${doc.deviceName}" class="device-option-out">${doc.deviceName}</option>`;
			checkOutSelect.insertAdjacentHTML('beforeend', el);
		});
	});
}

let CheckOutInit = (event) => {

	event.preventDefault();

	selectValue = document.getElementsByTagName("option")[checkOutSelect.selectedIndex].value;
	checkOutDateVal = checkOutDate.value;
	checkOutTimeVal = checkOutTime.value;
	console.log(`${checkOutDate} + ${checkOutTime}`);

	checkOutData = {
		checkOutUserId : auth.currentUser.uid,
		checkOutUserEmail : auth.currentUser.email,
		checkOutTime : checkOutTimeVal,
		checkOutDate : checkOutDateVal,
		deviceAvailability: 'unavailable'
	} // add time restrictions
	console.log(checkOutData);

	db.collection("devices").doc(selectValue).update(checkOutData);


}

let CheckInInit = () => {
	currentUser = auth.currentUser.uid;
	document.querySelectorAll('.device-list-item').forEach(n => n.remove());
	db.collection("devices").where('checkOutUserId', '==', currentUser).get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc = doc.data();
			el = `<li class="device-list-item" data-devicename="${doc.deviceName}">${doc.deviceName}
			<button class="device-list-item-button" data-devicename="${doc.deviceName}">Check In</button></li>`;

			document.getElementById('device-out-list').insertAdjacentHTML('beforeend', el);

		});

		document.querySelectorAll('.device-list-item-button').forEach(item => {
			item.addEventListener('click', checkInItem);
		});
	});
}

let checkInItem = (event) => {
	currentDeviceButton = event.toElement;
	db.collection("devices").doc(currentDeviceButton.getAttribute('data-devicename')).update({
		checkOutDate: fieldValue.delete(),
		checkOutTime: fieldValue.delete(),
		checkOutUserEmail: fieldValue.delete(),
		checkOutUserId: fieldValue.delete(),
		deviceAvailability: 'available'
	});
	currentDeviceButton.parentElement.remove();
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
			userData = {};
			window.location = 'index.html';
		}
	})
}

let setButtonListeners = () => {

	signOutButton.addEventListener('click', () => {
		auth.signOut().then(() => {//sign out successful
			window.location = 'index.html';
		}).catch(error => {//sign out unsuccessful
			console.log(error);
		})
	});

	registerDeviceButton.addEventListener('click', (event) => {
		event.preventDefault();

		newDeviceNameFieldValue = document.querySelector('#device-name-field').value;
		newDeviceTypeFieldValue = document.querySelector('#device-type-field').value;
		newDeviceNotesFieldValue = document.querySelector('#device-notes-field').value;

		newDevice = new Device(newDeviceNameFieldValue,newDeviceNotesFieldValue,newDeviceTypeFieldValue);
		newDeviceObj = Object.assign({}, newDevice);


		checkDoc = db.collection('devices').doc(newDeviceObj.deviceName);
		checkDoc.get().then(doc => {
			data = doc.data();
			if (data == undefined) {
				if (newDeviceNameFieldValue && newDeviceTypeFieldValue && newDeviceNotesFieldValue) {
					db.collection("devices").doc(newDeviceObj.deviceName).set(newDeviceObj);
					document.getElementById('completed-register').innerHTML = `set ${newDeviceObj.deviceName}`;
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

	checkOutButton.addEventListener('click', CheckOutInit);


}

let init = () => {
	authChangeFunction();
	setButtonListeners();
	generateTable();
	generateTableListener();
}

init();
