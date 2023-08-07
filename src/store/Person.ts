/*
import { db } from "@/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";


export class Person {
    constructor(
      public id: string,
      public firstName: string,
      public lastName: string,
      public age: number
    ) {}
  }
  async createPerson(person: Person): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, "persons"), {
        firstName: person.firstName,
        lastName: person.lastName,
        age: person.age,
      });
      person.id = docRef.id;
    } catch (error) {
      console.error("Error creating person:", error);
      throw error;
    }
  }
  



export class PersonService {
  async createPerson(person: Person): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, "persons"), {
        firstName: person.firstName,
        lastName: person.lastName,
        age: person.age,
      });
      person.id = docRef.id;
    } catch (error) {
      console.error("Error creating person:", error);
      throw error;
    }
}

  async getPersons(): Promise<Person[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "persons"));
      const persons: Person[] = [];
      querySnapshot.forEach((doc) => {
        const person = doc.data() as Person;
        person.id = doc.id;
        persons.push(person);
      });
      return persons;
    } catch (error) {
      console.error("Error getting persons:", error);
      throw error;
    }
  }

  async getPersonById(id: string): Promise<Person | null> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "persons"), where("id", "==", id))
      );
      if (querySnapshot.size === 0) {
        return null;
      }
      const doc = querySnapshot.docs[0];
      const person = doc.data() as Person;
      person.id = doc.id;
      return person;
    } catch (error) {
      console.error("Error getting person by ID:", error);
      throw error;
    }
  }
}
*/