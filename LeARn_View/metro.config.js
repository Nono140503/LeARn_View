// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Keep this if you previously added it for Firebase *.cjs builds
config.resolver.sourceExts.push('cjs');

// <-- the line that matters
config.resolver.unstable_enablePackageExports = false;


module.exports = config;
