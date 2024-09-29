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

/**
 * Endpoint for the login procedure. Takes username and password as form-data input.
 * If credentials match a user in the database return user data and access token else return 401.
 */
export const fetchLogin = (variables: LoginVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.UserWithAccessToken, LoginError, undefined, {}, {}, {}>({
    url: "/auth/login",
    method: "post",
    ...variables,
    signal,
  })

/**
 * Endpoint for the login procedure. Takes username and password as form-data input.
 * If credentials match a user in the database return user data and access token else return 401.
 */
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

export type RefreshTokenError = Fetcher.ErrorWrapper<{
  status: 401
  payload: Schemas.HttpExceptionModel
}>

export type RefreshTokenVariables = ApiContext["fetcherOptions"]

export const fetchRefreshToken = (variables: RefreshTokenVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.UserWithAccessToken, RefreshTokenError, undefined, {}, {}, {}>({
    url: "/auth/refresh-token",
    method: "get",
    ...variables,
    signal,
  })

export const useRefreshToken = <TData = Schemas.UserWithAccessToken>(
  variables: RefreshTokenVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.UserWithAccessToken, RefreshTokenError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.UserWithAccessToken, RefreshTokenError, TData>({
    queryKey: queryKeyFn({
      path: "/auth/refresh-token",
      operationId: "refreshToken",
      variables,
    }),
    queryFn: ({ signal }) => fetchRefreshToken({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
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
  body: Schemas.UserRouteInput
} & ApiContext["fetcherOptions"]

export const fetchPostUser = (variables: PostUserVariables, signal?: AbortSignal) =>
  apiFetch<Schemas.SuccessResponse, PostUserError, Schemas.UserRouteInput, {}, {}, {}>({
    url: "/db/user",
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
    url: "/db/user/{username}",
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
      path: "/db/user/{username}",
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
    url: "/db/ai-function",
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
      path: "/db/ai-function",
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
  apiFetch<Schemas.SuccessResponse, PostAiFunctionError, Schemas.AIFunctionRouteInput, {}, {}, {}>({
    url: "/db/ai-function",
    method: "post",
    ...variables,
    signal,
  })

export const usePostAiFunction = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.SuccessResponse,
      PostAiFunctionError,
      PostAiFunctionVariables
    >,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<
    Schemas.SuccessResponse,
    PostAiFunctionError,
    PostAiFunctionVariables
  >({
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
    url: "/db/ai-function/{aiFunctionId}",
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
      path: "/db/ai-function/{aiFunctionId}",
      operationId: "getAiFunction",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetAiFunction({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
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
  apiFetch<Schemas.SuccessResponse, PostPromptError, Schemas.PromptRouteInput, {}, {}, {}>({
    url: "/db/prompt",
    method: "post",
    ...variables,
    signal,
  })

export const usePostPrompt = (
  options?: Omit<
    reactQuery.UseMutationOptions<Schemas.SuccessResponse, PostPromptError, PostPromptVariables>,
    "mutationFn"
  >
) => {
  const { fetcherOptions } = useApiContext()
  return reactQuery.useMutation<Schemas.SuccessResponse, PostPromptError, PostPromptVariables>({
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
  apiFetch<Schemas.Prompt, GetPromptError, undefined, {}, {}, GetPromptPathParams>({
    url: "/db/prompt/{promptId}",
    method: "get",
    ...variables,
    signal,
  })

export const useGetPrompt = <TData = Schemas.Prompt>(
  variables: GetPromptVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.Prompt, GetPromptError, TData>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useApiContext(options)
  return reactQuery.useQuery<Schemas.Prompt, GetPromptError, TData>({
    queryKey: queryKeyFn({
      path: "/db/prompt/{promptId}",
      operationId: "getPrompt",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetPrompt({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
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

export type GetPromptsResponse = Schemas.Prompt[]

export type GetPromptsVariables = {
  pathParams: GetPromptsPathParams
} & ApiContext["fetcherOptions"]

export const fetchGetPrompts = (variables: GetPromptsVariables, signal?: AbortSignal) =>
  apiFetch<GetPromptsResponse, GetPromptsError, undefined, {}, {}, GetPromptsPathParams>({
    url: "/db/prompts/{aiFunctionId}",
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
      path: "/db/prompts/{aiFunctionId}",
      operationId: "getPrompts",
      variables,
    }),
    queryFn: ({ signal }) => fetchGetPrompts({ ...fetcherOptions, ...variables }, signal),
    ...options,
    ...queryOptions,
  })
}

export type QueryOperation =
  | {
      path: "/auth/refresh-token"
      operationId: "refreshToken"
      variables: RefreshTokenVariables
    }
  | {
      path: "/db/user/{username}"
      operationId: "getUser"
      variables: GetUserVariables
    }
  | {
      path: "/db/ai-function"
      operationId: "getAiFunctions"
      variables: GetAiFunctionsVariables
    }
  | {
      path: "/db/ai-function/{aiFunctionId}"
      operationId: "getAiFunction"
      variables: GetAiFunctionVariables
    }
  | {
      path: "/db/prompt/{promptId}"
      operationId: "getPrompt"
      variables: GetPromptVariables
    }
  | {
      path: "/db/prompts/{aiFunctionId}"
      operationId: "getPrompts"
      variables: GetPromptsVariables
    }
