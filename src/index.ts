// export * from './lib/number';
import * as Figma from './figmaTypes';
export * from './figmaTypes';
import axios, { AxiosInstance, AxiosPromise } from 'axios';

export interface FileParams {
  /**
   * A list of nodes that you care about in the document.
   * If specified, only a subset of the document will be returned corresponding to the nodes listed, their children, and everything between the root node and the listed nodes
   */
  readonly ids?: ReadonlyArray<string>;

  /**
   * Positive integer representing how deep into the document tree to traverse.
   * For example, setting this to 1 returns only Pages, setting it to 2 returns Pages and all top level objects on each page.
   * Not setting this parameter returns all nodes
   */
  readonly depth?: number;

  /**
   * A specific version ID to get. Omitting this will get the current version of the file
   */
  readonly version?: string;

  /**
   * Set to "paths" to export vector data
   */
  readonly geometry?: string;
}

export interface FileNodesParams {
  /** A list of node IDs to retrieve and convert */
  readonly ids: ReadonlyArray<string>;

  /**
   * A specific version ID to get. Omitting this will get the current version of the file
   */
  readonly version?: string;

  /**
   * Set to "paths" to export vector data
   */
  readonly geometry?: string;
}

export type exportFormatOptions = 'jpg' | 'png' | 'svg' | 'pdf';

export interface FileImageParams {
  /** A list of node IDs to render */
  readonly ids: ReadonlyArray<string>;
  /** A number between 0.01 and 4, the image scaling factor */
  readonly scale?: number;
  /** A string enum for the image output format, can be "jpg", "png", "svg", or "pdf" */
  readonly format?: exportFormatOptions;
  /**
   * Whether to include id attributes for all SVG elements.
   * @default false
   */
  readonly svg_include_id?: boolean;
  /**
   * Whether to simplify inside/outside strokes and use stroke attribute if
   * possible instead of <mask>.
   * @default true
   */
  readonly svg_simplify_stroke?: boolean;
  /**
   * Use the full dimensions of the node regardless of whether or not it is cropped or the space around it is empty.
   * Use this to export text nodes without cropping.
   * @default false
   */
  readonly use_absolute_bounds?: boolean;
  /** A specific version ID to use. Omitting this will use the current version of the file */
  readonly version?: string;
}

export interface PostCommentParams {
  /** The text contents of the comment to post */
  readonly message: string;
  /** The absolute canvas position of where to place the comment */
  readonly client_meta?: Figma.Vector2 | Figma.FrameOffset;
  /** The comment to reply to, if any. This must be a root comment, that is, you cannot reply to a comment that is a reply itself (a reply has a parent_id). */
  readonly comment_id?: string;
}

export interface PaginationParams {
  /**
   * Number of items in a paged list of results.
   * @default 30
   */
  readonly page_size?: number;
  /**
   * A map that indicates the starting/ending point from which objects are returned.
   * The cursor value is an internally tracked integer that doesn't correspond to any Ids
   */
  readonly cursor?: { readonly before?: number; readonly after?: number };
}

export interface ClientOptions {
  /** access token returned from OAuth authentication */
  readonly accessToken?: string;
  /** personal access token obtained from account settings */
  readonly personalAccessToken?: string;
  /** custom API root */
  readonly apiRoot?: string;
}

export interface ClientInterface {
  readonly client: AxiosInstance;
  /**
   * Returns the document refered to by :key as a JSON object.
   * The file key can be parsed from any Figma file url:
   * https://www.figma.com/file/:key/:title.
   * The "document" attribute contains a Node of type DOCUMENT.
   * @param {fileId} String File to export JSON from
   * @see https://www.figma.com/developers/api#get-files-endpoint
   */
  readonly file: (
    fileId: string,
    params?: FileParams
  ) => AxiosPromise<Figma.FileResponse>;

  /**
   * Returns a list of the versions of a file.
   * The file key can be parsed from any Figma node url:
   * https://www.figma.com/file/:key/:title.
   * @param {fileId} String File to get version history from
   * @see https://www.figma.com/developers/api#get-file-versions-endpoint
   */
  readonly fileVersions: (
    fileId: string
  ) => AxiosPromise<Figma.FileVersionsResponse>;

