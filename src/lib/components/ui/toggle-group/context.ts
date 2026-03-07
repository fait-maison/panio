import { getContext, setContext } from "svelte";
import type { ToggleVariants } from "$lib/components/ui/toggle/variants.js";

export interface ToggleGroupContext extends ToggleVariants {
	spacing?: number;
}

export function setToggleGroupCtx(props: ToggleGroupContext) {
	setContext("toggleGroup", props);
}

export function getToggleGroupCtx() {
	return getContext<Required<ToggleGroupContext>>("toggleGroup");
}
