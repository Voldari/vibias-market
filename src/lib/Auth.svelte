<script>
	import { supabase } from '$lib/db';

	let loading = false;
	let email = '';

	const handleLogin = async () => {
		console.log(email);
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			let errorMessage = 'Failed to do something exceptional';
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			console.log(errorMessage);
		} finally {
			loading = false;
		}
	};
</script>

<form class="container" on:submit|preventDefault={handleLogin}>
	<p>Enter your email below to login/create an account and begin.</p>
	<input class="email" type="email" placeholder="Your email" bind:value={email} />
	<input
		class="submit"
		type="submit"
		value={loading ? 'Loading' : 'Send magic link'}
		disabled={loading}
	/>
</form>

<style>
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--med-space);
		padding: var(--med-space);
		background-color: var(--moss-green);
		border: var(--stone-tim-sage) 6px solid;
		border-radius: var(--med-space);
	}

	.email {
		padding: var(--small-space);
	}
</style>
