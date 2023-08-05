<script>
	import { parseIngredient } from '@jlucaspains/sharp-recipe-parser';
	import ResultBox from './ResultBox.svelte';

	let ingredient = '';
	let ingredientParseResult = null;
	let alternativeQuantities = [];
	let timeTaken = '';

	function handleIngredientChange(event) {
		// @ts-ignore
		ingredient = event.target.value;
		const startTime = performance.now();
		ingredientParseResult = parseIngredient(ingredient, 'en-US', {
			includeAlternativeUnits: true,
			includeExtra: true
		});
		var endTime = performance.now();
		timeTaken = (endTime - startTime).toFixed(2);
		alternativeQuantities = ingredientParseResult?.alternativeQuantities || [];
	}
</script>

<div>
	<div class="mb-12">
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			type="text"
			placeholder="1 cup flour"
			on:input={handleIngredientChange}
			bind:value={ingredient}
		/>
		<span class="text-sm text-gray-500">Time taken: {timeTaken}ms</span>
	</div>
	{#if ingredientParseResult}
		<h2>Result</h2>
		<div
			class="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			{#if ingredientParseResult?.minQuantity === ingredientParseResult?.maxQuantity}
				<ResultBox value={ingredientParseResult?.quantity} valueDescription="Quantity" />
			{:else}
				<ResultBox value={`${ingredientParseResult?.minQuantity}-${ingredientParseResult?.maxQuantity}`} valueDescription="Quantity" />
			{/if}
			<ResultBox value={ingredientParseResult?.unit} valueDescription="UOM" />
			<ResultBox value={ingredientParseResult?.ingredient} valueDescription="Ingredient" />
			<ResultBox value={ingredientParseResult?.extra} valueDescription="Extra" />
		</div>
	{/if}
	{#if alternativeQuantities.length > 0}
		<h2>Alternative UOMs</h2>
		<div
			class="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			{#each alternativeQuantities as item}
				<ResultBox value={item?.quantity} valueDescription={item?.unitText} />
			{/each}
		</div>
	{/if}
</div>
