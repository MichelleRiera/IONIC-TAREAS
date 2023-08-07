<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crear Tareas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <form class="login-form" autocomplete="off">
        <!-- Fecha Inicio -->
        <ion-item lines="full">
    <ion-label position="floating">Fecha Inicio</ion-label>
    <ion-input v-model="fecha" type="text" id="fecha" name="fecha" autocomplete="off" readonly></ion-input>
    <ion-button @click="showCalendarInicio = true">Seleccionar Fecha</ion-button>
    <ion-datetime
      v-if="showCalendarInicio"
      v-model="tempFechaInicio"
      :value="fecha" 
      presentation="date"
      :prefer-wheel="true"
      @ionCancel="onCalendarCancelInicio"
      @ionChange="onCalendarChangeInicio"
    ></ion-datetime>
    <!-- Botones Aceptar y Cancelar para la fecha de inicio -->
    <ion-button v-if="showCalendarInicio" @click="onAceptarFechaInicio">Aceptar</ion-button>
    <ion-button v-if="showCalendarInicio" @click="onCalendarCancelInicio">Cancelar</ion-button>
  </ion-item>



        <ion-item lines="full">
        <ion-label position="floating">Título</ion-label>
        <ion-input v-model="titulo" type="text" id="titulo" name="titulo" autocomplete="off"></ion-input>
      </ion-item>
      <ion-item lines="full">
        <ion-label>Encargado</ion-label>
        <ion-select v-model="encargado" interface="action-sheet">
          <ion-select-option v-for="persona in personas" :key="persona.id" :value="persona.id">
            {{ persona.nombre }} {{ persona.apellido }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item lines="full">
        <ion-label position="floating">Estado</ion-label>
        <ion-select v-model="estado" interface="action-sheet">
          <ion-select-option value="INICIADO">INICIADO</ion-select-option>
          <ion-select-option value="EN PROCESO">EN PROCESO</ion-select-option>
          <ion-select-option value="FINALIZADO">FINALIZADO</ion-select-option>
        </ion-select>
      </ion-item>

        <!-- Fecha Final -->
        <ion-item lines="full">
    <ion-label position="floating">Fecha Final</ion-label>
    <ion-input v-model="fechaFinal" type="text" id="fechaFinal" name="fechaFinal" autocomplete="off" readonly></ion-input>
    <ion-button @click="showCalendarFinal = true">Seleccionar Fecha</ion-button>
    <ion-datetime
      v-if="showCalendarFinal"
      v-model="tempFechaFinal"
      :value="fechaFinal"
      presentation="date"
      :prefer-wheel="true"
      @ionCancel="onCalendarCancelFinal"
      @ionChange="onCalendarChangeFinal"
    ></ion-datetime>
    <!-- Botones Aceptar y Cancelar para la fecha final -->
    <ion-button v-if="showCalendarFinal" @click="onAceptarFechaFinal">Aceptar</ion-button>
    <ion-button v-if="showCalendarFinal" @click="onCalendarCancelFinal">Cancelar</ion-button>
  </ion-item>

        <ion-button expand="block" @click="saveData">Guardar Datos</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonDatetime, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonPage, IonInput, IonSelect } from '@ionic/vue';
import { defineComponent, ref, onMounted } from 'vue';
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/store/firebase";
import { queryObjectCollection } from "@/store/firebase";

export default defineComponent({
name: 'CrearTareasPage',
components: { IonDatetime, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonPage, IonInput, IonSelect },
setup() {
  const fecha = ref<string>('');
  const titulo = ref<string>('');
  const encargado = ref<string>('');
  const estado = ref<string>('');
  const fechaFinal = ref<string>('');
  const showCalendarInicio = ref<boolean>(false);
  const showCalendarFinal = ref<boolean>(false);
  const tempFechaInicio = ref<string>(''); // Variable temporal para la fecha de inicio
  const tempFechaFinal = ref<string>('');

  // Lista de personas obtenida desde la base de datos de Firebase
  const personas = ref<{ id: string; nombre: string; apellido: string; }[]>([]);

  onMounted(async () => {
    // Cargar la lista de personas desde la base de datos de Firebase
    personas.value = await queryObjectCollection({ collectionName: "personas" });
  });

  const saveData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Obtener la referencia a la colección "Tareas"
        const tareasCollection = collection(db, "Tareas");

        // Crear un nuevo documento en la colección "Tareas" sin especificar un ID
        const data = {
          fecha: fecha.value,
          titulo: titulo.value,
          encargado: encargado.value,
          estado: estado.value,
          fechaFinal: fechaFinal.value,
        };

        // Insertar los datos en la base de datos y obtener el ID asignado al nuevo documento
        const newDocRef = await addDoc(tareasCollection, data);
          fecha.value = '';
          titulo.value = '';
          encargado.value = '';
          estado.value = '';
          fechaFinal.value = '';
          tempFechaInicio.value = '';
          tempFechaFinal.value = '';
        console.log("Nuevo documento creado con ID:", newDocRef.id);
      } catch (error) {
        console.error("Error al ingresar datos en Firestore:", error);
      }
    } else {
      console.log("Usuario no autenticado");
    }
  };

  const onCalendarCancelInicio = () => {
    showCalendarInicio.value = false;
  };

  const onCalendarChangeInicio = (event: CustomEvent<any>) => {
    fecha.value = event.detail.value;
    showCalendarInicio.value = false;
  };

  const onCalendarCancelFinal = () => {
    showCalendarFinal.value = false;
  };

  const onCalendarChangeFinal = (event: CustomEvent<any>) => {
    fechaFinal.value = event.detail.value;
    showCalendarFinal.value = false;
  };
  const onAceptarFechaInicio = () => {
    fecha.value = tempFechaInicio.value;
    showCalendarInicio.value = false;
  };

  // Función para aceptar la fecha final seleccionada
  const onAceptarFechaFinal = () => {
    fechaFinal.value = tempFechaFinal.value;
    showCalendarFinal.value = false;
  };

  return {
    fecha,
    titulo,
    encargado,
    estado,
    fechaFinal,
    saveData,
    personas,
    showCalendarInicio,
    showCalendarFinal,
    onCalendarCancelInicio,
    onCalendarChangeInicio,
    onCalendarCancelFinal,
    onCalendarChangeFinal,
    tempFechaInicio,
    tempFechaFinal,
    onAceptarFechaInicio,
    onAceptarFechaFinal,
  };
},



});
</script>

<style lang="css" scoped>
/* ... estilos ... */
</style>