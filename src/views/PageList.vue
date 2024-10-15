<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  deleteDoc,
  where,
  doc,
  getDocs
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const isLoading = ref(true)
const selectedFilterResult = ref<string>('')

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews(true)
  interviews.value = listInterviews
  console.log(interviews)
  isLoading.value = false
}

const clearFilter = async (): Promise => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
}
const getAllInterviews = async <T extends IIntreview>(isFilter?: boolean): Promise<T[]> => {
  let getData
  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )
  }
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удалить собеседование',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'pi pi-button-secondary p-button-outlined',
    acceptClass: 'pi pi-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews/`, id))
      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = listInterviews
      isLoading.value = false
    }
  })
}
onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = listInterviews
  isLoading.value = false
})
</script>

<template>
  <app-dialog />
  <app-progress v-if="isLoading" />
  <app-message v-else-if="!isLoading && !interviews.length" severity="info">
    Нет добавленных собеседований!
  </app-message>
  <div v-else>
    <h1>Список собеседований</h1>
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <app-radio
          inputId="interviewResult1"
          name="result"
          value="Refusal"
          v-model="selectedFilterResult"
        />
        <label class="ml-2" for="interviewResult1">Отказ</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        />
        <label class="ml-2" for="interviewResult1">Offer</label>
      </div>
      <app-button class="mr-2" @click="submitFilter" :disabled="!selectedFilterResult">
        Применить
      </app-button>
      <app-button
        class="mr-2"
        severity="danger"
        @click="clearFilter"
        :disabled="!selectedFilterResult"
      >
        Сбросить
      </app-button>
    </div>
    <app-datatable :value="interviews">
      <app-column field="company" header="Компания"></app-column>
      <app-column field="hrName" header="Контактное лицо"></app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
        /
      </app-column>

      <app-column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contact_telegram"
            >
              <span class="contacts_icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactWatsApp"
              :href="`https://wa.me/${slotProps.data.contactWatsApp}`"
              target="_blank"
              class="contact_watsApp"
            >
              <span class="contacts_icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:/${slotProps.data.contactPhone}`"
              target="_blank"
              class="contact_phone"
            >
              <span class="contacts_icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column header="Пройденные этапы">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages"> Не заполнено</span>
          <div class="interview-stages">
            <app-badge
              v-for="(stage, index) in slotProps.data.stages"
              :key="index"
              :value="index + 1"
              rounded
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </app-column>
      <app-column header="Зарплатная вилка">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom"> Не заполнено</span>
          <span v-else>{{ slotProps.data.salaryFrom }}-{{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column header="Результат ">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result"> Не заполнено</span>
          <template v-else>
            <app-badge
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? 'Offer' : 'Отказ'"
            />
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}

.contact_telegram {
  color: #0088cc;
}

.contact_watsApp {
  color: #25d366;
}
</style>
