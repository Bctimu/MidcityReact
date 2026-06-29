import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyCP_EHp-NdHnwyOZ49_OOEiqLUBV2irgeg',
  authDomain: 'admin-17c3d.firebaseapp.com',
  projectId: 'admin-17c3d',
  storageBucket: 'admin-17c3d.appspot.com',
  messagingSenderId: '456331474186',
  appId: '1:456331474186:web:0385a740d37862f82af6f3',
});
const db = getFirestore(app);

await addDoc(collection(db, 'stay'), {
  name: 'Holiday Inn',
  description: '',
  discount: '$120/ Night',
  image: 'e2ab44ea3cdaed8453caffc6df60dd45799f2d66ef01106c6cb23b488cf677d1.jpg',
  imageFilename: 'jqg_1588188739.jpg',
});
console.log('Added corrected Holiday Inn record');
process.exit(0);
