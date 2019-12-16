//Imports
import {auth,db,fieldValue} from './modules/firebase';
import Modal from './modules/modal';
import Device from './classes/device';

//DOM selection
let signOutButton = document.querySelector('#sign-out-button');
let registerDeviceButton = document.querySelector('#register-device-button');
let checkOutSelect = document.getElementById('device-select-out');
let checkOutButton = document.getElementById('device-button-out');
let deviceOutHrs = document.querySelector('#device-check-in-time-hours');
let deviceOutMins = document.querySelector('#device-check-in-time-mins');
let tableElement = document.querySelector('.device-table');
let tableBody = document.querySelector('#device-table-body');
let deviceCheckInAdminSelect = document.querySelector('#admin-device-check-in-select');
let deviceCheckOutAdminSelect = document.querySelector('#admin-device-check-out-select');
let userCheckOutAdminSelect = document.querySelector('#admin-user-check-out-select');
let deviceModalName = document.getElementById('modal-device-name');
let deviceModalType = document.getElementById('modal-device-type');
let deviceModalAvailability = document.getElementById('modal-device-availability');
let adminDeviceButton = document.getElementById('main-admin-devices-button');
let adminDeviceCheckInButton = document.querySelector('#admin-check-in-button');
let adminDeviceCheckOutButton = document.querySelector('#admin-check-out-button');
let adminPropertiesButton = document.querySelector('#main-admin-properties-button');
let adminDeviceDeleteSelect = document.querySelector('#admin-device-delete-select'); // 1
let adminDeviceDeleteButton = document.querySelector('#admin-device-delete-button'); // 2

//Global variables
let currentUser;
let newDeviceNameFieldValue;
let newDeviceTypeFieldValue;
let newDeviceNotesFieldValue;
let newDevice;
let userData = {};
let newDeviceObj;
let currentDeviceButton;
let selectValue;
let checkOutData = {};
let checkDoc;
let data;
let el;
let deviceRowArr;
let modalDeviceName;
let modalDeviceType;
let modalDeviceAvailability;
let adminCheckOutUserArr = [];
let adminCheckOutUserVal;
let adminCheckOutDeviceVal;
let counterDeviceArr = [];

//Functions
let adminProperties = () => {
	console.log(123);



	Modal.openModal('properties-admin');
}

let adminDeleteFunc = () => {
	console.log(adminDeviceDeleteSelect.value);

	db.collection("devices").doc(adminDeviceDeleteSelect.value).delete();


}

let adminDeviceButtonFunc = () => {
	manageDeviceAdminSelectGenerator();
	Modal.openModal('device-admin');
}

let adminDeviceCheckIn = (event) => {
	event.preventDefault();

	db.collection("devices").doc(document.querySelector('#admin-device-check-in-select').value).update({
		checkOutUserEmail: fieldValue.delete(),
		checkOutUserId: fieldValue.delete(),
		deviceAvailability: 'available'
	});
}

let adminDeviceCheckOut = (event) => {
	event.preventDefault();

	adminCheckOutDeviceVal = document.querySelector('#admin-device-check-out-select').value;
	adminCheckOutUserVal = document.querySelector('#admin-user-check-out-select').value;

	db.collection('users').doc(adminCheckOutUserVal).get().then(function(doc) {
		doc = doc.data();
		checkOutData = {
			checkOutUserId : adminCheckOutUserVal,
			checkOutUserEmail : doc.email,
			deviceAvailability: 'unavailable'
		}
		db.collection('devices').doc(adminCheckOutDeviceVal).update(checkOutData);

	}).catch(function(error) {
		console.log("Error getting document:", error);
	});
}

let manageDeviceAdminSelectGenerator = () => {
	if (document.querySelectorAll('.admin-select-generated').length > 0) {
		document.querySelectorAll('.admin-select-generated').forEach(selectItem => {
			selectItem.remove()
		})
	}

	db.collection("devices").where('deviceAvailability', '==', 'unavailable').get().then(querySnapshot => {

		querySnapshot.forEach(function(doc) {
			doc = doc.data();
			el = `<option value="${doc.deviceName}" class="device-admin-in admin-select-generated">${doc.deviceName}</option>`;
			deviceCheckInAdminSelect.insertAdjacentHTML('beforeend', el);
		});
	});

	db.collection("devices").where('deviceAvailability', '==', 'available').get().then(querySnapshot => {

		querySnapshot.forEach(function(doc) {
			doc = doc.data();
			el = `<option value="${doc.deviceName}" class="device-admin-out admin-select-generated">${doc.deviceName}</option>`;
			deviceCheckOutAdminSelect.insertAdjacentHTML('beforeend', el);
		});
	});

	db.collection('users').get().then(snapshot => {
		snapshot.forEach(doc => {
			doc = doc.data();
			el = `<option value="${doc.uid}" class="user-admin-out admin-select-generated">${doc.first} ${doc.last}</option>`;
			userCheckOutAdminSelect.insertAdjacentHTML('beforeend', el);
		});
	  })
	  .catch(err => {
		alert('Error getting documents', err);
	  });


	db.collection('devices').get().then(snapshot => {
		snapshot.forEach(doc => {
			doc = doc.data();
			el = `<option value="${doc.deviceName}" class="user-admin-out admin-select-generated">${doc.deviceName}</option>`;
			adminDeviceDeleteSelect.insertAdjacentHTML('beforeend', el);
		});
	})
	.catch(err => {
		alert('Error getting documents', err);
	});
}

