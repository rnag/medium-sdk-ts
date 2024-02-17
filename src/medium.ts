// Copyright 2015 A Medium Corporation
// Copyright 2024 Ritvik Nag

import {
    CreatePostRequest,
    Post,
    PostContentFormat,
    PostLicense,
    PostPublishStatus,
    User,
} from './types';

const DEFAULT_ERROR_CODE = -1;
const DEFAULT_TIMEOUT_MS = 5000;

const {
    // INPUT_MARKDOWN_FILE,
    // INPUT_BASE_URL,
    // INPUT_POST_URL,
    MEDIUM_ACCESS_TOKEN,
    MEDIUM_POST_STATUS = PostPublishStatus.DRAFT,
    MEDIUM_POST_LICENSE = PostLicense.ALL_RIGHTS_RESERVED,
} = process.env;

/**
 * An error with a code.
 */
class MediumError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

/**
 * The core client.
 */
class MediumClient {
    private readonly _accessToken: string;

    /**
     * Sets an access token on the client used for making requests.
     */
    constructor(
        accessToken: string | undefined = MEDIUM_ACCESS_TOKEN
    ) {
        this._accessToken = accessToken!;
    }

    /**
     * Returns the details of the user associated with the current
     * access token.
     *
     * Requires the current access token to have the basicProfile scope.
     */
    async getUser(): Promise<User> {
        return this._makeRequest({
            method: 'GET',
            path: '/v1/me',
        });
    }

    /**
     * Returns the publications related to the current user.
     *
     * Requires the current access token to have the
     * listPublications scope.
     */
    async getPublicationsForUser(options: {
        userId: string;
    }): Promise<any> {
        this._enforce(options, ['userId']);
        return this._makeRequest({
            method: 'GET',
            path: `/v1/users/${options.userId}/publications`,
        });
    }

    /**
     * Returns the contributors for a chosen publication.
     *
     * Requires the current access token to have the basicProfile scope.
     */
    async getContributorsForPublication(options: {
        publicationId: string;
    }): Promise<any> {
        this._enforce(options, ['publicationId']);
        return this._makeRequest({
            method: 'GET',
            path: `/v1/publications/${options.publicationId}/contributors`,
        });
    }

    /**
     * Creates a post on Medium.
     *
     * Requires the current access token to have the publishPost scope.
     */
    async createPost({
        title,
        content,
        userId,
        tags,
        canonicalUrl,
        license = <PostLicense>MEDIUM_POST_LICENSE,
        publishedAt,
        publishStatus = <PostPublishStatus>MEDIUM_POST_STATUS,
        contentFormat = PostContentFormat.MARKDOWN,
    }: CreatePostRequest): Promise<Post> {
        // If `user id` is not provided, use the current user.
        if (!userId) ({ id: userId } = await this.getUser());

        return await this._createPost({
            canonicalUrl,
            content,
            contentFormat,
            license,
            publishedAt,
            publishStatus,
            tags,
            title,
            userId,
        });
    }

    /**
     * Creates a post on Medium.
     *
     * Requires the current access token to have the publishPost scope.
     */
    private async _createPost(
        options: CreatePostRequest
    ): Promise<Post> {
        this._enforce(options, ['userId']);

        return this._makeRequest({
            method: 'POST',
            path: `/v1/users/${options.userId}/posts`,
            data: {
                canonicalUrl: options.canonicalUrl,
                content: options.content,
                contentFormat: options.contentFormat,
                license: options.license,
                publishedAt: options.publishedAt,
                publishStatus: options.publishStatus,
                tags: options.tags,
                title: options.title,
            },
        });
    }

    /**
     * Creates a post on Medium and places it under the specified publication.
     *
     * Requires the current access token to have the publishPost scope.
     */
    async createPostInPublication(options: {
        userId: string;
        publicationId: string;
        title: string;
        contentFormat: PostContentFormat;
        content: string;
        tags: string[];
        canonicalUrl: string;
        publishedAt?: string;
        publishStatus: PostPublishStatus;
        license: PostLicense;
    }): Promise<Post> {
        this._enforce(options, ['publicationId']);

        return this._makeRequest({
            method: 'POST',
            path: `/v1/publications/${options.publicationId}/posts`,
            data: {
                title: options.title,
                content: options.content,
                contentFormat: options.contentFormat,
                tags: options.tags,
                canonicalUrl: options.canonicalUrl,
                publishedAt: options.publishedAt,
                publishStatus: options.publishStatus,
                license: options.license,
            },
        });
    }

    /**
     * Enforces that the given options object (first param) defines
     * all keys requested (second param). Raises an error if any
     * is missing.
     */
    private _enforce(options: any, requiredKeys: string[]): void {
        if (!options) {
            throw new MediumError(
                'Parameters for this call are undefined',
                DEFAULT_ERROR_CODE
            );
        }
        requiredKeys.forEach((requiredKey) => {
            if (!options[requiredKey])
                throw new MediumError(
                    `Missing required parameter "${requiredKey}"`,
                    DEFAULT_ERROR_CODE
                );
        });
    }