  /**
   * Returns the nodes referenced to by :ids as a JSON object.
   * The nodes are retrieved from the Figma file referenced to by :key.
   * The node Id and file key can be parsed from any Figma node url:
   * https://www.figma.com/file/:key/:title?node-id=:id.
   * @param {fileId} String File to export JSON from
   * @param {params} FileNodesParams
   * @see https://www.figma.com/developers/api#get-file-nodes-endpoint
   */
  readonly fileNodes: (
    fileId: string,
    params: FileNodesParams
  ) => AxiosPromise<Figma.FileNodesResponse>;

  /**
   * If no error occurs, "images" will be populated with a map from
   * node IDs to URLs of the rendered images, and "status" will be omitted.
   * Important: the image map may contain values that are null.
   * This indicates that rendering of that specific node has failed.
   * This may be due to the node id not existing, or other reasons such
   * has the node having no renderable components. It is guaranteed that
   * any node that was requested for rendering will be represented in this
   * map whether or not the render succeeded.
   * @param {fileId} String File to export images from
   * @param {params} FileImageParams
   * @see https://www.figma.com/developers/api#get-images-endpoint
   */
  readonly fileImages: (
    fileId: string,
    params: FileImageParams
  ) => AxiosPromise<Figma.FileImageResponse>;

  /**
   * Returns download links for all images present in image fills in a document.
   * Image fills are how Figma represents any user supplied images.
   * When you drag an image into Figma, we create a rectangle with a single
   * fill that represents the image, and the user is able to transform the
   * rectangle (and properties on the fill) as they wish.
   *
   * This endpoint returns a mapping from image references to the URLs at which
   * the images may be download. Image URLs will expire after no more than 14 days.
   * Image references are located in the output of the GET files endpoint under the
   * imageRef attribute in a Paint.
   * @param {fileId} String File to export images from
   * @see https://www.figma.com/developers/api#get-image-fills-endpoint
   */
  readonly fileImageFills: (
    fileId: string
  ) => AxiosPromise<Figma.FileImageFillsResponse>;

  /**
   * A list of comments left on the file
   * @param {fileId} String File to get comments from
   * @see https://www.figma.com/developers/api#get-comments-endpoint
   */
  readonly comments: (fileId: string) => AxiosPromise<Figma.CommentsResponse>;

  /**
   * Posts a new comment on the file.
   * @param {fileId} String File to post comment to
   * @param {params} PostCommentParams
   * @see https://www.figma.com/developers/api#post-comments-endpoint
   */
  readonly postComment: (
    fileId: string,
    params: PostCommentParams
  ) => AxiosPromise<Figma.Comment>;

  /**
   * Delete a comment from the file
   * @param {fileId} String File to delete comment from
   * @param {commentId} String id of the comment to be deleted
   * @see https://www.figma.com/developers/api#delete-comments-endpoint
   */
  readonly deleteComment: (
    fileId: string,
    commentId: string
  ) => AxiosPromise<Figma.Comment>;

  /**
   * Get user information for the authenticated user.
   * @see https://www.figma.com/developers/api#get-me-endpoint
   */
  readonly me: () => AxiosPromise<Figma.User & { readonly email: string }>;

  /**
   * Lists the projects for a specified team. Note that this will only
   * return projects visible to the authenticated user or owner of the
   * developer token.
   * @param {teamId} String Id of the team to list projects from
   * @see https://www.figma.com/developers/api#get-team-projects-endpoint
   */
  readonly teamProjects: (
    teamId: string
  ) => AxiosPromise<Figma.TeamProjectsResponse>;

  /**
   * List the files in a given project.
   * @param {projectId} String Id of the project to list files from
   * @see https://www.figma.com/developers/api#get-project-files-endpoint
   */
  readonly projectFiles: (
    projectId: string
  ) => AxiosPromise<Figma.ProjectFilesResponse>;

  /**
   * Get a paginated list of published components within a team library
   * @param {teamId} String Id of the team to list components from
   * @see https://www.figma.com/developers/api#get-team-components-endpoint
   */
  readonly teamComponents: (
    teamId: string,
    params?: PaginationParams
  ) => AxiosPromise<Figma.TeamComponentsResponse>;

  /**
   * Get a list of published components within a file
   * @param {fileId} String Id of the file to list components from
   * @see https://www.figma.com/developers/api#get-file-components-endpoint
   */
  readonly fileComponents: (
    fileId: string
  ) => AxiosPromise<Figma.FileComponentsResponse>;

