<script lang="ts">
	import type { TextStreamPart } from 'ai';
	import { onMount } from 'svelte';
	import listen from '@/sse/sse.client.js';
	import Message from '$lib/components/Message.svelte';
	import { Button } from '$lib/components/ui/button';

	let chunks: TextStreamPart<any>[] = $state([]);

	onMount(() => {
		listen('chat', (raw: { message: TextStreamPart<any> }) => {
			chunks.push(raw.message);
		});
	});
	async function sendMessage() {
		await fetch('/api/chat');
	}
</script>

<Button
	onclick={() => {
		sendMessage();
	}}>Click me</Button
>
<div class="flex flex-col gap-2">
	<Message chunksProp={chunks} />
</div>