    /**
     * Makes a request to the Medium API.
     */
    private async _makeRequest(options: any): Promise<any> {
        const requestParams: RequestInit = {
            method: options.method,
            headers: {
                'Content-Type':
                    options.contentType || 'application/json',
                Authorization: `Bearer ${this._accessToken}`,
                Accept: 'application/json',
                'Accept-Charset': 'utf-8',
            },
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        };

        if (options.data) {
            requestParams.body = JSON.stringify(options.data);
        }

        try {
            const response = await fetch(
                `https://api.medium.com${options.path}`,
                requestParams
            );

            const payload = await response.json();

            const statusType = Math.floor(response.status / 100);

            if (statusType === 4 || statusType === 5) {
                const err = payload.errors[0];
                throw new MediumError(err.message, err.code);
            } else if (statusType === 2) {
                return payload.data || payload;
            } else {
                throw new MediumError(
                    'Unexpected response',
                    DEFAULT_ERROR_CODE
                );
            }
        } catch (err: any) {
            console.log(`Error: ${err}`);
            throw new MediumError(err.toString(), DEFAULT_ERROR_CODE);
        }
    }

    async getUserPostTitles(username: string): Promise<string[]> {
        let next: number = 0,
            allPosts: string[] = [],
            posts: string[];

        while (next != null) {
            ({ posts, next } = await this._getUserPostTitles(
                username,
                next
            ));
            allPosts.push(...posts);
        }

        return allPosts;
    }

    async getUserPosts(username: string) {
        let next = 0,
            allPosts = [],
            posts;

        while (next != null) {
            ({ posts, next } = await this._getUserPosts(
                username,
                next
            ));
            allPosts.push(...posts);
        }

        return allPosts;
    }

    private async _getUserPosts(username: string, page: number) {
        let graphqlBody = {
            operationName: 'UserStreamOverview',
            query: graphqlQuery,
            variables: {
                userId: username,
                pagingOptions: {
                    limit: pageLimit,
                    page: null,
                    source: null,
                    to: page ? String(page) : String(Date.now()),
                    ignoredIds: null,
                },
            },
        };

        let resp = await fetch('https://medium.com/_/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphqlBody),
        });

        // NOTE: strip non-post items and strip description fields
        let resp_data = await resp.json();
        let author: string = resp_data.data.user.name;
        // noinspection JSUnresolvedReference
        let posts = resp_data.data.user.profileStreamConnection.stream
            .map((stream: any) => {
                // noinspection JSUnresolvedReference
                return stream.itemType.post;
            })
            .map((post: any) => {
                // noinspection JSUnresolvedReference
                return {
                    id: post.id,
                    title: post.title,
                    link: post.mediumUrl,
                    pubDate: post.firstPublishedAt,
                    categories: post.tags.map(
                        (tag_obj: any) => tag_obj.id
                    ),
                };
            });

        // noinspection JSUnresolvedReference
        const next: number =
            posts.length === pageLimit
                ? resp_data.data.user.profileStreamConnection
                      .pagingInfo.next.to
                : null;

        return {
            author,
            posts,
            next,
        };
    }

    async _getUserPostTitles(username: string, page: number) {
        let graphqlBody = {
            operationName: 'UserStreamOverview',
            query: graphqlQueryMin,
            variables: {
                userId: username,
                pagingOptions: {
                    limit: pageLimit,
                    to: page ? String(page) : String(Date.now()),
                },
            },
        };

        let resp = await fetch('https://medium.com/_/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphqlBody),
        });

        // NOTE: strip non-post items and strip description fields
        let resp_data = await resp.json();
        // noinspection JSUnresolvedReference
        let posts: string[] =
            resp_data.data.user.profileStreamConnection.stream
                .map((stream: any) => {
                    // noinspection JSUnresolvedReference
                    return stream.itemType.post;
                })
                .map((post: any) => {
                    return post.title;
                });

        // noinspection JSUnresolvedReference
        const next: number =
            posts.length === pageLimit
                ? resp_data.data.user.profileStreamConnection
                      .pagingInfo.next.to
                : null;

        return {
            posts,
            next,
        };
    }
}

const graphqlQuery = `
query UserStreamOverview($userId: ID!, $pagingOptions: PagingOptions) {
  user(username: $userId) {
    name
    profileStreamConnection(paging: $pagingOptions) {
      ...commonStreamConnection
      __typename
    }
    __typename
  }
}
fragment commonStreamConnection on StreamConnection {
  pagingInfo {
    next {
      limit
      page
      source
      to
      ignoredIds
      __typename
    }
    __typename
  }
  stream {
    ...StreamItemList_streamItem
    __typename
  }
  __typename
}
fragment StreamItemList_streamItem on StreamItem {
  ...StreamItem_streamItem
  __typename
}
fragment StreamItem_streamItem on StreamItem {
  itemType {
    __typename
    ... on StreamItemPostPreview {
        post {
            id
            mediumUrl
            title
            firstPublishedAt
            tags {
                id
            }
            __typename
        }
      __typename
    }
  }
  __typename
}
`;

const graphqlQueryMin = `
query UserStreamOverview($userId: ID!, $pagingOptions: PagingOptions) {
  user(username: $userId) {
    profileStreamConnection(paging: $pagingOptions) {
      ...commonStreamConnection
      __typename
    }
    __typename
  }
}
fragment commonStreamConnection on StreamConnection {
  pagingInfo {
    next {
      limit
      to
      __typename
    }
    __typename
  }
  stream {
    ...StreamItemList_streamItem
    __typename
  }
  __typename
}
fragment StreamItemList_streamItem on StreamItem {
  ...StreamItem_streamItem
  __typename
}
fragment StreamItem_streamItem on StreamItem {
  itemType {
    __typename
    ... on StreamItemPostPreview {
        post {
            title
            __typename
        }
      __typename
    }
  }
  __typename
}
`;

const pageLimit = 25;

// Exports
export {
    MediumClient,
    MediumError,
    PostPublishStatus,
    PostLicense,
    PostContentFormat,
};
