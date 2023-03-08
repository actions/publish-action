import * as versionUtils from '../src/version-utils';
import stableSemver from './data/stable-semver.json';
import stableBuildSemver from './data/stable-build-semver.json';
import prereleaseSemver from './data/prerelease-semver.json';
import prereleaseBuildSemver from './data/prerelease-build-semver.json';

describe('isStableSemverVersion', () => {
  it('validate if a version is stable', () => {
    expect(
      versionUtils.isStableSemverVersion(stableSemver as any)
    ).toBeTruthy();
  });

  it('validate if a version with build metadata is stable', () => {
    expect(
      versionUtils.isStableSemverVersion(stableBuildSemver as any)
    ).toBeTruthy();
  });

  it('validate if a pre-release version is not stable', () => {
    expect(
      versionUtils.isStableSemverVersion(prereleaseSemver as any)
    ).toBeFalsy();
  });

  it('validate if a pre-release version with build metadata is not stable', () => {
    expect(
      versionUtils.isStableSemverVersion(prereleaseBuildSemver as any)
    ).toBeFalsy();
  });
});

describe('validateSemverVersionFromTag', () => {
  it('validate a tag containing a valid semantic version', () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('1.0.0')
    ).not.toThrow();
  });

  it("validate a tag containing a valid semantic version with 'v' prefix", () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('v1.0.0')
    ).not.toThrow();
  });

  it('validate a tag containing a valid semantic version with build metadata', () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('v1.0.0+20130313144700')
    ).not.toThrow();
  });

  it('throw when a tag contains an invalid semantic version', () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('1.0.0invalid')
    ).toThrow(
      "The '1.0.0invalid' doesn't satisfy semantic versioning specification"
    );
  });

  it('throw when a tag contains a valid unstable semantic version', () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('v1.0.0-beta.1')
    ).toThrow(
      'It is not allowed to specify pre-release version to update the major tag'
    );
  });

  it('throw when a tag contains a valid unstable semantic version with build metadata', () => {
    expect(() =>
      versionUtils.validateSemverVersionFromTag('v1.0.0-beta.1+20130313144700')
    ).toThrow(
      'It is not allowed to specify pre-release version to update the major tag'
    );
  });
});

describe('getMajorTagFromFullTag', () => {
  describe('get a valid major tag from full tag', () => {
    it.each([
      ['1.0.0', '1'],
      ['v1.0.0', 'v1'],
      ['v1.0.0-beta.1', 'v1'],
      ['v1.0.0+20130313144700', 'v1']
    ] as [string, string][])(
      '%s -> %s',
      (sourceTag: string, expectedMajorTag: string) => {
        const resultantMajorTag =
          versionUtils.getMajorTagFromFullTag(sourceTag);
        expect(resultantMajorTag).toBe(expectedMajorTag);
      }
    );
  });
});
