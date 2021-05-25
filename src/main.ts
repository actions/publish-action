import * as core from '@actions/core';
import * as github from '@actions/github';
import { context } from '@actions/github';
import { updateTag, validateIfReleaseIsPublished, postMessageToSlack } from './api-utils';
import { validateSemverVersionFromTag, getMajorTagFromFullTag } from './version-utils';

async function run(): Promise<void> {
    try {
        const token = core.getInput('token');
        const octokitClient = github.getOctokit(token);
        const sourceTagName = core.getInput('source-tag');

        validateSemverVersionFromTag(sourceTagName);

        await validateIfReleaseIsPublished(sourceTagName, octokitClient);

        const majorTag = getMajorTagFromFullTag(sourceTagName);
        await updateTag(sourceTagName, majorTag, octokitClient);

        core.setOutput('major-tag', majorTag);
        core.info(`The '${majorTag}' major tag now points to the '${sourceTagName}' tag`);

        const slackMessage = `The ${majorTag} tag has been successfully updated for the ${context.repo.repo} action to include changes from the ${sourceTagName}`;
        await reportStatusToSlack(slackMessage);
    } catch (error) {
        core.setFailed(error.message);

        const slackMessage = `Failed to update a major tag for the ${context.repo.repo} action`;
        await reportStatusToSlack(slackMessage);
    }
};

async function reportStatusToSlack(message: string): Promise<void> {
    const slackWebhook = core.getInput('slack-webhook');
    if (slackWebhook) {
        await postMessageToSlack(slackWebhook, message);
    }
}

run();