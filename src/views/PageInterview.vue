<script setup lang="ts">


import { doc, getDoc, getFirestore,updateDoc,Timestamp } from 'firebase/firestore'
import {useUserStore} from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'



const isLoading = ref<boolean>(true)
const db= getFirestore()
const userStore = useUserStore()
const route=useRoute()
const interview=ref<IInterview>()
const docRef = doc(db,`users/${userStore.userId}/interviews`,route.params.id as string)

const getData=async (): Promise<void> => {
  isLoading.value= true
  const docSnap= await getDoc(docRef)
  if(docSnap.exists()){
const data = docSnap.data() as IInterview[]
    if (data.stages&& data.stages.length){
      data.stages= data.stages.map((stage:IStage)=>{
      if(stage.date && stage.date instanceof Timestamp){
        return {
          ...stage,
          data:stage.date.toDate()
        }
      }return stage
      })
    }interview.value = data
    }
  isLoading.value=false
}
onMounted(async ()=>await getData())

const addStage=()=> {
  if (interview.value) {
    if(!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({name:'',date:null,description:''})
}
}
const removeStage = (index:number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index,1)}
  }

}
const saveInterview = async (): Promise<void> => {
  isLoading.value=true
  if(interview.value?.stages && interview.value?.stages.length) {
    interview.value.stages=interview.value.stages.map((stages:IStage)=>{
      return {
        ...stages, date:dayjs(stages.date).format('MM-DD-YYYY')
      }
    })
  }
  await updateDoc(docRef,{...interview.value})
  await getData()
 }

</script>

<template>
  <app-progress v-if="isLoading" />

  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    {{interview}}
    <app-card>
      <template #title> Собеседование в компанию {{ interview.company }} </template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компания</label>
          <app-input-text
            class="input md-3"
            id="company"
            v-model="interview.company"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии (ссылка)</label>
          <app-input-text
            class="input md-3"
            id="vacancyLink"
            v-model="interview.vacancyLink"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт (имя)</label>
          <app-input-text
            class="input md-3"
            id="hrName"
            v-model="interview.hrName"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram username HR</label>
          <app-input-text
            class="input md-3"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWatsApp">WatsApp </label>
          <app-input-text
            class="input md-3"
            id="contactWatsApp"
            v-model="interview.contactWatsApp"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Telephone HR</label>
          <app-input-text
            class="input md-3"
            id="contactPhone"
            v-model="interview.contactPhone"
          ></app-input-text>
        </div>
        <div class="flex flex-wrap gap-4 mt-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
              v-model="interview.salaryFrom"
            />
          </div>
          <div class="flex-auto">
            <app-input-number
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
              v-model="interview.salaryTo"
            />
          </div>
        </div>

        <app-button
          label="Добавить этап"
          severity="info"
          icon="p pi-plus"
          class="mb-3"
          @click="addStage"
        />
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата прохождения этапа интервью </label>
              <app-date-picker
                class="input mb-3"
                :id="`stage-date-${index}`"
                dataFormat="mm.dd.yy"
                v-model="stage.date"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Комментарий </label>
              <app-textarea
                class="input mb-3"
                :id="`stage-description-${index}`"
                rows="5"
                v-model="stage.description" />
            </div>
            <app-button severity="danger" label="Удалить этап" @click="removeStage" />
          </div>
        </template>
        <div   class="flex flex-wrap gap-3 mb-3">
          <div  class="flex align-items-center">
            <app-radio
              inputId="interviewResult1" name="result" value="Refusal" v-model="interview.result" />
            <label  class="ml-2" for="interviewResult1" >Отказ</label>
          </div>
          <div class="flex align-items-center">
            <app-radio
              inputId="interviewResult2" name="offer" value="Offer" v-model="interview.result" />
            <label  class="ml-2" for="interviewResult2">Оффер</label>
          </div>
        </div>
        <app-button label="Сохранить" icon="pi pi-save" class="mb-3" @click="saveInterview" />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}

.input {
  width: 100%;
}

.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
