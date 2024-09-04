<script setup lang="ts">
import { useErrors } from "@/plugins/store";
import { ref, getCurrentInstance } from 'vue';

const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})

const self = getCurrentInstance()?.appContext.config.globalProperties
const { errors } = useErrors()
const userEmail = ref("")
const userPass = ref("")

const checkError = () => {
  self?.$validator.validateAll().then(({ isValid }: any) => {
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
    <div>
      <input type="text" placeholder="userEmail" name="userEmail" v-model="userEmail" v-validate="'required|email'"
        :data-vv-validate-on="'blur|keyup'" />

      <div v-if="errors?.has('userEmail')">this is not valid</div>
      <div v-if="errors?.has('userEmail:required')">this is required</div>
      <div v-if="errors?.has('userEmail:email')">this should be an email</div>
    </div>

    <div>
      <input type="password" placeholder="userPass" name="userPass" v-model="userPass" v-validate="{
        required: true,
        length: 7
      }" :data-vv-validate-on="'blur|keyup'" />

      <div v-if="errors?.has('userPass')">this is not valid</div>
      <div v-if="errors?.has('userPass:required')">this is required</div>
      <div v-if="errors?.has('userPass:length')">this should length = 7</div>
    </div>
    <button type="submit">Submit</button>
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
