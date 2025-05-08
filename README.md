# Visua11yze

![Visua11yze icon, featuring three concentric squares that are cornflowerblue, goldenrod, and hotpink.](./icons/visua11yze.png)

Visualize the accessibility of websites using custom CSS that adds visual regressions for HTML anti-patterns and accessibility issues. Use custom JS to analyze and log details that can't be determined through CSS alone.

## Getting Started

This extension is intentionally minimal, so there are no dependencies or build steps. You can `git clone` or download the zip file from the releases to experiment with this extension locally.

## Setting up the extension for local testing

### Chrome (and chromium browsers)

1. Go to `chrome:extensions` (it may be different in other chromium browsers, e.g. `vivaldi:extensions`)
1. Toggle "Developer mode" on
1. Click "Load unpacked" and select this project from wherever it's stored on your computer
1. The icon should appear in your browser, and the extension should be ready to run
1. After making changes to the extension, click the "Reload" icon to update the extension in the browser
1. When done, click "Remove" to remove the extension from the browser

### Firefox

1. Go to `about:debugging`
1. Click "This Firefox"
1. Click "Load Temporary Add-on" and select the `manifest.json` file from this project from wherever it's stored on your computer
1. The icon should appear in your browser, and the extension should be ready to run
1. After making changes to the extension, click "Reload" to update the extension in the browser
1. When done, click "Remove" to remove the extension from the browser

### Safari

Note: Safari is not a main target for this extension, so it may crash or otherwise be a bit buggy. Use at your own risk!

1. In the Safari menu, go to Safari > Settings
1. Go to the Developer tab (you may need to check "Show features for web developers" in the Advanced tab if the Developer tab isn't shown)
1. Check "Allow unsigned extensions"
1. Click "Add Temporary Extension" and select this project from wherever it's stored on your computer
1. After making changes to the extension, click "Reload" to update the extension in the browser
1. When done, click "Uninstall" to remove the extension from the browser