  /**
   * Get metadata on a component by key.
   * @param {key} The unique identifier of the component.
   * @see https://www.figma.com/developers/api#get-component-endpoint
   */

  readonly component: (key: string) => AxiosPromise<Figma.ComponentResponse>;

  /**
   * Get a paginated list of published component sets within a team library
   * @param {teamId} String Id of the team to list components from
   * @see https://www.figma.com/developers/api#get-team-component-sets-endpoint
   */
  readonly teamComponentSets: (
    teamId: string,
    params?: PaginationParams
  ) => AxiosPromise<Figma.TeamComponentSetsResponse>;

  /**
   * Get a list of published component sets within a file
   * @param {fileId} String Id of the file to list components from
   * @see https://www.figma.com/developers/api#get-team-component-sets-endpoint
   */
  readonly fileComponentSets: (
    fileId: string
  ) => AxiosPromise<Figma.FileComponentSetsResponse>;

  /**
   * Get metadata on a component set by key.
   * @param {key} The unique identifier of the component.
   * @see https://www.figma.com/developers/api#get-component-sets-endpoint
   */

  readonly componentSet: (key: string) => AxiosPromise<Figma.ComponentSetResponse>;

  /**
   * Get a paginated list of published styles within a team library
   * @param {teamId} String Id of the team to list styles from
   * @see https://www.figma.com/developers/api#get-team-styles-endpoint
   */
  readonly teamStyles: (
    teamId: string,
    params?: PaginationParams
  ) => AxiosPromise<Figma.TeamStylesResponse>;

  /**
   * Get a list of published styles within a file
   * @param {fileId} String Id of the file to list styles from
   * @see https://www.figma.com/developers/api#get-file-styles-endpoint
   */
  readonly fileStyles: (
    fileId: string
  ) => AxiosPromise<Figma.FileStylesResponse>;

  /**
   * Get metadata on a style by key.
   * @param {key} The unique identifier of the style.
   * @see https://www.figma.com/developers/api#get-style-endpoint
   */
  readonly style: (key: string) => AxiosPromise<Figma.StyleResponse>;
}

export const Client = (opts: ClientOptions): ClientInterface => {
  const headers = opts.accessToken
    ? {
        Authorization: `Bearer ${opts.accessToken}`,
      }
    : {
        'X-Figma-Token': opts.personalAccessToken,
      };

  const client = axios.create({
    baseURL: `https://${opts.apiRoot || 'api.figma.com'}/v1/`,
    headers,
  });

  return {
    client,

    file: (fileId, params = {}) =>
      client.get(`files/${fileId}`, {
        params: {
          ...params,
          ids: params.ids ? params.ids.join(',') : '',
        },
      }),

    fileVersions: (fileId) => client.get(`files/${fileId}/versions`),

    fileNodes: (fileId, params) =>
      client.get(`files/${fileId}/nodes`, {
        params: {
          ...params,
          ids: params.ids.join(','),
        },
      }),

    fileImages: (fileId, params) =>
      client.get(`images/${fileId}`, {
        params: {
          ...params,
          ids: params.ids.join(','),
        },
      }),

    fileImageFills: (fileId) => client.get(`files/${fileId}/images`),

    comments: (fileId) => client.get(`files/${fileId}/comments`),

    postComment: (fileId, params) =>
      client.post(`files/${fileId}/comments`, params),

    deleteComment: (fileId, commentId) =>
      client.delete(`files/${fileId}/comments/${commentId}`),

    me: () => client.get(`me`),

    teamProjects: (teamId) => client.get(`teams/${teamId}/projects`),

    projectFiles: (projectId) => client.get(`projects/${projectId}/files`),

    teamComponents: (teamId, params = {}) =>
      client.get(`teams/${teamId}/components`, { params }),

    fileComponents: (fileId) => client.get(`files/${fileId}/components`),

    component: (key) => client.get(`components/${key}`),

    teamComponentSets: (teamId, params = {}) =>
      client.get(`teams/${teamId}/component_sets`, { params }),

    fileComponentSets: (fileId) => client.get(`files/${fileId}/component_sets`),

    componentSet: (key) => client.get(`component_set/${key}`),

    teamStyles: (teamId, params = {}) =>
      client.get(`teams/${teamId}/styles`, { params }),

    fileStyles: (fileId) => client.get(`files/${fileId}/styles`),

    style: (key) => client.get(`styles/${key}`),
  };
};