let viewDeviceModal = (event) => {
	event.preventDefault();
	modalDeviceName = event.path[1].childNodes[0].innerHTML;
	db.collection("devices").doc(modalDeviceName).get().then(doc => {
		doc = doc.data();
		modalDeviceName = doc.deviceName;
		modalDeviceType = doc.deviceType;
		modalDeviceAvailability = doc.deviceAvailability;
		deviceModalName.innerHTML = `Device Name: ${modalDeviceName}`;
		deviceModalType.innerHTML = `Device Type: ${modalDeviceType}`;
		deviceModalAvailability.innerHTML = `Device Availability: ${modalDeviceAvailability}`;
	})
	Modal.openModal('device');
}

let generateTable = () => { //loop that creates rows and adds them to table
	deviceRowArr = [];
	for (let i = tableElement.rows.length - 1; i> 0; i--) {
		tableElement.deleteRow(i);
	}

	db.collection("devices").get().then(deviceCollRef => {
		deviceCollRef.forEach((doc) => {
			data = doc.data();
			el = `<tr class="dynamic-table-row"><td>${data.deviceName}</td><td>${data.deviceType}</td><td>${data.deviceAvailability}</td></tr>`;``

			deviceRowArr.push(el);

		});
		deviceRowArr = deviceRowArr.join(' ');
		tableBody.insertAdjacentHTML('beforeend', deviceRowArr);

		document.querySelectorAll('.dynamic-table-row').forEach((el) => {
			el.addEventListener('click', viewDeviceModal)
		})
	});
}


let generateSelections = () => {
	document.querySelectorAll('.device-option-out').forEach(n => n.remove());
	db.collection("devices").where('deviceAvailability', '==', 'available').get().then(querySnapshot => {

		querySnapshot.forEach(function(doc) {
			doc = doc.data();
			el = `<option value="${doc.deviceName}" class="device-option-out">${doc.deviceName}</option>`;
			checkOutSelect.insertAdjacentHTML('beforeend', el);
		});
	});
}

let checkOutValidation = () => {
	if (deviceOutHrs.value && deviceOutMins.value != '') {
		return true;
	} else {
		return false;
	}
}

let CheckOutInit = (event) => {
	event.preventDefault();

	if (checkOutValidation()) {
		selectValue = document.getElementsByTagName("option")[checkOutSelect.selectedIndex].value;

		checkOutData = {
			checkOutUserId : auth.currentUser.uid,
			checkOutUserEmail : auth.currentUser.email,
			deviceAvailability: 'unavailable'
		}
		db.collection("devices").doc(selectValue).update(checkOutData);
	} else {
		alert('check out failed :(');
	}
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
		counterDeviceArr = [];
		db.collection('devices').where('deviceAvailability', '==', 'unavailable')
		.where('checkOutUserId','==',currentUser)
		.get().then(querySnapshot => {
			querySnapshot.forEach(doc => {
				doc = doc.data();
				counterDeviceArr.push(doc);
			})
			document.getElementById('device-out-counter').innerHTML = `(${counterDeviceArr.length})`;
		})

		document.querySelectorAll('.device-list-item-button').forEach(item => {
			item.addEventListener('click', checkInItem);
		});


	});
}

let checkInItem = (event) => {
	currentDeviceButton = event.target;
	db.collection("devices").doc(currentDeviceButton.getAttribute('data-devicename')).update({
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

	checkOutButton.addEventListener('click', CheckOutInit, false);
	adminDeviceButton.addEventListener('click', adminDeviceButtonFunc, false);
	adminDeviceCheckInButton.addEventListener('click', adminDeviceCheckIn, false);
	adminDeviceCheckOutButton.addEventListener('click', adminDeviceCheckOut, false);
	adminDeviceDeleteButton.addEventListener('click', adminDeleteFunc, false);
	adminPropertiesButton.addEventListener('click', adminProperties, false);


}

let generateTableListener = () => {
	db.collection('devices')
		.onSnapshot(doc => {
			generateTable();
			generateSelections();
			manageDeviceAdminSelectGenerator();
			CheckInInit();
		})
}

let init = () => {
	setButtonListeners();
	authChangeFunction();
	Modal.init();
	generateTable();
	generateTableListener();

}

init();
