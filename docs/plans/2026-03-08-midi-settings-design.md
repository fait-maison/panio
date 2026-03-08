# MIDI Settings Redesign

Date: 2026-03-08

## Problem

`MidiStatus.svelte` is used in both `SidebarNav.svelte` and `settings/+page.svelte`, causing the MIDI status and device picker to appear twice. The navbar component also embeds interactive picker logic (dropdown, backdrop, chevron) that doesn't belong there.

## Design

### 1. `MidiStatus.svelte` — read-only badge

Strip all picker logic: remove `open` state, backdrop, listbox, chevron.

Render as `<a href="/settings">` with dot + label only. Colors unchanged:

- Green when `status === 'connected'` (shows device name)
- Red when `status === 'denied'`
- Muted for all other states

### 2. `settings/+page.svelte` — MIDI section

Replace the bare `<MidiStatus />` drop-in with a proper section matching existing patterns:

```
<h2>MIDI</h2>
<Select>
  <option value="">No device</option>
  {#each midi.inputList as device}
    <option value={device.id}>{device.name}</option>
  {/each}
</Select>
```

- Select value bound to `midi.preferredDeviceId`
- Selecting a device calls `midi.setPreferredDevice(id)`
- Selecting "No device" calls `midi.setPreferredDevice(null)`
- When `midi.inputList` is empty: Select disabled, trigger shows "No devices found" (muted)
- Section always visible (no conditional rendering)
- Remove old `MidiStatus` import, `midi-section` CSS block

### 3. shadcn Select — new component

Install: `pnpm dlx shadcn-svelte@latest add select`

No changes to `midi.svelte.ts` — existing `inputList`, `preferredDeviceId`, and `setPreferredDevice()` API is sufficient.

## Files changed

| File                                   | Change                                                    |
| -------------------------------------- | --------------------------------------------------------- |
| `src/lib/components/MidiStatus.svelte` | Remove picker, become read-only link badge                |
| `src/routes/settings/+page.svelte`     | Add MIDI section with Select, remove old MidiStatus usage |
| `src/lib/components/ui/select/`        | New shadcn component (installed)                          |
| `src/lib/i18n.svelte.ts`               | Possibly add `'midi.noDevice'` key                        |
