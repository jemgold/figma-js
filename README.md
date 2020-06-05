# Figma.js

A simple wrapper for the Figma API.

Cool projects using this:
- [figma-graphql](https://github.com/braposo/figma-graphql)
- [figmint](https://github.com/tiltshift/figmint)

## Usage

[Full documentation](http://jongold.github.io/figma-js) is available on the web and most everything is typed with TypeScript.

### Creating a client

Quickest start is to grab a personal access token from your Figma account settings page

```typescript
import * as Figma from 'figma-js';

const token = '12345';

const client = Figma.Client({
  personalAccessToken: token
});
```

Or if you're building an app with OAuth authentication, after you get back the OAuth access token…

```typescript
import * as Figma from 'figma-js';

const token = '12345';

const client = Figma.Client({
  accessToken: token
});
```

### Doing cool things

Once you have instantiated a client, have fun!

```typescript
client.file('file-id').then(({ data }) => {
  console.log(data);
});
```

### Just reusing types

All of the types in the Figma file format / API are exported.

```typescript
import * as Figma from 'figma-js';

const textNode: Figma.Text = {
  // … this should autocomplete if your editor is set up for it!
};
```

## Contributing

We used the [`typescript-starter`](https://github.com/bitjson/typescript-starter) repo for this - refer to its README for more detailed instructions.

Helpful development commands:

```sh
yarn watch
yarn docs
yarn docs:publish
```

### Contributions welcomed

* [ ] [generate types automatically](https://github.com/jongold/figma-js/issues/1)
* [ ] [add tests](https://github.com/jongold/figma-js/issues/2)

### Committing

```sh
yarn global add commitizen

# instead of git commit

git cz
```

## Contributors

* [@jongold](https://github.com/jongold/) (Airbnb)
* [@chrisdrackett](https://github.com/chrisdrackett/)
