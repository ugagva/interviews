<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'


const userStore = useUserStore()
const db = getFirestore()
const company = ref('')
const vacancyLink = ref('')
const contactTelegram = ref('')
const hrName = ref('')
const contactWatsApp = ref('')
const contactPhone = ref('')
const loading = ref<boolean>(false)
const disabledSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})
const addNewInterview = async (): Promise<void> => {
  loading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWatsApp: contactWatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date()
  }

  if (userStore.userId) {
    await setDoc( doc(db, `users/${userStore.userId}/interviews`, payload.id), payload)}
  loading.value=false
  console.log(payload)
}
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Компания" v-model="company" />
        <app-input-text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Описание вакансии (ссылка) "
        />
        <app-input-text class="input mb-3" placeholder="Контакт (имя)" v-model="hrName" />
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegaram username HR"
        />
        <app-input-text
          v-model="contactWatsApp"
          class="input mb-3"
          placeholder="WatsApp номер HR "
        />
        <app-input-text class="input mb-3" placeholder="Телефон HR" v-model="contactPhone" />
        <app-button
          @click="addNewInterview"
          label="Создать собеседование"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}

.content-interview {
  max-width: 600px;
  margin: auto;
}
</style>
