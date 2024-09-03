<script setup lang="ts">
import { useErrors } from "@/plugins/store";
import { ref } from 'vue';

const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})

const phone = ref("")
const { errors } = useErrors()

const checkError = () => {
  console.log(errors.value)
  if (!errors.value.size) {
    console.log('submitted')
  }
}
</script>

<template>
  <form @submit.prevent="checkError" class="greetings" style="margin-top: 100px;">
    <p>{{ msg }}</p>
    <input type="text" placeholder="phone number" name="phone" v-model="phone" v-validate="{
      required: true,
      regex: /\d+/
    }" />
    <button type="submit">Submit</button>

    <div style="color: red;">
      <div v-if="errors?.has('phone')">this is not a valid phone</div>
      <div v-if="errors?.has('phone:required')">this is required</div>
      <div v-if="errors?.has('phone:regex')">this should be an phone number</div>
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
