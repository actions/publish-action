import * as core from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

interface GitRef {
  ref: string;
  node_id: string;
  url: string;
  object: {
    type: string;
    sha: string;
    url: string;
  };
}

async function findTag(
  tag: string,
  octokitClient: InstanceType<typeof GitHub>
): Promise<GitRef | null> {
  try {
    const { data: foundTag } = await octokitClient.git.getRef({
      ...context.repo,
      ref: `tags/${tag}`,
    });

    return foundTag;
  } catch (err) {
    if (err.status === 404) {
      return null;
    } else {
      throw new Error(
        `Retrieving refs failed with the following error: ${err}`
      );
    }
  }
}

async function getTagSHA(
  tag: string,
  octokitClient: InstanceType<typeof GitHub>
): Promise<string> {
  const foundTag = await findTag(tag, octokitClient);
  if (!foundTag) {
    throw new Error(`The '${tag}' tag does not exist in the remote repository`);
  }

  return foundTag.object.sha;
}

export async function validateIfReleaseIsPublished(
  tag: string,
  octokitClient: InstanceType<typeof GitHub>
): Promise<void> {
  try {
    const { data: foundRelease } = await octokitClient.repos.getReleaseByTag({
      ...context.repo,
      tag,
    });

    if (foundRelease.prerelease) {
      throw new Error(
        `The '${foundRelease.name}' release is marked as pre-release. Updating tags for pre-release is not supported`
      );
    }
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`No GitHub release found for the ${tag} tag`);
    } else {
      throw new Error(
        `Retrieving releases failed with the following error: ${err}`
      );
    }
  }
}

export async function updateTag(
  sourceTag: string,
  targetTag: string,
  octokitClient: InstanceType<typeof GitHub>
): Promise<void> {
  const sourceTagSHA = await getTagSHA(sourceTag, octokitClient);
  const foundTargetTag = await findTag(targetTag, octokitClient);
  const refName = `tags/${targetTag}`;

  if (foundTargetTag) {
    core.info(
      `Updating the '${targetTag}' tag to point to the '${sourceTag}' tag`
    );

    await octokitClient.git.updateRef({
      ...context.repo,
      ref: refName,
      sha: sourceTagSHA,
      force: true,
    });
  } else {
    core.info(`Creating the '${targetTag}' tag from the '${sourceTag}' tag`);

    await octokitClient.git.createRef({
      ...context.repo,
      ref: `refs/${refName}`,
      sha: sourceTagSHA,
    });
  }
}
