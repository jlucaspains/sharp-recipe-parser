import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
export default [
	prettier,
	{
		// Note: there should be no other properties in this object
		ignores: ['build/*', '.svelte-kit/*']
	},
	...svelte.configs['flat/prettier']
];
