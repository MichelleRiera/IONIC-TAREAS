<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Crear Personas</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <div class="ion-padding">{{ store.error }}</div>
            <form class="login-form" autocomplete="off">
                <ion-item lines="full">
                    <ion-label position="floating">Nombre</ion-label>
                    <ion-input v-model="nombre" type="text" id="nombre" name="nombre" autocomplete="off"></ion-input>
                </ion-item>
                <ion-item lines="full">
                    <ion-label position="floating">Apellido</ion-label>
                    <ion-input v-model="apellido" type="text" id="apellido" name="apellido" autocomplete="off"></ion-input>
                </ion-item>
                <ion-item lines="full">
                    <ion-label>Ciclo</ion-label>
                    <ion-select v-model="ciclo" interface="action-sheet">
                        <ion-select-option value="Primero">Primero</ion-select-option>
                        <ion-select-option value="Segundo">Segundo</ion-select-option>
                        <ion-select-option value="Tercero">Tercero</ion-select-option>
                        <ion-select-option value="Cuarto">Cuarto</ion-select-option>
                        <ion-select-option value="Quinto">Quinto</ion-select-option>
                        <ion-select-option value="Sexto">Sexto</ion-select-option>
                        <ion-select-option value="Séptimo">Séptimo</ion-select-option>
                        <ion-select-option value="Octavo">Octavo</ion-select-option>
                        <ion-select-option value="Noveno">Noveno</ion-select-option>
                        <ion-select-option value="Décimo">Décimo</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item lines="full">
                    <ion-label position="floating">Carrera</ion-label>
                    <ion-input v-model="carrera" type="text" id="carrera" name="carrera" autocomplete="off"></ion-input>
                </ion-item>
                
                <ion-button expand="block" @click="doCreateAccount">Registrar</ion-button>
            </form>
            
            <!-- Mostrar el mensaje de éxito cuando mostrarMensajeExito es true -->
            <div v-if="mostrarMensajeExito" class="ion-padding">
                Registrado correctamente.
            </div>
        </ion-content>
    </ion-page>
</template>

<!-- Resto del código... -->


<script lang="ts">
import { useAuthStore } from "@/store"
import { IonLabel, IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonPage,IonSelect } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from "vue-router";
import { createPersonasInFirestore } from "@/store/firebase"; // Cambio de nombre de la función

export default defineComponent({
    name: 'LoginPage',
    components: { IonLabel, IonInput, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonPage,IonSelect },
    setup() {
        const store = useAuthStore()
        const router = useRouter()
        const nombre = ref('');
        const apellido = ref('');
        const ciclo = ref('');
        const carrera = ref('');
        const mostrarMensajeExito = ref(false);

        /**
         * 
         */
        const doCreateAccount = async () => {
            console.log("Valor de ciclo:", ciclo.value); 
            await createPersonasInFirestore(nombre.value, apellido.value, ciclo.value, carrera.value);
            mostrarMensajeExito.value = true;
            nombre.value = '';
            apellido.value = '';
            ciclo.value = '';
            carrera.value = '';
            setTimeout(() => {
                mostrarMensajeExito.value = false;
            }, 3000); // Ocultar el mensaje de éxito después de 3 segundos
            
        };
        return { nombre, apellido, doCreateAccount, store, ciclo, carrera, mostrarMensajeExito }
    }
});
</script>

<style lang="css" scoped>
/* Estilos adicionales si es necesario */
</style>
