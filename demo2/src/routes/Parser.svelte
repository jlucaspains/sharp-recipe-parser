<script>
	import IngredientParser from './IngredientParser.svelte';
	import InstructionParser from './InstructionParser.svelte';

	let showInstruction = false;
</script>

<div class="mx-auto my-8">
	<div class="flex justify-center">
		<span class="ml-3 mr-2 text-sm font-medium text-gray-300">Ingredient line parser</span>
		<label class="relative inline-flex cursor-pointer items-center">
			<input type="checkbox" bind:checked={showInstruction} class="peer sr-only" />
			<div
				class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
			></div>
		</label>
		<span class="ml-3 text-sm font-medium text-gray-300">Instruction line parser</span>
	</div>
</div>

{#if !showInstruction}
	<IngredientParser />
{/if}

{#if showInstruction}
	<InstructionParser />
{/if}
