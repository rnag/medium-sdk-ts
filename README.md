[//]: # (&#40;https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts&#41;)

> [!WARNING]
> This API is no longer supported or maintained by Medium.

# Medium SDK for TypeScript

![medium-sdk-ts: Stable](https://img.shields.io/badge/medium--sdk--ts-stable-success.svg?style=for-the-badge)
[![npm](https://img.shields.io/npm/v/medium-sdk-ts?style=for-the-badge)](https://www.npmjs.com/package/medium-sdk-ts)

This repository contains the open source SDK for integrating [Medium](https://medium.com)'s OAuth2 API into your TypeScript (or NodeJs) app.

View the full [documentation here](https://github.com/Medium/medium-api-docs).

Install
-------

With [npm](http://npmjs.org/) do:

```sh
npm i medium-sdk-ts
```

Usage
-----

Create a client, then call commands on it.

```javascript
import {
  MediumClient,
  PostContentFormat,
  PostPublishStatus,
} from 'medium-sdk-ts';

// Uncomment for CommonJS (Require)
// const {
//     MediumClient,
//     PostContentFormat,
//     PostPublishStatus,
// } = require('medium-sdk-ts');

// Access Token is optional, can also be set
// as environment variable `MEDIUM_ACCESS_TOKEN`
const medium = new MediumClient('YOUR_ACCESS_TOKEN');

async function main() {
  const user = await medium.getUser();
  console.log(`User: ${JSON.stringify(user, null, 2)}`);

  const { id: userId, username } = user;

  // Publish New Draft Post for User
  const post = await medium.createPost({
    // Only `title` and `content` are required to create a post
    title: 'A new post',
    content: '<h1>A New Post</h1><p>This is my new post.</p>',
    // Optional below
    userId,
    contentFormat: PostContentFormat.HTML,   // Defaults to `markdown`
    publishStatus: PostPublishStatus.DRAFT,  // Defaults to `draft`
    // tags: ["my", "tags"],
    // canonicalUrl: "https://my-url.com",
  });
  console.log(`New Post: ${JSON.stringify(post, null, 2)}`);

  // Get User's Published Posts (Title Only)
  const postTitles = await medium.getPostTitles(username);
  console.log(`User Post Titles: ${JSON.stringify(postTitles, null, 2)}`);
}

main();
```

Contributing
------------

Questions, comments, bug reports, and pull requests are all welcomed. If you haven't contributed to a Medium project before please head over to the [Open Source Project](https://github.com/Medium/opensource#note-to-external-contributors) and fill out an OCLA (it should be pretty painless).

Authors
-------

* [Ritvik Nag](https://github.com/rnag)
* [Jamie Talbot](https://github.com/majelbstoat)

License
-------

* Copyright 2024 [Ritvik Nag](https://github.com/rnag)
* Copyright 2015 [A Medium Corporation](https://medium.com)

Originally Licensed under Apache License Version 2.0.

Licensed under MIT.  Details in the attached LICENSE
file.
