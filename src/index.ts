// export * from './lib/number';
import * as Figma from './figmaTypes';
export * from './figmaTypes';
import axios, { AxiosPromise } from 'axios';

export interface FileImageParams {
  /** A list of node IDs to render */
  readonly ids?: ReadonlyArray<string>;
  /** A number between 0.01 and 4, the image scaling factor */
  readonly scale?: number;
  /** A string enum for the image output format, can be "jpg", "png", or "svg" */
  readonly format?: 'jpg' | 'png' | 'svg';
}

export interface PostCommentParams {
  /** The text contents of the comment to post */
  readonly message: string;
  /** The absolute canvas position of where to place the comment */
  readonly client_meta: Figma.Vector;
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
  /**
   * Returns the document refered to by :key as a JSON object.
   * The file key can be parsed from any Figma file url:
   * https://www.figma.com/file/:key/:title.
   * The "document" attribute contains a Node of type DOCUMENT.
   * @param {fileId} String File to export JSON from
   */
  readonly file: (fileId: string) => AxiosPromise<Figma.FileResponse>;

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
   */
  readonly fileImages: (
    fileId: string,
    params: FileImageParams
  ) => AxiosPromise<Figma.FileImageResponse>;

  /**
   * A list of comments left on the file
   * @param {fileId} String File to get comments from
   */
  readonly comments: (fileId: string) => AxiosPromise<Figma.CommentsResponse>;

  /**
   * Posts a new comment on the file.
   * @param {fileId} String File to get comments from
   * @param {params} PostCommentParams
   */
  readonly postComment: (
    fileId: string,
    params: PostCommentParams
  ) => AxiosPromise<Figma.Comment>;

  /**
   * Lists the projects for a specified team. Note that this will only
   * return projects visible to the authenticated user or owner of the
   * developer token.
   * @param {teamId} String Id of the team to list projects from
   */
  readonly teamProjects: (
    teamId: string
  ) => AxiosPromise<Figma.TeamProjectsResponse>;

  /**
   * List the files in a given project.
   * @param {projectId} String Id of the project to list files from
   */
  readonly projectFiles: (
    projectId: string
  ) => AxiosPromise<Figma.ProjectFilesResponse>;
}

export const Client = (opts: ClientOptions): ClientInterface => {
  const headers = opts.accessToken
    ? {
        Authorization: `Bearer: ${opts.accessToken}`
      }
    : {
        'X-Figma-Token': opts.personalAccessToken
      };

  const client = axios.create({
    baseURL: `https://${opts.apiRoot || 'api.figma.com'}/v1/`,
    headers
  });

  return {
    file: fileId => client.get(`files/${fileId}`),

    fileImages: (fileId, params) =>
      client.get(`images/${fileId}`, {
        params: {
          ...params,
          ids: params.ids.join(',')
        }
      }),

    comments: fileId => client.get(`files/${fileId}/comments`),

    postComment: (fileId, params) =>
      client.post(`files/${fileId}/comments`, params),

    teamProjects: teamId => client.get(`teams/${teamId}/projects`),

    projectFiles: projectId => client.get(`projects/${projectId}/files`)
  };
};
