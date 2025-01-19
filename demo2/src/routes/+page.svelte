<script>
	import Header from './Header.svelte';
	import Parser from './Parser.svelte';
	import { PUBLIC_PACKAGE_VERSION } from '$env/static/public';
</script>

<svelte:head>
	<title>sharp-recipe-parser demo</title>
	<meta name="description" content="sharp-recipe-parser demo" />
</svelte:head>

<div class="flex min-h-lvh flex-col bg-gray-900 px-12 py-10 text-white">
	<Header />
	<main class="mx-auto my-0 flex w-full max-w-5xl flex-1 flex-col p-4">
		<section>
			<h1 class="mb-12 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
				@jlucaspains/sharp-recipe-parser
			</h1>
			<Parser />
		</section>
	</main>
	<footer class="text-center text-sm text-gray-400">
		v{PUBLIC_PACKAGE_VERSION}
	</footer>
</div>
