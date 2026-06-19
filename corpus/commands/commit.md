---
description: Commit the staged changes
---

Create a new commit with the changes in the git staging area, following these rules:

- User message (may be empty): {{args}}
- Never change any code. If you think something should be changed, ask the user instead.
- Before making the commit, show the complete commit message to the user and ask for confirmation.
- Always append a Co-Authored-By: line with the agent/model used to perform the changes.
- Look at the last 5 commit messages in the repository to follow a similar format.
