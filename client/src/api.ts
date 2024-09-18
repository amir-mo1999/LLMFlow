/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AIFunction */
export interface AIFunction {
  /**
   * Name
   * @minLength 1
   * @maxLength 40
   * @example "Summarize Texts"
   */
  name: string;
  /**
   * Description
   * @minLength 1
   * @maxLength 1000
   * @example "Summarizes english texts to a given number of sentences."
   */
  description: string;
  /**
   * Input Variables
   * @example [{"name":"text"},{"name":"number_of_sentences"}]
   */
  input_variables: InputVariable[];
  /**
   * Assert
   * @example [{"type":"icontains","value":"the","weight":1},{"type":"contains","value":"thgewgewgewgewge","weight":1}]
   */
  assert: Assertion[];
  /**
   * Test Cases
   * @example [{"assert":[{"type":"icontains","value":"serendipity","weight":5}],"vars":{"number_of_sentences":"2","text":"The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise."}},{"assert":[{"type":"icontains","value":"minimalism","weight":5}],"vars":{"number_of_sentences":"2","text":"The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy."}}]
   */
  test_cases: TestCaseOutput[];
  /**
   * Number Of Prompts
   * @min 0
   */
  number_of_prompts: number;
  /**
   * Username
   * @format email
   */
  username: string;
  /**
   * Creation Time
   * @format date-time
   */
  creation_time: string;
  /**  Id */
  _id: string;
}

/** AIFunctionRouteInput */
export interface AIFunctionRouteInput {
  /**
   * Name
   * @minLength 1
   * @maxLength 40
   * @example "Summarize Texts"
   */
  name: string;
  /**
   * Description
   * @minLength 1
   * @maxLength 1000
   * @example "Summarizes english texts to a given number of sentences."
   */
  description: string;
  /**
   * Input Variables
   * @example [{"name":"text"},{"name":"number_of_sentences"}]
   */
  input_variables: InputVariable[];
  /**
   * Assert
   * @example [{"type":"icontains","value":"the","weight":1},{"type":"contains","value":"thgewgewgewgewge","weight":1}]
   */
  assert: Assertion[];
  /**
   * Test Cases
   * @example [{"assert":[{"type":"icontains","value":"serendipity","weight":5}],"vars":{"number_of_sentences":"2","text":"The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise."}},{"assert":[{"type":"icontains","value":"minimalism","weight":5}],"vars":{"number_of_sentences":"2","text":"The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy."}}]
   */
  test_cases: TestCaseInput[];
}

/** Assertion */
export interface Assertion {
  type: BaseAssertionTypes;
  /** Value */
  value?: string | string[] | object | null;
  /** Threshold */
  threshold?: number | null;
  /** Weight */
  weight?: number | null;
  /** Metric */
  metric?: string | null;
}

/** BaseAssertionTypes */
export enum BaseAssertionTypes {
  Contains = "contains",
  ContainsAll = "contains-all",
  ContainsAny = "contains-any",
  ContainsJson = "contains-json",
  ContainsSql = "contains-sql",
  ContainsXml = "contains-xml",
  Cost = "cost",
  Equals = "equals",
  Icontains = "icontains",
  IcontainsAll = "icontains-all",
  IsJson = "is-json",
  IsSql = "is-sql",
  IsXml = "is-xml",
  Javascript = "javascript",
  Latency = "latency",
  Levenshtein = "levenshtein",
  PerplexityScore = "perplexity-score",
  Perplexity = "perplexity",
  Python = "python",
  Regex = "regex",
  RougeN = "rouge-n",
  StartsWith = "starts-with",
}

/** Body_login_auth_login_post */
export interface BodyLoginAuthLoginPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /** Client Secret */
  client_secret?: string | null;
}

/** EvaluateResult */
export interface EvaluateResult {
  response?: ProviderResponse | null;
  /** Vars */
  vars?: Record<string, string>;
  /** Latencyms */
  latencyMs: number;
  gradingResult?: GradingResult | null;
  /** Namedscores */
  namedScores: Record<string, number>;
  /** Cost */
  cost?: number | null;
  /** Metadata */
  metadata?: object | null;
}

