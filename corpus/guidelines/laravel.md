---
stack: laravel
---

# Laravel Best Practices

- Use proper namespace declarations and organize imports logically.
- Prefer explicit return type declarations on methods.
- Follow Laravel conventions for controllers, models, and services.
- Use proper error handling patterns (exceptions, custom exception classes).
- Maintain consistent naming conventions (PSR-12, Laravel standards).

## Controllers

- Prefer validating arguments in a custom Request class, instead of inline ->validate().
- Avoid declaring Request arguments unless they are custom classes. For basic requests, use the request() helper instead.

## Frontend

### Page Partials

If a page component is too big, consider splitting it into partials:

- Put page components in a local `Partials/` folder next to the page (e.g. `Posts/Partials/ShowHeader.vue` next to `Posts/Show.vue`).
- If the page was a single component (e.g. `Welcome.vue`), move it into a folder (e.g. `Welcome/Index.vue` with partials like `Welcome/Partials/WelcomeHero.vue`).
- Keep shared functionality in the main page component, and pass it down to each partial with props as necessary.
