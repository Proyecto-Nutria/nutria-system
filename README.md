# nutria-system

## Pre requisites

1. [Nodejs](https://nodejs.org/en/download/)
1. [Firebase CLI](https://firebase.google.com/docs/cli)
1. [Standardjs](https://standardjs.com/#install) (Install it globally)

## Setup

1. Change your current directory to `functions` folder and run:

   ```node
   npm install
   ```

1. Change the permissions of the `pre-commit` file:

   ```
   chmod +x pre-commit
   ```

1. Move the `pre-commit` file to the `.git/hooks` folder :

## Development

1. You can test your functions locally using:

```
firebase serve
```

## Important Notes

### 1. Commit Messages

Use the following rule to write your messages:

```
This commit will: <commit message>
```

Examples:

```
This commit will: Test the NutriaUser endpoint using jest
```

Note: Remember to capitalize the first letter of the message.

### 2. Tasks

All the available task are located inside the [board](https://github.com/Proyecto-Nutria/nutria-system/projects/1), remember to upload the status of your task to show others what has been done.

### 3. Ignored files

Please don't commit personal editor's configuration (e.g. .vscode), you shouldn't push your personal settings to the repo in order to not confuse other contributors.
