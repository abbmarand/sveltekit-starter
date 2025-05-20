import { register } from '@/sse/sse.server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ locals, request }) => {
	const userId = locals.user?.id ?? null;
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}
	const stream = new ReadableStream({
		start(controller) {
			const unregister = register(userId, controller);

			const ping = setInterval(() => {
				if (request.signal.aborted) {
					return;
				}
				try {
					controller.enqueue(':ping\n\n');
				} catch (e) {
					clearInterval(ping);
					unregister();
				}
			}, 15_000);

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
