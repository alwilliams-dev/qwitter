# Wiki Conventions

_A shared page: it is maintained across every project's wiki, not just this one._

How pages work here. This page is shared: every project's wiki can read it, and no project owns it.

## Linking

Write `[slug](./slug.md)` to link to another page, or `[the words you want](./slug.md)` to choose the link text. A link to a page that does not exist yet renders red — following it is how you create the page, which is the intended way to grow a wiki: write the link where it belongs, then fill it in.

Each page lists what links to it, so a page nobody references is visible as such.

## Scope

A page is either **project** (scoped to one repository) or **shared** (this page, and the others like it). The agent may read both. It may only write pages in the project it is working in, so a request to change a shared page is a request for a person.

## Writing a page

- One subject per page. If a heading is growing its own sections, it is a page.
- Say what is true of the code as it is, and link to the paths that show it.
- Prefer a short page that is current to a long one that was current.
- Say when something is unknown. An empty section is information; a guess is not.

## Getting it into the repository

The wiki lives in the database, which is what makes it searchable and editable in place. Publishing writes the pages out as markdown under `docs/wiki/` on a branch and opens a pull request, so the wiki can also be reviewed and read next to the code it describes.

See also [engineering-principles](./engineering-principles.md).

---

<sub>Wiki page `wiki-conventions` · revision 1 · last written by seed · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
