---
stack: vue
---

# Vue Best Practices

- Prefer small components over bloated components.
- Use prop shorthands when possible (:prop instead of :prop="prop").

## Accessibility

- Images that are purely decorative should have an empty alt attribute (alt="").

## Modals

When building or refactoring modals, always use the `@noeldemartin/vue-modals` library to render dynamic modals:

- **✅ Use Dynamic Modals:** Always use the `showModal()` helper and await the returned Promise if you need results from the modal.
- **✅ Strongly Type Emits:** The library uses TypeScript to automatically map the `close` emit payload to the resolved Promise. Define your emits accurately.
- **✅ Always Handle Dismissal:** The awaited Promise resolves to an object with a `dismissed: boolean` property. You must check this before attempting to access the data payload.
- **🛑 Never inline Modals:** Do not inline component declarations controlled by reactive booleans (e.g., `<MyModal :open="show"/>` or `v-if="show"`). This approach limits reusability, clutters templates, and makes async data retrieval unnecessarily difficult.

When you need to implement a new modal:

### 1. Create the Modal Component as a stand-alone file using `<Modal>`

Instead of tracking visibility state inside the modal, rely on Vue's standard `props` for incoming data, and the `close` emit for returning data.

```vue [QuestionModal.vue]
<script setup lang="ts">
import { Modal } from '@/components/ui/modal';

// 1. Define arguments passed to the modal
defineProps<{ question: string }>();

// 2. Define the payload returned when the modal completes its task
defineEmits<{ close: [{ answer: string }] }>();
</script>

<template>
    <Modal>
        <p>{{ question }}</p>
        <!-- 3. Emit 'close' with the payload to resolve the Promise -->
        <button @click="$emit('close', { answer: 'It depends!' })">Submit</button>
    </Modal>
</template>
```

### 2. Invoke the Modal and handle the Response

Use the `showModal` function to open the modal from anywhere (scripts, composables, or other components). Await the Promise to retrieve the user's input.

Because a user might click away or cancel, you must always check the `dismissed` boolean on the returned result.

```typescript
import { showModal } from '@noeldemartin/vue-modals';
import QuestionModal from './QuestionModal.vue';

async function askQuestion() {
    // Pass the component and its props
    const result = await showModal(QuestionModal, {
        question: 'How many golf balls fit into a Boeing 747?',
    });

    // Always handle the dismissal state first
    if (result.dismissed) {
        console.log('Modal was closed without an answer.');
        return;
    }

    // If not dismissed, the emitted payload is available
    console.log('The answer is:', result.answer);
}
```
