<script>
	import { parseInstruction } from '@jlucaspains/sharp-recipe-parser';
	import ResultBox from './ResultBox.svelte';

	let instruction = '';
	let instructionParseResult = null;
	let timeTaken = '';
	let alternativeTemperature = "";

	function handleInstructionChange(event) {
		instruction = event.target.value;
		const startTime = performance.now();
		instructionParseResult = parseInstruction(instruction, 'en-US', {
			includeAlternativeTemperatureUnit: true
		});
		instructionParseResult?.alternativeTemperatures?.forEach((item) => {
			alternativeTemperature = `${item.quantity} ${item.unit}`;
		});

		var endTime = performance.now();
		timeTaken = (endTime - startTime).toFixed(2);
	}
</script>

<div>
	<div class="mb-12">
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			type="text"
			placeholder="Bake at 350F for 30 minutes"
			on:input={handleInstructionChange}
			bind:value={instruction}
		/>
		<span class="text-sm text-gray-500">Time taken: {timeTaken}ms</span>
	</div>
	{#if instructionParseResult }
	<div
		class="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		<ResultBox value={instructionParseResult?.temperature} valueDescription="Temperature" />
		<ResultBox
			value={instructionParseResult?.temperatureUnit}
			valueDescription="Temperature UOM"
		/>
		<ResultBox
			value={instructionParseResult?.totalTimeInSeconds}
			valueDescription="Time in Seconds"
		/>
		<ResultBox
			value={alternativeTemperature}
			valueDescription="Alternative Temperature"
		/>
	</div>
	{/if}
</div>
