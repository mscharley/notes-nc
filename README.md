# Notes for NextCloud

**Author:** Matthew Scharley  
**Bugs/Support:** [Github Issues][gh-issues] - [Bug bounty][bug-bounty]  
**Copyright:** 2022  
**License:** [MIT license][license]  
**Status:** Active

[gh-issues]: https://github.com/mscharley/notes-nc/issues
[bug-bounty]: https://github.com/sponsors/mscharley/sponsorships?sponsor=mscharley&tier_id=93378
[license]: https://github.com/mscharley/notes-nc/blob/main/LICENSE

## What is this application?

This is a simple [Markdown][markdown] editor for taking notes quickly and easily. It does not integrate with any specific cloud syncing solutions, instead it opts to work with directories of files which can be synced between computers or other systems using most off the shelf cloud providers apps. It has been inspired heavily by the Notes app for NextCloud and the Notes app built into Mac OS X.

[markdown]: https://www.markdownguide.org/basic-syntax

## Installation

[Download the latest release][releases] for your operating system and run it.

[releases]: https://github.com/mscharley/notes-nc/releases/latest

## Project goals

1. Provide a simple, secure way to take notes.
2. Use Markdown for taking notes.
   - It's possible this will expand to other syntaxes. If multiple syntaxes are supported, this will always be a one to one setting per folder of notes. Each syncing source will have one note syntax associated with it.
3. Support multiple folders of notes. This allows for flexibility in usage.
   - You may want to sync some notes to one service and some with another.
   - You may want to keep some notes private and sync other notes with your team.
4. Subfolders are categorisation.
   - A subfolder of `Games` would show up as a category of `Games`.
   - A subfolder of `Games/Myst` would show some form of subcategorisation of `Games` then `Myst`.

## Explicit non-goals

1. No cloud syncing.
   - This is a lose/lose battle. We will never be able to support every provider, and most providers can already sync files. NextCloud treats the `/Notes` folder specially, but most providers can sync folders of files without any issues even if they have no specific special handling for markdown notes.
   - If there is a way we can increase compatibility with your favourite provider without writing code specific to that provider, then please do let us know.
2. Metadata that can't be represented as part of the filesystem.
   - No hidden files for storing metadata.
   - Markdown front matter may be an exception to this non-goal, if some good uses for it are found. While this app doesn't use it, front matter is still fine in your markdown notes today.
