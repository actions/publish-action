# publish-action

[![Basic validation](https://github.com/actions/publish-action/actions/workflows/basic-validation.yml/badge.svg?branch=main)](https://github.com/actions/publish-action/actions/workflows/basic-validation.yml)

**Please note: this action is for internal usage only, issues are disabled and contributing PRs will not be reviewed. We also do not recommend this action for public or production usage while it is still in development.**

This action adds reliability to the new action versions publishing and handles the following cases:
- Update a major tag (v1, for example) to point to the latest release (v1.2.1, for example).
- Create a major tag from the latest released tag if a major tag doesn't exist 

## Status
Alpha. Action is under development and internal testing.

## Usage
This action can be triggered automatically when a release is created or manually using a `workflow_dispatch` event. The actual major tag update will require manual approval. 
See [release-new-action-version.yml](./.github/workflows/release-new-action-version.yml) for usage example.

See [action.yml](action.yml) for a complete description of input and output fields.
Read more about action versioning notation in [action-versioning.md](https://github.com/actions/toolkit/blob/main/docs/action-versioning.md).

To roll back a release in case of customer impact, start the workflow manually and specify the previous stable tag.

## Conributions

We don't accept contributions until the action is ready for production.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE).
