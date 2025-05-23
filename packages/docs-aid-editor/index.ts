import type { App } from 'vue'

import DocsAicEditor from './index.vue'

//实现按需引入*
export { DocsAicEditor } 

// 批量的引入*
const components = [
  DocsAicEditor
];

const install = function(App:App) {
	components.forEach((component) => {
		App.component(component.name as string, component);
	});
};
export default { install } 
