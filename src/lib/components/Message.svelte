<script lang="ts">
	import type { TextStreamPart } from 'ai';
	import Markdown from '$lib/components/markdown/Markdown.svelte';
	function groupMessageChunks(chunks: Array<TextStreamPart<any>>): Array<TextStreamPart<any>> {
		if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
			return chunks;
		}

		const result: Array<TextStreamPart<any>> = [];
		let currentTextContent = '';
		let currentTextId = '';

		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];

			if (chunk.type === 'text-delta' && typeof chunk.textDelta === 'string') {
				currentTextContent += chunk.textDelta;
			} else {
				if (currentTextContent) {
					result.push({
						type: 'text-delta',
						textDelta: currentTextContent
					});
					currentTextContent = '';
					currentTextId = '';
				} else {
					result.push(chunk);
				}
			}
		}

		// Don't forget any remaining text content
		if (currentTextContent) {
			result.push({
				type: 'text-delta',
				textDelta: currentTextContent
			});
		}

		return result;
	}
	let { chunksProp } = $props<{
		chunksProp: TextStreamPart<any>[];
	}>();

	let chunks = $derived(groupMessageChunks(chunksProp));
</script>

<div>
	{#each chunks as chunk}
		{#if chunk.type === 'tool-call'}
			{#if !chunks.find((m) => m.type === 'tool-result' && m.toolCallId === chunk.toolCallId)}
				Calling {chunk.toolName}
			{/if}
		{/if}
		{#if chunk.type === 'tool-result'}
			Result for {chunk.toolName}
			{JSON.stringify(chunk.result)}
		{/if}
		{#if chunk.type === 'text-delta'}
			<Markdown md={chunk.textDelta} />
		{/if}
	{/each}
</div>
