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
