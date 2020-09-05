# Build providers

This directory contains build providers that follow a similar api so that they can expose helpers for building and watching a certain type of build; for example TypeScript or Rollup. They should expose a watch function and a build function that can be utilized by the build pipeline and build scripts, so they can be reused throughout the codebase whenever we need to programmatically run builds (for example when we have to make a build script that runs a rollup build continuously and a typescript build continuously in parallel via watch mode).

## API to expose

Any sort of build provider can be added, as long as it follows the following API for consistency:

``` ts
module.exports = {
    watch(configPath): Promise<void>;
    compile(configPath): Promise<void> | void;
}
```
