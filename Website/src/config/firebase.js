import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCE4-hFEPuKMO25FTyZtUqZHjQePwQBK18',
  authDomain: 'nandani-batik.firebaseapp.com',
  projectId: 'nandani-batik',
  storageBucket: 'nandani-batik.firebasestorage.app',
  messagingSenderId: '136458000129',
  appId: '1:136458000129:web:d3f869148df0916414ad00',
  measurementId: 'G-8HZJ1P4DLQ',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
