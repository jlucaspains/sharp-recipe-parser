<script>
	export let value = '';
	export let valueDescription = '';
</script>

<div
	class="my-4 flex flex-col rounded bg-gray-800 p-4 shadow-lg shadow-gray-900 duration-300 hover:-translate-y-1"
>
	<span class="mb-2 flex-grow text-3xl text-white">
		{value}
	</span>
	<div>
		<span class="text-normal">{valueDescription}</span>
	</div>
</div>
