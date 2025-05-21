# Sveltekit Starter with SSE

I made this repo to demonstrate Server Sent Events in sveltekit, and why I might migrate existing projects to this instead.

For a tech overview you can read .cursorrules


## Run it

You need a .env file with:

```
DATABASE_URL="postgres://user:password@host:port/db-name"
AUTH_SECRET="xxxxxxxxxxxxxx" # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_GOOGLE_CLIENT_ID='xxxx-xxxxx.apps.googleusercontent.com'
AUTH_GOOGLE_CLIENT_SECRET='GOCSPX-xxxxx'
AUTH_TRUST_HOST=true
OPENAI_API_KEY=sk-proj-xxxxx
```



#### Custom SSE helpers

Client side (`src/lib/sse/sse.client.ts`):

```svelte
<script lang="ts">
	import type { TextStreamPart } from 'ai';
	import { onMount } from 'svelte';
	import listen from '@/sse/sse.client.js';
	import Message from '@/client/Message.svelte';
	import { Button } from '@/components/ui/button';

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

<Button onclick={sendMessage}>Click me</Button>
<div class="flex flex-col gap-2">
	<Message chunksProp={chunks} />
</div>
```

Server broadcast (`src/lib/sse/sse.server.ts`):

```ts
import type { RequestHandler } from '@sveltejs/kit';
import { createWeatherAgent } from '@/server/ai/agents/weather';
import send from '@/sse/sse.server';
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	const agent = createWeatherAgent();
	const stream = await agent.stream('What is the weather in San Fransisco?');
	for await (const chunk of stream.fullStream) {
		send([user?.id], 'chat', { message: chunk });
	}
	return new Response('ok');
};
```
