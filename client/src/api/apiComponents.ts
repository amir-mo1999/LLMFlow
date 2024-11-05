/**
 * Generated by @openapi-codegen
 *
 * @version 0.1.0
 */
import * as reactQuery from "@tanstack/react-query"
import { useApiContext, ApiContext } from "./apiContext"
import type * as Fetcher from "./apiFetcher"
import { apiFetch } from "./apiFetcher"
import type * as Schemas from "./apiSchemas"

export type LoginError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type LoginVariables = ApiContext["fetcherOptions"]

export const fetchLogin = (variables: LoginVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.UserWithAccessToken, LoginError, undefined, {}, {}, {}>({
    url: "/auth/login",
    method: "post",
    ...variables,
    signal,
  })

export const useLogin = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.UserWithAccessToken, LoginError, LoginVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.UserWithAccessToken, LoginError, LoginVariables>({
    mutationFn: (variables: LoginVariables) => fetchLogin({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type EvaluatePathParams = {
  promptId: string
}

export type EvaluateError = Fetcher.ErrorWrapper<
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type EvaluateVariables = {
  pathParams: EvaluatePathParams
} & ApiContext["fetcherOptions"]

export const fetchEvaluate = (variables: EvaluateVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.EvaluateSummary, EvaluateError, undefined, {}, {}, EvaluatePathParams>({
    url: "/evaluate/{promptId}",
    method: "post",
    ...variables,
    signal,
  })

export const useEvaluate = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.EvaluateSummary, EvaluateError, EvaluateVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.EvaluateSummary, EvaluateError, EvaluateVariables>({
    mutationFn: (variables: EvaluateVariables) =>
      fetchEvaluate({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type PostUserError = Fetcher.ErrorWrapper<
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PostUserVariables = {
  body: Schemas.UserRootInput
} & ApiContext["fetcherOptions"]

export const fetchPostUser = (variables: PostUserVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.SuccessResponse, PostUserError, Schemas.UserRootInput, {}, {}, {}>({
    url: "/user",
    method: "post",
    ...variables,
    signal,
  })

export const usePostUser = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.SuccessResponse, PostUserError, PostUserVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.SuccessResponse, PostUserError, PostUserVariables>({
    mutationFn: (variables: PostUserVariables) =>
      fetchPostUser({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetUserPathParams = {
  /**
   * Email of the user to retrieve
   */
  username: string
}

export type GetUserError = Fetcher.ErrorWrapper<
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetUserVariables = {
  pathParams: GetUserPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetUser = (variables: GetUserVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.User, GetUserError, undefined, {}, {}, GetUserPathParams>({
    url: "/user/{username}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetUser = <TData = Schemas.User>(
  variables: GetUserVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.User, GetUserError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.User, GetUserError, TData>({
    queryKey: queryKeyFn({
      path: "/user/{username}",
      operationId: "getUser",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetUser({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type GetAiFunctionsError = Fetcher.ErrorWrapper<{
  status: 401
  payload: Schemas.HttpExceptionModel
}>

export type GetAiFunctionsResponse = Schemas.AIFunction[]

export type GetAiFunctionsVariables = ApiContext["fetcherOptions"]

export const fetchGetAiFunctions = (variables: GetAiFunctionsVariables, signal?: AbortSignal) =>
  apiFetch<GetAiFunctionsResponse, GetAiFunctionsError, undefined, {}, {}, {}>({
    url: "/ai-function",
    method: "get",
    ...variables,
    signal,
  })

export const useGetAiFunctions = <TData = GetAiFunctionsResponse>(
  variables: GetAiFunctionsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<GetAiFunctionsResponse, GetAiFunctionsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<GetAiFunctionsResponse, GetAiFunctionsError, TData>({
    queryKey: queryKeyFn({
      path: "/ai-function",
      operationId: "getAiFunctions",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetAiFunctions({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type PostAiFunctionError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PostAiFunctionVariables = {
  body: Schemas.AIFunctionRouteInput
} & ApiContext["fetcherOptions"]

export const fetchPostAiFunction = (variables: PostAiFunctionVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.AIFunction, PostAiFunctionError, Schemas.AIFunctionRouteInput, {}, {}, {}>({
    url: "/ai-function",
    method: "post",
    ...variables,
    signal,
  })

export const usePostAiFunction = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.AIFunction, PostAiFunctionError, PostAiFunctionVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.AIFunction, PostAiFunctionError, PostAiFunctionVariables>({
    mutationFn: (variables: PostAiFunctionVariables) =>
      fetchPostAiFunction({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetAiFunctionPathParams = {
  aiFunctionId: string
}

export type GetAiFunctionError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetAiFunctionVariables = {
  pathParams: GetAiFunctionPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetAiFunction = (variables: GetAiFunctionVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.AIFunction, GetAiFunctionError, undefined, {}, {}, GetAiFunctionPathParams>({
    url: "/ai-function/{aiFunctionId}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetAiFunction = <TData = Schemas.AIFunction>(
  variables: GetAiFunctionVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.AIFunction, GetAiFunctionError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.AIFunction, GetAiFunctionError, TData>({
    queryKey: queryKeyFn({
      path: "/ai-function/{aiFunctionId}",
      operationId: "getAiFunction",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetAiFunction({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type DeleteAiFunctionPathParams = {
  aiFunctionId: string
}

export type DeleteAiFunctionError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type DeleteAiFunctionVariables = {
  pathParams: DeleteAiFunctionPathParams
} & ApiContext["fetcherOptions"]

export const fetchDeleteAiFunction = (variables: DeleteAiFunctionVariables, signal?: AbortSignal) =>
  apiFetch<
    Schemas.SuccessResponse,
    DeleteAiFunctionError,
    undefined,
    {},
    {},
    DeleteAiFunctionPathParams
  >({
    url: "/ai-function/{aiFunctionId}",
    method: "delete",
    ...variables,
    signal,
  })

export const useDeleteAiFunction = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.SuccessResponse,
      DeleteAiFunctionError,
      DeleteAiFunctionVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<
    Schemas.SuccessResponse,
    DeleteAiFunctionError,
    DeleteAiFunctionVariables
  >({
    mutationFn: (variables: DeleteAiFunctionVariables) =>
      fetchDeleteAiFunction({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type PatchAiFunctionPathParams = {
  aiFunctionId: string
}

export type PatchAiFunctionError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PatchAiFunctionVariables = {
  body?: Schemas.AIFunctionPatchInput
  pathParams: PatchAiFunctionPathParams
} & ApiContext["fetcherOptions"]

export const fetchPatchAiFunction = (variables: PatchAiFunctionVariables, signal?: AbortSignal) =>
  apiFetch<
    Schemas.AIFunction,
    PatchAiFunctionError,
    Schemas.AIFunctionPatchInput,
    {},
    {},
    PatchAiFunctionPathParams
  >({
    url: "/ai-function/{aiFunctionId}",
    method: "patch",
    ...variables,
    signal,
  })

export const usePatchAiFunction = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.AIFunction,
      PatchAiFunctionError,
      PatchAiFunctionVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.AIFunction, PatchAiFunctionError, PatchAiFunctionVariables>(
    {
      mutationFn: (variables: PatchAiFunctionVariables) =>
        fetchPatchAiFunction({ ...fetcherOptions, ...variables }),
      ...options,
    }
  )
}

export type PostPromptError = Fetcher.ErrorWrapper<
  | {
      status: 400
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PostPromptVariables = {
  body: Schemas.PromptRouteInput
} & ApiContext["fetcherOptions"]

export const fetchPostPrompt = (variables: PostPromptVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.AppModelsPromptPrompt, PostPromptError, Schemas.PromptRouteInput, {}, {}, {}>({
    url: "/prompt",
    method: "post",
    ...variables,
    signal,
  })

export const usePostPrompt = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.AppModelsPromptPrompt,
      PostPromptError,
      PostPromptVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<
    Schemas.AppModelsPromptPrompt,
    PostPromptError,
    PostPromptVariables
  >({
    mutationFn: (variables: PostPromptVariables) =>
      fetchPostPrompt({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetPromptPathParams = {
  promptId: string
}

export type GetPromptError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetPromptVariables = {
  pathParams: GetPromptPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetPrompt = (variables: GetPromptVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.AppModelsPromptPrompt, GetPromptError, undefined, {}, {}, GetPromptPathParams>({
    url: "/prompt/{promptId}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetPrompt = <TData = Schemas.AppModelsPromptPrompt>(
  variables: GetPromptVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.AppModelsPromptPrompt, GetPromptError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.AppModelsPromptPrompt, GetPromptError, TData>({
    queryKey: queryKeyFn({
      path: "/prompt/{promptId}",
      operationId: "getPrompt",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetPrompt({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type DeletePromptPathParams = {
  promptId: string
}

export type DeletePromptError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type DeletePromptVariables = {
  pathParams: DeletePromptPathParams
} & ApiContext["fetcherOptions"]

export const fetchDeletePrompt = (variables: DeletePromptVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.SuccessResponse, DeletePromptError, undefined, {}, {}, DeletePromptPathParams>({
    url: "/prompt/{promptId}",
    method: "delete",
    ...variables,
    signal,
  })

export const useDeletePrompt = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.SuccessResponse,
      DeletePromptError,
      DeletePromptVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.SuccessResponse, DeletePromptError, DeletePromptVariables>({
    mutationFn: (variables: DeletePromptVariables) =>
      fetchDeletePrompt({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type PatchPromptPathParams = {
  promptId: string
}

export type PatchPromptError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PatchPromptRequestBody = Schemas.PromptMessage[]

export type PatchPromptVariables = {
  body?: PatchPromptRequestBody
  pathParams: PatchPromptPathParams
} & ApiContext["fetcherOptions"]

export const fetchPatchPrompt = (variables: PatchPromptVariables, signal?: AbortSignal) =>
  apiFetch<
    Schemas.AppModelsPromptPrompt,
    PatchPromptError,
    PatchPromptRequestBody,
    {},
    {},
    PatchPromptPathParams
  >({ url: "/prompt/{promptId}", method: "patch", ...variables, signal })

export const usePatchPrompt = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.AppModelsPromptPrompt,
      PatchPromptError,
      PatchPromptVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<
    Schemas.AppModelsPromptPrompt,
    PatchPromptError,
    PatchPromptVariables
  >({
    mutationFn: (variables: PatchPromptVariables) =>
      fetchPatchPrompt({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetPromptsPathParams = {
  aiFunctionId: string
}

export type GetPromptsError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetPromptsResponse = Schemas.AppModelsPromptPrompt[]

export type GetPromptsVariables = {
  pathParams: GetPromptsPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetPrompts = (variables: GetPromptsVariables, signal?: AbortSignal) =>
  apiFetch<GetPromptsResponse, GetPromptsError, undefined, {}, {}, GetPromptsPathParams>({
    url: "/prompts/{aiFunctionId}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetPrompts = <TData = GetPromptsResponse>(
  variables: GetPromptsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<GetPromptsResponse, GetPromptsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<GetPromptsResponse, GetPromptsError, TData>({
    queryKey: queryKeyFn({
      path: "/prompts/{aiFunctionId}",
      operationId: "getPrompts",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetPrompts({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type GetAllPromptsError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
>

export type GetAllPromptsResponse = Schemas.AppModelsPromptPrompt[]

export type GetAllPromptsVariables = ApiContext["fetcherOptions"]

export const fetchGetAllPrompts = (variables: GetAllPromptsVariables, signal?: AbortSignal) =>
  apiFetch<GetAllPromptsResponse, GetAllPromptsError, undefined, {}, {}, {}>({
    url: "/prompts",
    method: "get",
    ...variables,
    signal,
  })

export const useGetAllPrompts = <TData = GetAllPromptsResponse>(
  variables: GetAllPromptsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<GetAllPromptsResponse, GetAllPromptsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<GetAllPromptsResponse, GetAllPromptsError, TData>({
    queryKey: queryKeyFn({
      path: "/prompts",
      operationId: "getAllPrompts",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetAllPrompts({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type GetProjectsError = Fetcher.ErrorWrapper<{
  status: 401
  payload: Schemas.HttpExceptionModel
}>

export type GetProjectsResponse = Schemas.Project[]

export type GetProjectsVariables = ApiContext["fetcherOptions"]

export const fetchGetProjects = (variables: GetProjectsVariables, signal?: AbortSignal) =>
  apiFetch<GetProjectsResponse, GetProjectsError, undefined, {}, {}, {}>({
    url: "/project",
    method: "get",
    ...variables,
    signal,
  })

export const useGetProjects = <TData = GetProjectsResponse>(
  variables: GetProjectsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<GetProjectsResponse, GetProjectsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<GetProjectsResponse, GetProjectsError, TData>({
    queryKey: queryKeyFn({
      path: "/project",
      operationId: "getProjects",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetProjects({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type PostProjectError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PostProjectVariables = {
  body: Schemas.ProjectRouteInput
} & ApiContext["fetcherOptions"]

export const fetchPostProject = (variables: PostProjectVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.Project, PostProjectError, Schemas.ProjectRouteInput, {}, {}, {}>({
    url: "/project",
    method: "post",
    ...variables,
    signal,
  })

export const usePostProject = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.Project, PostProjectError, PostProjectVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.Project, PostProjectError, PostProjectVariables>({
    mutationFn: (variables: PostProjectVariables) =>
      fetchPostProject({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetProjectPathParams = {
  projectId: string
}

export type GetProjectError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetProjectVariables = {
  pathParams: GetProjectPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetProject = (variables: GetProjectVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.Project, GetProjectError, undefined, {}, {}, GetProjectPathParams>({
    url: "/project/{projectId}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetProject = <TData = Schemas.Project>(
  variables: GetProjectVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.Project, GetProjectError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.Project, GetProjectError, TData>({
    queryKey: queryKeyFn({
      path: "/project/{projectId}",
      operationId: "getProject",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetProject({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type DeleteProjectPathParams = {
  projectId: string
}

export type DeleteProjectError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type DeleteProjectVariables = {
  pathParams: DeleteProjectPathParams
} & ApiContext["fetcherOptions"]

export const fetchDeleteProject = (variables: DeleteProjectVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.SuccessResponse, DeleteProjectError, undefined, {}, {}, DeleteProjectPathParams>(
    { url: "/project/{projectId}", method: "delete", ...variables, signal }
  )

export const useDeleteProject = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.SuccessResponse,
      DeleteProjectError,
      DeleteProjectVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<
    Schemas.SuccessResponse,
    DeleteProjectError,
    DeleteProjectVariables
  >({
    mutationFn: (variables: DeleteProjectVariables) =>
      fetchDeleteProject({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type PatchProjectPathParams = {
  projectId: string
}

export type PatchProjectError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type PatchProjectVariables = {
  body?: Schemas.ProjectPatchInput
  pathParams: PatchProjectPathParams
} & ApiContext["fetcherOptions"]

export const fetchPatchProject = (variables: PatchProjectVariables, signal?: AbortSignal) =>
  apiFetch<
    Schemas.Project,
    PatchProjectError,
    Schemas.ProjectPatchInput,
    {},
    {},
    PatchProjectPathParams
  >({ url: "/project/{projectId}", method: "patch", ...variables, signal })

export const usePatchProject = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.Project, PatchProjectError, PatchProjectVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.Project, PatchProjectError, PatchProjectVariables>({
    mutationFn: (variables: PatchProjectVariables) =>
      fetchPatchProject({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type GetProjectApiDocsPathParams = {
  projectId: string
}

export type GetProjectApiDocsError = Fetcher.ErrorWrapper<
  | {
      status: 401
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 404
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HTTPValidationError
    }
>

export type GetProjectApiDocsVariables = {
  pathParams: GetProjectApiDocsPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetProjectApiDocs = (
  variables: GetProjectApiDocsVariables,
  signal?: AbortSignal
) =>
  apiFetch<Schemas.OpenAPI, GetProjectApiDocsError, undefined, {}, {}, GetProjectApiDocsPathParams>(
    {
      url: "/project-api-docs/{projectId}",
      method: "get",
      ...variables,
      signal,
    }
  )

export const useGetProjectApiDocs = <TData = Schemas.OpenAPI>(
  variables: GetProjectApiDocsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.OpenAPI, GetProjectApiDocsError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.OpenAPI, GetProjectApiDocsError, TData>({
    queryKey: queryKeyFn({
      path: "/project-api-docs/{projectId}",
      operationId: "getProjectApiDocs",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetProjectApiDocs({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type ExecutePathParams = {
  projectPathName: string
  aiFunctionPathName: string
}

export type ExecuteQueryParams = {
  /**
   * Specify by which criteria to select the prompt.
   *
   * @default highest score
   */
  prompt_tag?: ("highest score" | "cheapest" | "fastest") | null
  /**
   * If specified the prompt with the given id is used. This takes precedence over 'prompt_tag'.
   */
  prompt_id?: string | null
}

export type ExecuteError = Fetcher.ErrorWrapper<
  | {
      status: 400
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 409
      payload: Schemas.HttpExceptionModel
    }
  | {
      status: 422
      payload: Schemas.HttpExceptionModel
    }
>

export type ExecuteVariables = {
  body?: Schemas.Body
  pathParams: ExecutePathParams
  queryParams?: ExecuteQueryParams
} & ApiContext["fetcherOptions"]

export const fetchExecute = (variables: ExecuteVariables, signal?: AbortSignal) =>
  apiFetch<
    Schemas.AIFunctionOutput,
    ExecuteError,
    Schemas.Body,
    {},
    ExecuteQueryParams,
    ExecutePathParams
  >({
    url: "/execute/{projectPathName}/{aiFunctionPathName}",
    method: "post",
    ...variables,
    signal,
  })

export const useExecute = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.AIFunctionOutput, ExecuteError, ExecuteVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.AIFunctionOutput, ExecuteError, ExecuteVariables>({
    mutationFn: (variables: ExecuteVariables) => fetchExecute({ ...fetcherOptions, ...variables }),
    ...options,
  })
}

export type QueryOperation =
  | {
      path: "/user/{username}"
      operationId: "getUser"
      variables: GetUserVariables
    }
  | {
      path: "/ai-function"
      operationId: "getAiFunctions"
      variables: GetAiFunctionsVariables
    }
  | {
      path: "/ai-function/{aiFunctionId}"
      operationId: "getAiFunction"
      variables: GetAiFunctionVariables
    }
  | {
      path: "/prompt/{promptId}"
      operationId: "getPrompt"
      variables: GetPromptVariables
    }
  | {
      path: "/prompts/{aiFunctionId}"
      operationId: "getPrompts"
      variables: GetPromptsVariables
    }
  | {
      path: "/prompts"
      operationId: "getAllPrompts"
      variables: GetAllPromptsVariables
    }
  | {
      path: "/project"
      operationId: "getProjects"
      variables: GetProjectsVariables
    }
  | {
      path: "/project/{projectId}"
      operationId: "getProject"
      variables: GetProjectVariables
    }
  | {
      path: "/project-api-docs/{projectId}"
      operationId: "getProjectApiDocs"
      variables: GetProjectApiDocsVariables
    }
