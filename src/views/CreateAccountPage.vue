<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <!-- Botón de refrescar página -->
        <ion-buttons slot="start">
          <ion-button @click="refreshPage">
            <ion-icon :icon="refreshIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
        <!-- Campo de búsqueda -->
        <ion-searchbar v-model="searchText" placeholder="Buscar"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding page-container">
      <!-- Mostrar la lista de personas y sus tareas filtradas por búsqueda -->
      <div v-for="persona in filteredPersonasConTareas" :key="persona.id" class="persona-container">
        <h3 class="persona-name">{{ persona.nombre }} {{ persona.apellido }}</h3>
        <div class="tareas-container">
          <div v-if="persona.tareasIniciado.length > 0">
            <ul class="tareas-list">
              <li v-for="tarea in persona.tareasIniciado" :key="tarea.id" class="tarea-item">
                <div class="tarea-content">
                  {{ tarea.titulo }} - {{ new Date(tarea.fechaFinal).toLocaleDateString() }}
                </div>
                <!-- Botón para eliminar tarea -->
                <ion-button @click="deleteTarea(persona, tarea)" fill="clear" class="delete-button">
                  <ion-icon :icon="trashIcon"></ion-icon>
                </ion-button>
              </li>
            </ul>
          </div>
          <div v-if="persona.tareasEnProceso.length > 0">
            <ul class="tareas-list">
              <li v-for="tarea in persona.tareasEnProceso" :key="tarea.id" class="tarea-item">
                <div class="tarea-content">
                  {{ tarea.titulo }} - {{ new Date(tarea.fechaFinal).toLocaleDateString() }}
                </div>
                <!-- Botón para eliminar tarea -->
                <ion-button @click="deleteTarea(persona, tarea)" fill="clear" class="delete-button">
                  <ion-icon :icon="trashIcon" />
                </ion-button>
              </li>
            </ul>
          </div>
          <div v-if="persona.tareasFinalizado.length > 0">
            <ul class="tareas-list">
              <li v-for="tarea in persona.tareasFinalizado" :key="tarea.id" class="tarea-item">
                <div class="tarea-content">
                  {{ tarea.titulo }} - {{ new Date(tarea.fechaFinal).toLocaleDateString() }}
                </div>
                <!-- Botón para eliminar tarea -->
                <ion-button @click="deleteTarea(persona, tarea)" fill="clear" class="delete-button">
                  <ion-icon :icon="trashIcon" />
                </ion-button>
              </li>
            </ul>
          </div>
          <div v-if="persona.tareasIniciado.length === 0 && persona.tareasEnProceso.length === 0 && persona.tareasFinalizado.length === 0">
            <p class="no-tareas">Sin tareas</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonIcon, IonSearchbar, IonButton, IonButtons, IonToolbar, IonHeader, IonContent } from '@ionic/vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { queryObjectCollection, db } from "@/store/firebase";
import { refreshCircleOutline, trash} from 'ionicons/icons';
import { collection, where, query, getDocs, deleteDoc, doc } from "firebase/firestore";

const queryTareasByEncargado = async (encargadoId: string) => {
  const q = query(collection(db, "Tareas"), where("encargado", "==", encargadoId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export default defineComponent({
  name: 'CreateAccountPage',
  components: { IonPage, IonIcon, IonSearchbar, IonButton, IonButtons, IonToolbar, IonHeader, IonContent },
  setup() {
    const trashIcon = trash;
        const personasConTareas = ref<Array<any>>([]);
    const searchText = ref<string>('');

    // Obtener las personas y sus tareas desde Firestore
    const obtenerPersonasConTareas = async () => {
      const personas = await queryObjectCollection({ collectionName: "personas" });

      const personasConTareasData = [];

      for (const persona of personas) {
        const tareas = await queryTareasByEncargado(persona.id);

        const tareasIniciado = tareas.filter(tarea => tarea.estado === 'INICIADO');
        const tareasEnProceso = tareas.filter(tarea => tarea.estado === 'EN PROCESO');
        const tareasFinalizado = tareas.filter(tarea => tarea.estado === 'FINALIZADO');

        personasConTareasData.push({ ...persona, tareasIniciado, tareasEnProceso, tareasFinalizado });
      }

      personasConTareas.value = personasConTareasData;
    };

    // Llamar a la función para obtener los datos al cargar el componente
    onMounted(obtenerPersonasConTareas);

    // Icono de refrescar página
    const refreshIcon = ref<string>(refreshCircleOutline);

    // Función para refrescar la página
    const refreshPage = () => {
      refreshIcon.value = 'spinner'; // Mostrar icono de carga mientras se refresca la página
      obtenerPersonasConTareas()
        .then(() => {
          refreshIcon.value = refreshCircleOutline; // Restaurar el icono después de que se complete el refresco
        });
    };

    // Filtrar personas y tareas por búsqueda
    const filteredPersonasConTareas = computed(() => {
      return personasConTareas.value.filter(persona => {
        return (
          persona.nombre.toLowerCase().includes(searchText.value.toLowerCase()) ||
          persona.apellido.toLowerCase().includes(searchText.value.toLowerCase()) ||
          persona.tareasIniciado.some((tarea: { titulo: string }) => tarea.titulo.toLowerCase().includes(searchText.value.toLowerCase())) ||
          persona.tareasEnProceso.some((tarea: { titulo: string }) => tarea.titulo.toLowerCase().includes(searchText.value.toLowerCase())) ||
          persona.tareasFinalizado.some((tarea: { titulo: string }) => tarea.titulo.toLowerCase().includes(searchText.value.toLowerCase()))
        );
      });
    });

    // Función para eliminar tarea de la base de datos
    const deleteTarea = async (persona: any, tarea: any) => {
      try {
        // Eliminar la tarea de la base de datos
        const tareaRef = doc(db, "Tareas", tarea.id);
        await deleteDoc(tareaRef);

        // Refrescar la lista de personas y tareas
        await obtenerPersonasConTareas();
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    };

          
    return {
      filteredPersonasConTareas,
      searchText,
      refreshIcon,
      refreshPage,
      deleteTarea,
      trashIcon,
    };
  },
});
</script>

<style lang="css" scoped>
/* Estilos previos */
.persona-container {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff; /* Color de fondo blanco para el contenedor de cada persona */
}

.tareas-container {
  border: 1px solid #ccc; /* Borde claro para el contenedor de tareas */
  margin-top: 10px;
  padding: 10px;
}

.tareas-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tarea-item {
  padding: 5px 0;
  border-bottom: 1px solid #ccc; /* Borde claro para separar las tareas */
}

.no-tareas {
  margin: 0;
  padding: 5px 0;
  color: #666; /* Color gris para el texto 'Sin tareas' */
}

/* Estilos para el botón de eliminar */
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
