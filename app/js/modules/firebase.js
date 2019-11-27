import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyBN1M6KfSOksbD_0iAC9jZMfpJPHNnjkDU",
	authDomain: "device-check-in-out.firebaseapp.com",
	databaseURL: "https://device-check-in-out.firebaseio.com",
	projectId: "device-check-in-out",
	storageBucket: "device-check-in-out.appspot.com",
	messagingSenderId: "830831506131",
	appId: "1:830831506131:web:92f5ce83ce417e3e5fda26"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const fieldValue = firebase.firestore.FieldValue;
