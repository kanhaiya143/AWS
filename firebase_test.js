

var firebase = require("firebase-admin");
var serviceAccount = require('/Users/kanhaiya/nowgg_dev/backend/prod.json');
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
});



async function getAndroidInstanceData(region, db) {
	const doc = await db
		.collection('user_instance_pool')
		// .where('region', '==', region)
		.get();

	if (doc.exists) {
		return doc.data();
	} else {
		return null;
	}
}

const region = "us-east-1"

async function get() {
	const db = firebase.firestore();
	return await getAndroidInstanceData(region, db);
}

console.log(get())
