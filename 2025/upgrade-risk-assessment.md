# SPFx Upgrade Risk Assessment

## Projects Identified
- brandcenter
- test
- theme-exporter
- workshop

## Current State
- brandcenter: SPFx 1.21.1, gulp toolchain
- test: SPFx 1.22.0-beta.2, heft toolchain
- theme-exporter: SPFx 1.22.0-beta.5, heft toolchain
- workshop: SPFx 1.21.1, gulp toolchain

## Risks
- **Breaking changes**: Upgrading SPFx or switching toolchains (gulp → heft) may break custom scripts, build tasks, or integrations.
- **Dependency compatibility**: Some dependencies may not be compatible with the latest SPFx version or the new toolchain.
- **Beta versions**: Some projects use beta SPFx versions, which may introduce instability or require additional fixes.
- **Custom code**: Custom build steps or scripts may require manual migration.
- **Rollback complexity**: If not properly planned, rollback may be difficult after migration.
- **Documentation gaps**: Incomplete documentation may lead to missed steps or errors during upgrade.

## Mitigation
- Use git branches/tags to enable rollback.
- Backup all config and lock files before upgrade.
- Test each project after upgrade in isolation.
- Document every change in upgrade-log.md.
- Follow official upgrade and migration guides closely.

---

Next: Run the SPFx project upgrade tool for each project and collect the output for detailed upgrade steps.
