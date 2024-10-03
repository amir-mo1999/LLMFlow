import { errorToJSON } from "next/dist/server/render"
import { ApiContext } from "./apiContext"
import { getSession } from "next-auth/react"
import { Session } from "next-auth"

let SESSION: Session | null = null

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_CLIENT || "" // TODO: add your baseUrl

export type ErrorWrapper<TError> = TError | { status: "unknown"; payload: string }

export type ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string
  method: string
  body?: TBody
  headers?: THeaders
  queryParams?: TQueryParams
  pathParams?: TPathParams
  signal?: AbortSignal
} & ApiContext["fetcherOptions"]

export async function apiFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {},
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal,
}: ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> {
  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    /**
     * As the fetch API is being used, when multipart/form-data is specified
     * the Content-Type header must be deleted so that the browser can set
     * the correct boundary.
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
     */
    if (requestHeaders["Content-Type"].toLowerCase().includes("multipart/form-data")) {
      delete requestHeaders["Content-Type"]
    }

    // add the authorization header by default
    if (!SESSION) {
      console.log("getting session")
      SESSION = await getSession()
    }

    requestHeaders["Authorization"] = `Bearer ${SESSION?.user.access_token}`

    const response = await window.fetch(`${baseUrl}${resolveUrl(url, queryParams, pathParams)}`, {
      signal,
      method: method.toUpperCase(),
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      headers: requestHeaders,
    })
    if (!response.ok) {
      let error: ErrorWrapper<TError>
      try {
        const payload = await response.json()
        const status = await response.status

        //@ts-ignore
        error = { status: status, payload: payload }
      } catch (e) {
        error = {
          status: "unknown" as const,
          payload: e instanceof Error ? `Unexpected error (${e.message})` : "Unexpected error",
        }
      }

      throw error
    }
    if (response.headers.get("content-type")?.includes("json")) {
      return await response.json()
    } else {
      // if it is not a json response, assume it is a blob and cast it to TData

      return (await response.blob()) as unknown as TData
    }
  } catch (e) {
    let error: ErrorWrapper<TError>
    if (typeof e === "object") {
      //@ts-ignore
      error = e
      throw error
    } else {
      let errorObject: Error = {
        name: "unknown" as const,
        message: e instanceof Error ? `Network error (${e.message})` : "Network error",
        stack: e as string,
      }
      throw errorObject
    }
  }
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = new URLSearchParams(queryParams).toString()
  if (query) query = `?${query}`
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query
}
