<script lang="ts">
	export let func: Function;
	export let text: string;
	export let second_text: string;

	let clicked = false;

	function click() {
		if (clicked) {
			func();
		} else {
			clicked = true;
		}
	}
</script>

<button on:click={click}>
	{#if clicked}
		{second_text}
	{:else}
		{text}
	{/if}
</button>

<style>
	/* CSS */
	button {
		background-color: var(--selectable-button-background);
		box-shadow: var(--selectable-button-border) 4px 4px 0 0;
		border: 2px solid var(--selectable-button-border);
		color: var(--selectable-button-text);
		border-radius: 3rem;
		cursor: pointer;
		font-weight: var(--bold-wght);
		font-size: 18px;

		text-decoration: none;
		user-select: none;

		flex: 0 0 auto;
		min-width: 8rem;
		padding: 0 var(--med-space);
	}

	button:hover {
		box-shadow: var(--selectable-button-border) 3px 3px 0 0;
		transform: translate(1px, 1px);
	}

	button:active {
		box-shadow: var(--selectable-button-border) 1px 1px 0 0;
		transform: translate(3px, 3px);
	}
</style>
