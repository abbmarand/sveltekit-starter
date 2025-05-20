import { register } from '@/sse/sse.server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ locals, request }) => {
	const userId = locals.user?.id ?? null;
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}
	const stream = new ReadableStream({
		start(controller) {
			const ping = setInterval(() => {
				if (request.signal.aborted) {
					return;
				}
				try {
					controller.enqueue(':ping\n\n');
				} catch (e) {
					console.error(
						'SSE: Ping failed, controller likely closed. Clearing interval to prevent further errors.',
						e
					);
					clearInterval(ping);
				}
			}, 15_000);

			const unregister = register(userId, controller);

			request.signal.addEventListener('abort', () => {
				clearInterval(ping);
				unregister();
				controller.close();
			});
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
