import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {  addDoc } from "firebase/firestore"; // Importa addDoc desde el módulo "firebase/firestore"


import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBF7JURYI6DPVzabwTbCwtORZ5f5so-EXE",
  authDomain: "asignar-tareas.firebaseapp.com",
  projectId: "asignar-tareas",
  storageBucket: "asignar-tareas.appspot.com",
  messagingSenderId: "1031802593249",
  appId: "1:1031802593249:web:1fe2030a063698db6c7ca0"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 *
 * @param email
 * @param password
 * @returns
 */
export const fbCreateAccount = async (
  email: string,
  password: string,
  first: string,
  last: string
) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  console.log(response);
  if (response) {
    await fbSetUserProfile({ first, last, age: 67 });
    const profile = await fbGetUserProfile();
    return {
      user: response.user,
      profile,
    };
  } else {
    return {
      user: null,
      profile: null,
    };
  }
};



export const createTareasInFirestore = async (fecha: string, titulo: string, encargado: string,estado: string, fechaFinal: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Obtener la referencia a la colección "Tareas"
      const tareasCollection = collection(db, "Tareas");

      // Crear un nuevo documento en la colección "Tareas" sin especificar un ID
      const data = {
        fecha: fecha,
        titulo: titulo,
        encargado: encargado,
        estado: estado,
        fechaFinal: fechaFinal,
      };

      // Insertar los datos en la base de datos y obtener el ID asignado al nuevo documento
      const newDocRef = await addDoc(tareasCollection, data);
      console.log("Nuevo documento creado con ID:", newDocRef.id);
    } else {
      console.log("Usuario no autenticado");
    }
  } catch (error) {
    console.error("Error al ingresar datos en Firestore:", error);
  }
};

export const createPersonasInFirestore = async (nombre: string, apellido: string, ciclo: string, carrera: string) => {
  console.log("Valor de ciclo recibido en la función:", ciclo);
  try {
    const user = auth.currentUser;
    if (user) {
      // Obtener la referencia a la colección "Tareas"
      const tareasCollection = collection(db, "personas");

      // Crear un nuevo documento en la colección "Tareas" sin especificar un ID
      const data = {
        nombre: nombre,
        apellido: apellido,
        ciclo: ciclo,
        carrera: carrera,
      };

      // Insertar los datos en la base de datos y obtener el ID asignado al nuevo documento
      const newDocRef = await addDoc(tareasCollection, data);
      console.log("Nuevo documento creado con ID:", newDocRef.id);
    } else {
      console.log("Usuario no autenticado");
    }
  } catch (error) {
    console.error("Error al ingresar datos en Firestore:", error);
  }
};



/**
 *
 * @param email
 * @param password
 * @returns
 */
export const fbSignIn = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password);
  console.log(response);
  return response;
};

/**
 *
 * @returns
 */
export const fbSignOut = async () => {
  await signOut(auth);
  return true;
};

/**
 *
 * @param callback
 */
export const fbAuthStateListener = (callback: any) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      callback(user);
    } else {
      // User is signed out
      callback(null);
    }
  });
};

export const fbSetUserProfile = async ({
  first,
  last,
  age,
}: {
  first: string;
  last: string;
  age: number;
}) => {
  const user = auth.currentUser;
  console.log(user);

  const ref = doc(db, "profiles", user?.uid as string);
  await setDoc(
    ref,
    {
      first,
      last,
      age,
      uid: user?.uid,
    },
    { merge: true }
  );
  return true;
};

/**
 *
 * @returns
 */
export const fbGetUserProfile = async () => {
  const user = auth.currentUser;
  console.log(user);

  const ref = doc(db, "personas", user?.uid as string);
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return {
      ...docSnap.data(),
      uid: user?.uid,
    };
  } else {
    console.log("No such document!", user?.uid);
    return null;
  }
};

/**
 *
 * @param {*} param0
 */
export const queryObjectCollection = async ({
  collectionName,
}: {
  collectionName: string;
}) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const results: any[] = [];

  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return results;
};

/**
 * 
 * @param collectionName 
 * @param callback 
 */
export const fbCollectionListener = (collectionName: string, callback: any) => {
  const unsubscribe = onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      console.log("Listening To Collection: " + collectionName, snapshot);
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(results);
    },
    (error) => {
      console.log("Error Listening To Collection: " + collectionName, error);
    }
  );
};

export const addDataToFirestore = async (fecha: string, titulo: string, encargado: string, fechaFinal: string) => {
  try {
    const tareasRef = doc(db, "tareas");
    const data = {
      fecha: fecha,
      titulo: titulo,
      encargado: encargado,
      fechaFinal: fechaFinal,
    };

    await setDoc(tareasRef, data);

    console.log("Datos ingresados correctamente en la colección 'personas' de Firestore");
  } catch (error) {
    console.error("Error al ingresar datos en Firestore:", error);
  }
};

export { app, db, auth };