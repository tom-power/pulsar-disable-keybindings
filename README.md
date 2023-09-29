# Pulsar disable-keybindings package

<p>
<a href="https://github.com/tom-power/pulsar-disable-keybindings/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/tom-power/pulsar-disable-keybindings/main.yml?style=flat-square&logo=github&label=CI%20status" alt="actions status">
  </a>
</p>

Package for disabling bundled and community package keybindings in Pulsar.

Continuation of archived [atom-disable-keybindings](https://github.com/aki77).

## Settings

- `allBundledPackages` (default: false)
- `bundledPackages` (default: [])
- `exceptBundledPackages` (default: [])
- `allCommunityPackages` (default: false)
- `communityPackages` (default: [])
- `exceptCommunityPackages` (default: [])
- `PrefixKeys` (default: [])

![settings](https://cdn.statically.io/gh/tom-power/pulsar-disable-keybindings/main/assets/settings.png)

## Commands

- `disable-keybindings:reload`
- `disable-keybindings:reset`

## Links

- [Bundled prefixed keys bindings delay even if 'unset!' by user keymap · Issue #78 · atom/atom-keymap](https://github.com/atom/atom-keymap/issues/78)
- [Direct bindings should override prefixes? · Issue #49 · atom/atom-keymap](https://github.com/atom/atom-keymap/issues/49)
- [Key-binding hell - features - Atom Discussion](https://discuss.atom.io/t/key-binding-hell/12075)
