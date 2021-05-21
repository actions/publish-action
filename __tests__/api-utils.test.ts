import * as github from "@actions/github";
import * as apiUtils from "../src/api-utils";

const prereleaseData = require("./data/pre-release.json");
const releaseData = require("./data/release.json");

const token = "faketoken";
const octokitClient = github.getOctokit(token);

let getReleaseSpy: jest.SpyInstance;

process.env.GITHUB_REPOSITORY = "test/repository";

describe("validateIfReleaseIsPublished", () => {
    beforeEach(() => {
        getReleaseSpy = jest.spyOn(octokitClient.repos, "getReleaseByTag");
    });

    it("throw if release is marked as pre-release", async () => {
        getReleaseSpy.mockReturnValue(prereleaseData);
        
        expect.assertions(1);
        await expect(apiUtils.validateIfReleaseIsPublished("v1.0.0", octokitClient)).rejects.toThrowError(
            "The 'v1.0.0' release is marked as pre-release. Updating tags for pre-release is not supported"
        );
    });

    it("validate that release is published", async () => {
        getReleaseSpy.mockReturnValue(releaseData);

        expect.assertions(1);
        await expect(apiUtils.validateIfReleaseIsPublished("v1.1.0", octokitClient)).resolves.not.toThrow();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });
});