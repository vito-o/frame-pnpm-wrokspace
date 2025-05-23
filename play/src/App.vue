<template>
  <div class="app">
    <DocsAicEditor 
			ref="editorRef"
			:llm_url="llm_url"
			:llm_key="llm_key"
			:llm_model="llm_model"
		/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {DocsAicEditor} from '@packages/docs-aid-editor/index.ts'
const llm_url = import.meta.env.VITE_LLM_URL as string;
const llm_key = import.meta.env.VITE_LLM_KEY as string;
const llm_model = import.meta.env.VITE_LLM_MODEL as string;

const editorRef = ref<any>(null)

setTimeout(() => {
	if (editorRef.value) {
		// console.log(editorRef.value.getEditorContent())
	}
}, 3000)
</script>
<style>


</style>