import {db} from './firebase';

const storedProcedures = (function storedProcedures() { //keep procedures here

	let deviceProcedure = (doc) => {
		return db.collection("devices").doc(doc)
	}

	let propertiesProcedure = (doc) => {
		return db.collection("properties").doc(doc)
	}

	let usersProcedure = (doc) => {
		return db.collection("users").doc(doc)
	}

	return { //return procedures here
		deviceProcedure,
		propertiesProcedure,
		usersProcedure
	};
}());

export default storedProcedures;
