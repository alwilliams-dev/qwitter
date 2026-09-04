# Engineering Principles

_A shared page: it is maintained across every project's wiki, not just this one._

Shared principles — the ones that hold regardless of which repository you are in. Project-specific rules go on that project's [coding-standards](./coding-standards.md) page, which is allowed to contradict this one and wins where it does.

## Make the invariant structural

If a rule can be enforced by a type, a registry or a schema, enforce it there. A rule that lives only in a comment or a prompt is a rule that holds until someone is in a hurry.

## Say why, not what

The diff says what changed. A comment or a commit message earns its space by saying why this and not the obvious alternative — which is also the thing nobody can recover six months later.

## Name the failure

Errors that say what could not be done, to what, and what to try instead. "Invalid input" is a message that requires a debugger to act on.

## Leave the state readable

Anything a person may need to know after a reload belongs somewhere durable, not in the memory of the process doing the work.

See also [wiki-conventions](./wiki-conventions.md).

---

<sub>Wiki page `engineering-principles` · revision 1 · last written by seed · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