/** EvaluateStats */
export interface EvaluateStats {
  /** Successes */
  successes: number;
  /** Failures */
  failures: number;
  tokenUsage: TokenUsage;
}

/** EvaluateSummary */
export interface EvaluateSummary {
  /**
   * Timestamp
   * @format date-time
   */
  timestamp: string;
  /** Results */
  results: EvaluateResult[];
  stats: EvaluateStats;
}

/** GradingResult */
export interface GradingResult {
  /** Pass */
  pass: boolean;
  /** Score */
  score: number | null;
  /** Componentresults */
  componentResults?: GradingResult[] | null;
  assertion?: Assertion | null;
  /** Comment */
  comment?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** InputVariable */
export interface InputVariable {
  /**
   * Name
   * @minLength 1
   * @maxLength 40
   */
  name: string;
}

/** Prompt */
export interface Prompt {
  /**
   * Prompt Type
   * @example "single_shot"
   */
  prompt_type: "single_shot" | "chat";
  /**
   * Messages
   * @example [{"content":"Summarize the following text: {{text}} in {{number_of_sentences}} sentences.","role":"user"}]
   */
  messages: PromptMessage[];
  /** Ai Function Id */
  ai_function_id: string;
  /**
   * Username
   * @format email
   */
  username: string;
  /**
   * Creation Time
   * @format date-time
   */
  creation_time: string;
  /**  Id */
  _id: string;
}

/** PromptMessage */
export interface PromptMessage {
  role: RoleEnum;
  /** Content */
  content: string;
}

/** PromptRouteInput */
export interface PromptRouteInput {
  /**
   * Prompt Type
   * @example "single_shot"
   */
  prompt_type: "single_shot" | "chat";
  /**
   * Messages
   * @example [{"content":"Summarize the following text: {{text}} in {{number_of_sentences}} sentences.","role":"user"}]
   */
  messages: PromptMessage[];
  /** Ai Function Id */
  ai_function_id: any;
}

/** ProviderResponse */
export interface ProviderResponse {
  /** Cached */
  cached?: number | null;
  /** Cost */
  cost?: number | null;
  /** Error */
  error?: string | null;
  /** Logprobs */
  logProbs?: number[] | null;
  /** Metadata */
  metadata?: object | null;
  /** Output */
  output?: string | null;
  tokenUsage?: TokenUsage | null;
}

/** RoleEnum */
export enum RoleEnum {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

/** SuccessResponse */
export interface SuccessResponse {
  /**
   * Message
   * @default "Success"
   */
  message?: string;
}

/** TestCase */
export interface TestCaseInput {
  /** Vars */
  vars: Record<string, string>;
  /** Assert */
  assert: Assertion[] | null;
}

/** TestCase */
export interface TestCaseOutput {
  /** Vars */
  vars: Record<string, string>;
  /** Assert */
  assert: Assertion[] | null;
}

/** TokenUsage */
export interface TokenUsage {
  /**
   * Total
   * @default 0
   */
  total?: number | null;
  /**
   * Prompt
   * @default 0
   */
  prompt?: number | null;
  /**
   * Completion
   * @default 0
   */
  completion?: number | null;
  /**
   * Cached
   * @default 0
   */
  cached?: number | null;
}

/** User */
export interface User {
  /**
   * Username
   * @format email
   */
  username: string;
  /**
   * First Name
   * @minLength 1
   */
  first_name: string;
  /**
   * Last Name
   * @minLength 1
   */
  last_name: string;
  /** Role */
  role: "developer" | "prompt_engineer" | "admin";
  /**  Id */
  _id: string;
}

/** UserRouteInput */
export interface UserRouteInput {
  /**
   * Username
   * @format email
   */
  username: string;
  /**
   * First Name
   * @minLength 1
   */
  first_name: string;
  /**
   * Last Name
   * @minLength 1
   */
  last_name: string;
  /** Role */
  role: "developer" | "prompt_engineer" | "admin";
  /** Hashed Password */
  hashed_password: string;
}

/** UserWithAccessToken */
export interface UserWithAccessToken {
  /** Access Token */
  access_token: string;
  /**
   * Username
   * @format email
   */
  username: string;
  /**
   * First Name
   * @minLength 1
   */
  first_name: string;
  /**
   * Last Name
   * @minLength 1
   */
  last_name: string;
  /** Role */
  role: "developer" | "prompt_engineer" | "admin";
  /**  Id */
  _id: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Backend
 * @version 0.1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Endpoint for the login procedure. Takes username and password as form-data input. If credentials match a user in the database return user data and access token else return 401.
     *
     * @tags Authentication
     * @name LoginAuthLoginPost
     * @summary Login
     * @request POST:/auth/login
     */
    loginAuthLoginPost: (data: BodyLoginAuthLoginPost, params: RequestParams = {}) =>
      this.request<UserWithAccessToken, void | HTTPValidationError>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name RefreshTokenAuthRefreshTokenGet
     * @summary Refresh Token
     * @request GET:/auth/refresh-token
     * @secure
     */
    refreshTokenAuthRefreshTokenGet: (params: RequestParams = {}) =>
      this.request<UserWithAccessToken, void>({
        path: `/auth/refresh-token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  evaluate = {
    /**
     * No description
     *
     * @tags Evaluate
     * @name EvaluateEvaluatePromptIdGet
     * @summary Evaluate
     * @request GET:/evaluate/{prompt_id}
     * @secure
     */
    evaluateEvaluatePromptIdGet: (promptId: string, params: RequestParams = {}) =>
      this.request<EvaluateSummary, HTTPValidationError>({
        path: `/evaluate/${promptId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  db = {
    /**
     * No description
     *
     * @tags Database Operations
     * @name PostUserDbUserPost
     * @summary Post User
     * @request POST:/db/user
     */
    postUserDbUserPost: (data: UserRouteInput, params: RequestParams = {}) =>
      this.request<SuccessResponse, HTTPValidationError>({
        path: `/db/user`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name GetUserRouteDbUserUsernameGet
     * @summary Get User Route
     * @request GET:/db/user/{username}
     */
    getUserRouteDbUserUsernameGet: (username: string, params: RequestParams = {}) =>
      this.request<User, void | HTTPValidationError>({
        path: `/db/user/${username}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name GetAiFunctionsDbAiFunctionGet
     * @summary Get Ai Functions
     * @request GET:/db/ai-function
     * @secure
     */
    getAiFunctionsDbAiFunctionGet: (params: RequestParams = {}) =>
      this.request<AIFunction[], void>({
        path: `/db/ai-function`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name PostAiFunctionDbAiFunctionPost
     * @summary Post Ai Function
     * @request POST:/db/ai-function
     * @secure
     */
    postAiFunctionDbAiFunctionPost: (data: AIFunctionRouteInput, params: RequestParams = {}) =>
      this.request<SuccessResponse, void | HTTPValidationError>({
        path: `/db/ai-function`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name GetAiFunctionDbAiFunctionAiFunctionIdGet
     * @summary Get Ai Function
     * @request GET:/db/ai-function/{ai_function_id}
     * @secure
     */
    getAiFunctionDbAiFunctionAiFunctionIdGet: (aiFunctionId: string, params: RequestParams = {}) =>
      this.request<AIFunction, void | HTTPValidationError>({
        path: `/db/ai-function/${aiFunctionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name PostPromptDbPromptPost
     * @summary Post Prompt
     * @request POST:/db/prompt
     * @secure
     */
    postPromptDbPromptPost: (data: PromptRouteInput, params: RequestParams = {}) =>
      this.request<SuccessResponse, void | HTTPValidationError>({
        path: `/db/prompt`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database Operations
     * @name GetPromptRouteDbPromptPromptIdGet
     * @summary Get Prompt Route
     * @request GET:/db/prompt/{prompt_id}
     * @secure
     */
    getPromptRouteDbPromptPromptIdGet: (promptId: string, params: RequestParams = {}) =>
      this.request<Prompt, void | HTTPValidationError>({
        path: `/db/prompt/${promptId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
