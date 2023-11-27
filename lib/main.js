const _ = require('underscore-plus');
const { CompositeDisposable } = require('atom');

module.exports = {
  subscriptions: null,

  config: {
    allBundledPackages: {
      order: 1,
      type: 'boolean',
      default: false
    },

    bundledPackages: {
      order: 2,
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    },

    exceptBundledPackages: {
      order: 3,
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    },

    allCommunityPackages: {
      order: 11,
      type: 'boolean',
      default: false
    },

    communityPackages: {
      order: 12,
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    },

    exceptCommunityPackages: {
      order: 13,
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    },

    prefixKeys: {
      order: 21,
      type: 'array',
      default: [],
      items: {
        type: 'string'
      }
    }
  },

  activate(state) {
    this.subscriptions = new CompositeDisposable;
    this.disabledPackages = new Set;
    this.disabledKeyBindings = new Set;
    this.debug = atom.inDevMode() && !atom.inSpecMode();

    this.debouncedReload = _.debounce((() => this.reload()), 1000);
    this.subscriptions.add(atom.config.onDidChange('disable-keybindings', this.debouncedReload));

    this.subscriptions.add(atom.packages.onDidActivateInitialPackages(() => this.init()));

    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'disable-keybindings:reload': () => this.reload(),
      'disable-keybindings:reset': () => this.reset(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    return this.reset();
  },

  init() {
    this.reload();
    return this.subscriptions.add(atom.packages.onDidLoadPackage(pack => this.onLoadedPackage(pack)));
  },

  // need update-package
  onLoadedPackage(pack) {
    if (pack.settingsActivated) { return this.debouncedReload(); }

    const {
      activateResources
    } = pack;
    return pack.activateResources = () => {
      activateResources.call(pack);
      pack.activateResources = activateResources;
      if (this.debug) { console.log('activateResources', pack); }
      return this.debouncedReload();
    };
  },

  reload() {
    this.reset();
    this.disablePackageKeymaps();

    const oldKeyBindings = atom.keymaps.keyBindings.slice();
    this.removeKeymapsByPrefixKey(atom.config.get('disable-keybindings.prefixKeys'));

    for (var binding of Array.from(_.difference(oldKeyBindings, atom.keymaps.keyBindings))) {
      if (this.debug) { console.log('disable keyBinding', binding); }
      this.disabledKeyBindings.add(binding);
    }
  },

  reset() {
    this.disabledPackages.forEach(pack => {
      pack.activateKeymaps();
      if (this.debug) { return console.log(`enable package keymaps: ${pack.name}`); }
    });
    this.disabledPackages.clear();
    atom.config.unset('core.packagesWithKeymapsDisabled');

    this.disabledKeyBindings.forEach(binding => {
      if (!Array.from(atom.keymaps.keyBindings).includes(binding)) {
        if (this.debug) { console.log('enable keyBinding', binding); }
        return atom.keymaps.keyBindings.push(binding);
      }
    });
    return this.disabledKeyBindings.clear();
  },

  disablePackageKeymaps() {
    return atom.packages.getLoadedPackages().forEach(pack => {
      if (!this.isDisablePackage(pack.name)) { return; }
      pack.deactivateKeymaps();
      this.disabledPackages.add(pack);
      atom.config.pushAtKeyPath('core.packagesWithKeymapsDisabled', pack.name);
      if (this.debug) { return console.log(`disable package keymaps: ${pack.name}`); }
    });
  },

  isDisablePackage(name) {
    if (atom.packages.isBundledPackage(name)) {
      let needle, needle1;
      if ((needle = name, Array.from(atom.config.get('disable-keybindings.exceptBundledPackages')).includes(needle))) { return false; }
      if (atom.config.get('disable-keybindings.allBundledPackages')) { return true; }
      return (needle1 = name, Array.from(atom.config.get('disable-keybindings.bundledPackages')).includes(needle1));
    } else {
      let needle2, needle3;
      if ((needle2 = name, Array.from(atom.config.get('disable-keybindings.exceptCommunityPackages')).includes(needle2))) { return false; }
      if (atom.config.get('disable-keybindings.allCommunityPackages')) { return true; }
      return (needle3 = name, Array.from(atom.config.get('disable-keybindings.communityPackages')).includes(needle3));
    }
  },

  removeKeymapsByPrefixKey(prefixKey) {
    if (Array.isArray(prefixKey)) {
      for (var k of Array.from(prefixKey)) { this.removeKeymapsByPrefixKey(k); }
      return;
    }

    const keystrokesWithSpace = prefixKey + ' ';
    return atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(binding => binding.keystrokes.indexOf(keystrokesWithSpace) !== 0);
  }
};
