<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { type ToggleVariants } from "$lib/components/ui/toggle/variants.js";
	import { setToggleGroupCtx } from "./context.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size = "default",
		spacing = 0,
		variant = "default",
		...restProps
	}: ToggleGroupPrimitive.RootProps & ToggleVariants & { spacing?: number } = $props();

	setToggleGroupCtx({
		variant,
		size,
		spacing,
	});
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<ToggleGroupPrimitive.Root
	bind:value={value as never}
	bind:ref
	data-slot="toggle-group"
	data-variant={variant}
	data-size={size}
	data-spacing={spacing}
	style={`--gap: ${String(spacing)}`}
	class={cn(
		"group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
		className
	)}
	{...restProps}
/>
