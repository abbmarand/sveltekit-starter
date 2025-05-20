<script lang="ts">
	import { onMount } from 'svelte';

	import listen from '@/sse/sse.client.js';

	let { data } = $props();

	let messages: string[] = $state([]);

	type PongEvent = { message: string };

	onMount(() => {
		listen('pong', (raw: unknown) => {
			if (
				typeof raw === 'object' &&
				raw !== null &&
				'message' in raw &&
				typeof (raw as any).message === 'string'
			) {
				messages.push((raw as PongEvent).message);
			}
		});
	});

	async function sendMessage() {
		const response = await fetch('/api/ping');
	}
</script>

{JSON.stringify(data)}

<button
	onclick={() => {
		sendMessage();
	}}>Click me</button
>
<div class="flex flex-col gap-2">
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
