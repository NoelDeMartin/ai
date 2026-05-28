# Storybook

Storybook isolates UI components for development and testing. You can browse the stories using Playwriter as well. If the server isn't already running in `http://localhost:6006`, you can start it using `vp run storybook`.

## 1. Story Basics

Stories are plain objects using `args` to pass props to your `.vue` components. Inherit args to build variants without duplicating code.

```typescript
// MyButton.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import MyButton from './MyButton.vue';

const meta = {
    component: MyButton,
    argTypes: {
        variant: { control: 'select', options: ['primary', 'ghost'] },
    },
} satisfies Meta<typeof MyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: { variant: 'primary', label: 'Click me' },
};

// Inherit args from Primary
export const Disabled: Story = {
    args: { ...Primary.args, disabled: true },
};
```

Here is a concise, agent-optimized subsection you can drop directly into your cheat sheet.

---

## 2. Inline Templates & Slots (`render` Function)

When a component requires slots (e.g., `<Badge>Text</Badge>`), custom layout wrappers, or `v-model` testing, you must use a `render` function. It returns a miniature Vue component configuration.

To make slot content editable via Storybook Controls, pass a custom text property in your `args` (like `label`) and render it using mustache syntax.

```typescript
export const Default: Story = {
    args: {
        variant: 'default',
        label: 'Badge Text', // Custom arg mapped to the slot
    },
    render: (args) => ({
        components: { Badge }, // 1. Register components used in the string template
        setup: () => ({ args }), // 2. Expose reactive args so Controls update the UI
        template: '<Badge v-bind="args">{{ args.label }}</Badge>', // 3. Bind props and inject slot
    }),
};
```

**Key Elements:**

- **`components`**: Required for Vue to recognize the component inside the compiled string template.
- **`setup`**: Ensures `args` remain reactive.
- **`template`**: The raw Vue HTML. Always use `v-bind="args"` to automatically apply all prop arguments without explicitly writing each one out.

## 3. Best Practices

- **Test Every State:** Write a story for default, hover, disabled, loading, error, and empty states.
- **Avoid Hardcoded Widths:** Let components fill the available space in the story unless specifically testing fixed layouts, so they can be accurately verified across viewports.
