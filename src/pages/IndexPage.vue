<template>
<q-page-container>
  <q-page padding>

    <q-flex>
    <div>
        <h3 class="text-weight-regular text-h3 text-center text-primary"> ToDoList APP</h3>
    </div>
    <div class="q-gutter-sm">
      <q-form @submit.prevent="potsTodo">
     <q-card class="my-card bg-secondary text-white q-pa-md example-row-equal-width itens-center no-shadow">
      <div class="row itens-center q-p-sm">
        <div class="col-sm-11 col-xs-12">
<q-card-section>
       <q-input
        color="primary"
        v-model="todoItem.item"
        placeholder="Digite uma tarefa..."
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Porfavor escreva alguma tarefa']"
      />
      </q-card-section>
        </div>

        <div class="col-sm-1 col-xs-12">
<q-card-actions>
        <q-btn round color="accent" icon="add" shadow type="submit"/>
      </q-card-actions>
        </div>
        <div class="row align-center justify-center">
          <div class="col-sm-3 col-xs-5 q-gutter-sm" style="width: 200px;">
            <q-btn push color="accent" text-color="dark" label="Tarefas adicionadas" icon-right="add" size="sm">
              <q-badge color="white" text-color="dark" floating>{{ todoAll }}</q-badge>
            </q-btn>
          </div>
           <div class="col-sm-3 col-xs-5 q-gutter-sm" style="width: 200px;">
            <q-btn push color="accent" text-color="dark" label="Tarefas concluidas" icon-right="check"  size="sm">
      <q-badge color="white" text-color="dark" floating>{{ todoDone }}</q-badge>
    </q-btn>
  </div>
<div class="col-sm-3 col-xs-5 q-gutter-sm" style="width: 200px;">
            <q-btn push color="accent" text-color="dark" label="Tarefas Não concluidas" icon-right="warning"  size="sm">
      <q-badge color="white" text-color="dark" floating>{{ todoNoDone }}</q-badge>
    </q-btn>
  </div>

        </div>
      </div>
    </q-card>
     </q-form>
 <q-intersection
        v-for="(itemTodo,index) in todoList"
        :key="index"
        transition="scale"
        class="example-item"
      >
     <q-card class="my-card bg-secondary text-white q-pa-md example-row-equal-width itens-center no-shadow">
      <div class="row items-center q-p-sm">

        <div class="col-sm-1 col-xs-1">

<q-card-actions>
<q-icon name="check" :color="itemTodo.done === false ? 'primary' : 'green' " size="sm" @click="handleToggle(itemTodo.id)" />
<q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
          <strong>Estado da tarefa {{ itemTodo.done === false ? 'Não concluida' : 'Concluida'  }} </strong>
        </q-tooltip>
      </q-card-actions>
        </div>
        <div class="col-sm-9 col-xs-9">
<q-card-section>

  <span>{{ itemTodo.item }}</span>
      </q-card-section>
        </div>

        <div class="col-sm-2 col-xs-2">
<q-card-actions>
<div class="col q-gutter-sm">
          <q-btn round color="secondary" icon="delete" shadow @click="removeTodo(itemTodo.id)"/>
<q-btn round color="accent" icon="edit" shadow @click="updateTodo(itemTodo.id)"/>
</div>

      </q-card-actions>
        </div>
      </div>
    </q-card>
</q-intersection>

</div>
    </q-flex>
  </q-page>
</q-page-container>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import todoService from '../services/todoService.js'

onMounted(async () => {
  q.loadingBar.start()
  await getTodo()
  q.loadingBar.stop()
})
const todoList = reactive([])
const q = useQuasar()
const { list, post, remove, update } = todoService()
const todoItem = reactive({
  item: '',
  done: false
})
const handleToggle = (id) => {
  const itemToggle = todoList.find((element) => {
    return element.id === id
  })
  itemToggle.done = !itemToggle.done
}
const todoDone = computed(() => {
  const todoCheckList = todoList.filter((element) => {
    return element.done === true
  })
  return todoCheckList.length
})
const todoAll = computed(() => {
  return todoList.length
})
const todoNoDone = computed(() => {
  const todoCheckList = todoList.filter((element) => {
    return element.done === false
  })
  return todoCheckList.length
})
const getTodo = async () => {
  try {
    const todo = await list('/todo')
    todo.forEach(element => {
      todoList.push(element)
    })
  } catch (error) {
    q.notify({ message: 'Problemas de requisição', icon: 'error', color: 'negative', position: 'top-right' })
  }
}
const potsTodo = async () => {
  try {
    if (todoItem.id) {
      q.loadingBar.start()
      await update('/todo', todoItem)
      todoItem.item = ''
      todoList.splice(0, todoList.length)
      await getTodo()
      q.loadingBar.stop()
      q.notify({ message: 'Tarefa actualizada com sucesso', icon: 'check', color: 'positive', position: 'top-right' })
    } else {
      q.loadingBar.start()
      await post('/todo', todoItem)
      todoItem.item = ''
      todoList.splice(0, todoList.length)
      await getTodo()
      q.loadingBar.stop()
      q.notify({ message: 'Tarefa adicionada com sucesso', icon: 'check', color: 'positive', position: 'top-right' })
    }
  } catch (error) {
    q.notify({ message: 'Problemas ao Listar as tarefas', icon: 'error', color: 'negative', position: 'top-right' })
  }
}
const updateTodo = async (id) => {
  todoList.forEach(element => {
    if (element.id === id) {
      todoItem.item = element.item
      todoItem.id = element.id
    }
  })
}
const removeTodo = async (id) => {
  q.dialog({
    title: 'Confirmar',
    message: 'Desejas realmente apagar está tarefa?',
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      q.loadingBar.start()
      await remove('/todo', id)
      todoList.splice(0, todoList.length)
      await getTodo()
      q.loadingBar.stop()
      q.notify({ message: 'Tarefa Apagada com sucesso', icon: 'check', color: 'positive', position: 'top-right' })
    } catch (error) {
      q.notify({ message: 'Problemas ao deletar a tarefa', icon: 'error', color: 'negative', position: 'top-right' })
    }
  }).onCancel(() => {
    q.loadingBar.stop()
  })
}
q.loadingBar.setDefaults({
  color: 'accent',
  size: '4px'
})
</script>
