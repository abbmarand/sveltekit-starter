type Listener<T = unknown> = (data: T) => void;

let source: EventSource | null = null;

/** Lazily (re)creates the EventSource and keeps a single socket per tab. */
function getSource() {
	if (source && source.readyState !== EventSource.CLOSED) return source;

	source = new EventSource('/sse');
	source.onerror = () => {
		// automatic reconnect after 3 s
		setTimeout(() => {
			source?.close();
			source = null;
			getSource();
		}, 3_000);
	};
	return source;
}

/**
 * Subscribe to a channel. Returns an `unsubscribe` function.
 */
export default function listen<T = unknown>(
	channel: string,
	cb: Listener<T>
) {
	const es = getSource();

	const handler = (e: MessageEvent<string>) => cb(JSON.parse(e.data));
	es.addEventListener(channel, handler);

	return () => es.removeEventListener(channel, handler);
}
