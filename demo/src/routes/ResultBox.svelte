<script>
	export let value = '';
	export let valueDescription = '';
</script>

<div
	class="my-4 rounded shadow-lg shadow-gray-900 bg-gray-800 duration-300 hover:-translate-y-1 p-4 flex flex-col"
>
	<span class="mb-2 text-3xl text-white flex-grow">
		{value}
	</span>
	<div>
		<span class="text-normal">{valueDescription}</span>
	</div>
</div>
