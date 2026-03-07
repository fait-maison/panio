<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import '../app.css';

	import type { Snippet } from 'svelte';

	let sidebarOpen = $state(false);
	let { children }: { children: Snippet } = $props();
</script>

<Navbar onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
<Toaster />
{@render children()}
<SidebarNav bind:open={sidebarOpen} />
