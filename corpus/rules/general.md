---
priority: 10
---

# Coding Best Practices

- Use early returns when possible.
- Remove unnecessary comments and doc blocks.
    - Leave doc blocks or comments that are important for tooling (such as linting exceptions or type annotations).
    - Comments should only explain the why, not the how (that can be inferred from the code).
    - Functions and variable names should be self-descriptive. Instead of writing a comment, extract some code in a function with a descriptive name.
- Remove dead code.
- Strive for consistency.
- Remember and apply the SOLID principles (whilst remaining practical, don't use them just for architecture purity):
    - Single Responsibility Principle: A class should have one, and only one, specific job or reason to change.
    - Open/Closed Principle: Software entities should be open for extension (adding new behavior) but closed for modification (altering existing, tested code).
    - Liskov Substitution Principle: Objects of a superclass must be replaceable with objects of its subclasses without breaking the functionality of the program.
    - Interface Segregation Principle: Code should not be forced to depend on methods it does not use; it is better to have many small, specific interfaces than one large, general-purpose interface.
    - Dependency Inversion Principle: High-level modules should depend on abstractions (like interfaces), rather than relying directly on concrete, low-level implementations.
