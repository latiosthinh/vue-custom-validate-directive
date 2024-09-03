<script setup lang="ts">
import { useErrors } from "@/plugins/store";
import { ref, getCurrentInstance, getCurrentScope } from 'vue';

const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})

const self = getCurrentInstance()?.appContext.config.globalProperties
const { errors } = useErrors()
const userEmail = ref("")

const checkError = () => {
  self?.$validator.validateAll().then(({isValid}: any) => {
    if (isValid) {
      console.log('submitted')
      return;
    }

    console.log('error - cannot submit')
  }).catch((err: any) => {
    console.log(err)
  })
}
</script>

<template>
  <form @submit.prevent="checkError" class="greetings">
    <p>{{ msg }}</p>
    <input type="text" placeholder="userEmail" name="userEmail" v-model="userEmail" v-validate="'required|length:7'"
      :data-vv-validate-on="'blur|keyup'" />
    <button type="submit">Submit</button>

    <div style="color: red;">
      <div v-if="errors?.has('userEmail')">this is not valid</div>
      <div v-if="errors?.has('userEmail:required')">this is required</div>
      <div v-if="errors?.has('userEmail:length')">this should length = 7</div>
    </div>
  </form>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
