<template>
  <ion-page> 
    <ion-header>
      <ion-toolbar>
        <ion-title>Crear Tareas</ion-title>
      </ion-toolbar>
      <ion-content :fullscreen="true" class="ion-padding">
    <ion-datetime presentation="date" :highlighted-dates="highlightedDates"></ion-datetime>
  </ion-content>
  </ion-header>
</ion-page>
</template>

<script lang="ts">
import { IonDatetime } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonDatetime },
  setup() {
    const highlightedDates = (isoString: string) => {
      const date = new Date(isoString);
      const utcDay = date.getUTCDate();

      // Colores para las fechas de inicio y fin de tareas
      const inicioColor = '#00ff00'; // Verde
      const finalColor = '#ff0000'; // Rojo

      // Aquí debes obtener las fechas de inicio y fin de las tareas desde tu base de datos de Firebase
      const fechaInicioTarea = '2023-08-07T19:14:00'; // Fecha de inicio de la tarea
      const fechaFinalTarea = '2023-08-10T19:14:00'; // Fecha final de la tarea

      const inicioDate = new Date(fechaInicioTarea);
      const finalDate = new Date(fechaFinalTarea);

      if (date.toISOString() === inicioDate.toISOString()) {
        return {
          textColor: '#ffffff',
          backgroundColor: inicioColor,
        };
      }

      if (date.toISOString() === finalDate.toISOString()) {
        return {
          textColor: '#ffffff',
          backgroundColor: finalColor,
        };
      }

      return undefined;
    };

    return { highlightedDates };
  },
});
</script>
