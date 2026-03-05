<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import '../app.css';

	let settingsOpen = $state(false);
	let { children } = $props();
</script>

<Navbar onGearClick={() => (settingsOpen = !settingsOpen)} />
<Toaster />
{@render children()}
<SettingsPanel bind:open={settingsOpen} />
