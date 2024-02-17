[//]: # (&#40;https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts&#41;)

> [!WARNING]
> This SDK is no longer supported or maintained by Medium.

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

// Access Token is optional, can also be set
// as environment variable `MEDIUM_ACCESS_TOKEN`
const medium = new MediumClient('YOUR_ACCESS_TOKEN');

const { id: userId, username } = await medium.getUser();

// Publish New Draft Post for User
const post = await medium.createPost({
  userId,
  title: 'A new post',
  contentFormat: PostContentFormat.HTML,
  content: '<h1>A New Post</h1><p>This is my new post.</p>',
  publishStatus: PostPublishStatus.DRAFT,
});
console.log(`New Post: ${JSON.stringify(post, null, 2)}`);

// Get User's Published Posts
const postTitles = await medium.getUserPostTitles(username);
console.log(`User Posts: ${JSON.stringify(postTitles, null, 2)}`);
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

* Copyright 2015 [A Medium Corporation](https://medium.com)
* Copyright 2024 [Ritvik Nag](https://github.com/rnag)

Originally Licensed under Apache License Version 2.0.

Licensed under MIT.  Details in the attached LICENSE
file.
