<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { LoaderCircle } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';

	function google() {
		signIn('google', { callbackUrl: `/` });
	}
	let isGoogleLoading = $state(false);
</script>

<div
	class="container mx-auto flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center py-10"
>
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		<div class="flex w-full flex-col text-center">
			<div>
				<h1 class="mt-4 text-center text-2xl">Sign in to your account</h1>
				<p class="text-muted-foreground mt-2 text-sm">Sign in to your account</p>
			</div>

			<div>
				<div class="flex flex-col gap-4 py-8">
					<div class="w-full">
						<Button
							size="lg"
							type="button"
							variant="default"
							disabled={isGoogleLoading}
							onclick={() => google()}
							class="w-full"
						>
							{#if isGoogleLoading}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								<p>Sign in with Google</p>
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>

		<p class="text-muted-foreground px-8 text-center text-sm">
			By clicking continue, you agree to our
			<a href="/terms" class="hover:text-primary underline underline-offset-4"
				>Terms and Conditions</a
			>
			and
			<a href="/privacy" class="hover:text-primary underline underline-offset-4">Privacy Policy</a>.
		</p>
	</div>
</div>
