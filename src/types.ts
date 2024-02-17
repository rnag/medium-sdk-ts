type CreatePostRequest = {
    title: string;
    content: string;
    contentFormat?: PostContentFormat;
    publishedAt?: string;
    publishStatus?: PostPublishStatus;
    canonicalUrl?: string;
    tags?: string[];
    userId?: string;
    license?: PostLicense;
};

type PublishedPost = {
    id: string;
    title: string;
    link: string;
    pubDate: number;
    categories: string[];
};

type Post = {
    id: string;
    title: string;
    authorId: string;
    url: string;
    canonicalUrl: string;
    publishStatus: PostPublishStatus;
    publishedAt: number;
    license: string;
    licenseUrl: string;
    tags: string[];
};

/**
 * The publish status when creating a post.
 * @enum {string}
 */
enum PostPublishStatus {
    DRAFT = 'draft',
    UNLISTED = 'unlisted',
    PUBLIC = 'public',
}

/**
 * The content format to use when creating a post.
 * @enum {string}
 */
enum PostContentFormat {
    HTML = 'html',
    MARKDOWN = 'markdown',
}

/**
 * The license to use when creating a post.
 * @enum {string}
 */
enum PostLicense {
    ALL_RIGHTS_RESERVED = 'all-rights-reserved',
    CC_40_BY = 'cc-40-by',
    CC_40_BY_ND = 'cc-40-by-nd',
    CC_40_BY_SA = 'cc-40-by-sa',
    CC_40_BY_NC = 'cc-40-by-nc',
    CC_40_BY_NC_ND = 'cc-40-by-nc-nd',
    CC_40_BY_NC_SA = 'cc-40-by-nc-sa',
    CC_40_ZERO = 'cc-40-zero',
    PUBLIC_DOMAIN = 'public-domain',
}

type User = {
    id: string;
    username: string;
    name: string;
    url: string;
    imageUrl: string;
};

export {
    CreatePostRequest,
    Post,
    PostContentFormat,
    PostLicense,
    PostPublishStatus,
    PublishedPost,
    User,
};
