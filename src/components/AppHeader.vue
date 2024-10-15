<script setup lang="ts">
import { computed, type ComputedRef, ref } from 'vue'

import {useUserStore} from '@/stores/user'

import { getAuth,signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router=useRouter()


interface IMenuItem {
  label: string,
  icon: string,
  path: string,
  show: ComputedRef<boolean>,
}


const items =  ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show:computed(():boolean=>!userStore.userId)
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show:computed(():boolean=>!!userStore.userId)
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show:computed(():boolean=>!!userStore.userId)
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show:computed(():boolean=>!!userStore.userId)
  }
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth(router.push('/auth')))
}


</script>

<template>
  <app-menubar :model="items" class="menu">
    <template #start>
      {{userStore.userId}}
    </template>

    <template #item="{item,props}">
      <template v-if="item.show">
      <router-link :to="item.path" class="flex items-center " v-bind="props.action">
        <span :class="item.icon" class="p-menuitem-icon ml-4 "></span>
        <span class="ml-2">{{ item.label }}</span>
      </router-link>
      </template>
    </template>

    <template #end>
      <span v-if="userStore.userId"
            @click="signOutMethod"
            class="flex items-center menu-exit">
        <span class="pi pi-sign-out p-p-menuitem-icon"/>
           <span class="ml-2">Выход</span>
      </span>
    </template>
  </app-menubar>
</template>

<style scoped>

.menu {
  background-color: rgba(227, 218, 218, 0.44);
  border-radius: 0.5cap;
  padding: 10px;
  margin:  20px 0;
}

.menu-exit {
  cursor: pointer;
}
</style>
