// index.test.ts

import { CreatePostRequest, MediumClient } from '.';

const itif = (condition: boolean): jest.It =>
    condition ? it : it.skip;

const localTest = itif(!process.env.RUNNING_ON_CI);

// Jest tests require `MEDIUM_ACCESS_TOKEN` environment variable
describe('Medium SDK', () => {
    const medium = new MediumClient();
    const username = 'ritviknag';

    test('Get User', async () => {
        const user = await medium.getUser();
        console.log(user);
    });

    test('Get Publications For User', async () => {
        const { id: userId } = await medium.getUser();
        const result = await medium.getPublicationsForUser({
            userId,
        });

        console.log(result);
    });

    localTest('Create Draft Post', async () => {
        let newPost: CreatePostRequest = {
            title: 'ABC Test',
            content:
                '# Header 1\n\n' +
                '> Quoted value\n\n' +
                'Paragraph.\n\n' +
                '## Header 2\n\n' +
                '`Hello World!`\n\n' +
                '---\n\n' +
                '**Test** _123_',
        };
        let post = await medium.createPost(newPost);

        console.log(`Post: ${JSON.stringify(post, null, 2)}`);
    });

    test('Get Post Titles', async () => {
        // const { username } = await medium.getUser();
        const postTitles = await medium.getPostTitles(username);

        // console.log(JSON.stringify(postTitles));
        console.log(postTitles);
    });

    test('Get Posts', async () => {
        // const { username } = await medium.getUser();
        const posts = await medium.getPosts(username);

        // console.log(JSON.stringify(posts));
        console.log(posts);
    });

    // test('add works', () => {
    //     expect(add(1, 2)).toBeGreaterThanOrEqual(3);
    // });
    //
    // test('add works pt 2', () => {
    //     expect(add(10, 1)).toBeLessThanOrEqual(12);
    // });

    // Add more test cases as needed
});
