// export * from './lib/number';
import * as Figma from './figmaTypes';
export * from './figmaTypes';
import axios, { AxiosPromise } from 'axios';
type id = string;

export interface FileResponse {
  readonly data: Figma.File;
}

export interface FileImageParams {
  /** A list of node IDs to render */
  readonly ids?: ReadonlyArray<string>;
  /** A number between 0.01 and 4, the image scaling factor */
  readonly scale?: number;
  /** A string enum for the image output format, can be "jpg", "png", or "svg" */
  readonly format?: 'jpg' | 'png' | 'svg';
}
export interface FileImageResponse {
  readonly data: {
    readonly err: string | null;
    readonly images: {
      readonly [key: string]: string;
    };
  };
}

export interface CommentsResponse {
  readonly data: {
    readonly comments: ReadonlyArray<Figma.Comment>;
  };
}

export interface PostCommentParams {
  /** The text contents of the comment to post */
  readonly message: string;
  /** The absolute canvas position of where to place the comment */
  readonly client_meta: Figma.Vector;
}
export interface PostCommentResponse {
  /** The Comment that was successfully posted */
  readonly data: Figma.Comment;
}

export interface TeamProjectsResponse {
  readonly data: {
    readonly projects: ReadonlyArray<Figma.ProjectSummary>;
  };
}

export interface ProjectFilesResponse {
  readonly data: {
    readonly files: ReadonlyArray<Figma.FileSummary>;
  };
}

export const Client = (accessToken: string, apiRoot?: string) => {
  const client = axios.create({
    baseURL: `${apiRoot || 'api.figma.com'}/v1/`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return {
    /**
     * Returns the document refered to by :key as a JSON object.
     * The file key can be parsed from any Figma file url:
     * https://www.figma.com/file/:key/:title.
     * The "document" attribute contains a Node of type DOCUMENT.
     * @param {fileId} String File to export JSON from
     */
    file: (fileId: id): AxiosPromise<FileResponse> =>
      client.get(`files/${fileId}`),

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
    fileImages: (
      fileId: id,
      params: FileImageParams
    ): AxiosPromise<FileImageResponse> =>
      client.get(`images/${fileId}`, {
        params: {
          ...params,
          ids: params.ids.join(',')
        }
      }),

    /**
     * A list of comments left on the file
     * @param {fileId} String File to get comments from
     */
    comments: (fileId: id): AxiosPromise<CommentsResponse> =>
      client.get(`files/${fileId}/comments`),

    /**
     * Posts a new comment on the file.
     * @param {fileId} String File to get comments from
     * @param {params} PostCommentParams
     */
    postComment: (
      fileId: id,
      params: PostCommentParams
    ): AxiosPromise<PostCommentResponse> =>
      client.post(`files/${fileId}/comments`, params),

    /**
     * Lists the projects for a specified team. Note that this will only
     * return projects visible to the authenticated user or owner of the
     * developer token.
     * @param {teamId} String Id of the team to list projects from
     */
    teamProjects: (teamId: id): AxiosPromise<TeamProjectsResponse> =>
      client.get(`teams/${teamId}/projects`),

    /**
     * List the files in a given project.
     * @param {projectId} String Id of the project to list files from
     */
    projectFiles: (projectId: id): AxiosPromise<ProjectFilesResponse> =>
      client.get(`projects/${projectId}/files`)
  };
};
