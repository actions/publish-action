import * as versionUtils from "../src/version-utils";

describe("isStableSemverVersion", () => {
    it("validate if a version is stable", () => {
        const semverVersion = require("./data/stable-semver.json");
        expect(versionUtils.isStableSemverVersion(semverVersion)).toBeTruthy();
    });
    
    it("validate if a version with build metadata is stable", () => {
        const semverVersion = require("./data/stable-build-semver.json");
        expect(versionUtils.isStableSemverVersion(semverVersion)).toBeTruthy();
    });

    it("validate if a pre-release version is not stable", () => {
        const semverVersion = require("./data/prerelease-semver.json");
        expect(versionUtils.isStableSemverVersion(semverVersion)).toBeFalsy();
    });

    it("validate if a pre-release version with build metadata is not stable", () => {
        const semverVersion = require("./data/prerelease-build-semver.json");
        expect(versionUtils.isStableSemverVersion(semverVersion)).toBeFalsy();
    });
});

describe("validateSemverVersionFromTag", () => {
    it("validate a tag containing an valid semantic version", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("1.0.0")).not.toThrow();
    });

    it("validate a tag containing an valid semantic version with 'v' prefix", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0")).not.toThrow();
    });

    it("validate a tag containing an valid semantic version with build metadata", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0+20130313144700")).not.toThrow();
    });

    it("throw when a tag contains an invalid semantic version", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("1.0.0invalid")).toThrowError(
            "The '1.0.0invalid' doesn't satisfy semantic versioning specification"
        );
    });

    it("throw when a tag contains an valid unstable semantic version", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0-beta.1")).toThrowError(
            "It is not allowed to specify pre-release version to update the major tag"
        );
    });

    it("throw when a tag contains an valid unstable semantic version with build metadata", () => {
        expect(() => versionUtils.validateSemverVersionFromTag("v1.0.0-beta.1+20130313144700")).toThrowError(
            "It is not allowed to specify pre-release version to update the major tag"
        );
    });
});

describe("getMajorTagFromFullTag", () => {
    describe("get a valid major tag from full tag", () => {
        it.each([
            ["1.0.0", "1"],
            ["v1.0.0", "v1"],
            ["v1.0.0-beta.1", "v1"],
            ["v1.0.0+20130313144700", "v1"],
        ] as [string, string][])("%s -> %s", (sourceTag: string, expectedMajorTag: string) => {
            const resultantMajorTag = versionUtils.getMajorTagFromFullTag(sourceTag);
            expect(resultantMajorTag).toBe(expectedMajorTag);
        });
    });
});