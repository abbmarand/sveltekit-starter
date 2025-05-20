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
