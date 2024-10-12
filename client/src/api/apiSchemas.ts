/**
 * Generated by @openapi-codegen
 *
 * @version 0.1.0
 */
export type AIFunction = {
  /**
   * @maxLength 40
   * @minLength 1
   * @example Summarize Texts
   */
  name: string
  /**
   * @maxLength 1000
   * @minLength 1
   * @example Summarizes english texts to a given number_of_sentences.
   */
  description: string
  /**
   * @example {"name":"text"}
   * @example {"name":"number_of_sentences"}
   */
  input_variables: InputVariable[]
  /**
   * @example {"type":"string"}
   */
  output_schema: JsonSchemaOutput
  /**
   * @example {"type":"icontains","value":"the","weight":1}
   * @example {"type":"contains","value":"thgewgewgewgewge","weight":1}
   */
  assert: Assertion[]
  /**
   * @example {"assert":[{"type":"icontains","value":"serendipity","weight":5}],"vars":{"number_of_sentences":"2","text":"The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise."}}
   * @example {"assert":[{"type":"icontains","value":"minimalism","weight":5}],"vars":{"number_of_sentences":"2","text":"The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy."}}
   */
  test_cases: TestCaseOutput[]
  _id?: string | null
  /**
   * @minimum 0
   */
  number_of_prompts: number
  /**
   * @format email
   */
  username: string
  /**
   * @format date-time
   */
  creation_time: string
}

export type AIFunctionRouteInput = {
  /**
   * @maxLength 40
   * @minLength 1
   * @example Summarize Texts
   */
  name: string
  /**
   * @maxLength 1000
   * @minLength 1
   * @example Summarizes english texts to a given number_of_sentences.
   */
  description: string
  /**
   * @example {"name":"text"}
   * @example {"name":"number_of_sentences"}
   */
  input_variables: InputVariable[]
  /**
   * @example {"type":"string"}
   */
  output_schema: JsonSchemaInput
  /**
   * @example {"type":"icontains","value":"the","weight":1}
   * @example {"type":"contains","value":"thgewgewgewgewge","weight":1}
   */
  assert: Assertion[]
  /**
   * @example {"assert":[{"type":"icontains","value":"serendipity","weight":5}],"vars":{"number_of_sentences":"2","text":"The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise."}}
   * @example {"assert":[{"type":"icontains","value":"minimalism","weight":5}],"vars":{"number_of_sentences":"2","text":"The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy."}}
   */
  test_cases: TestCaseInput[]
}

export type Assertion = {
  type: BaseAssertionTypes
  value?: string | string[] | Record<string, any> | null
  threshold?: number | null
  weight?: number | null
  metric?: string | null
}

export type BaseAssertionTypes =
  | "contains"
  | "contains-all"
  | "contains-any"
  | "contains-json"
  | "contains-sql"
  | "contains-xml"
  | "cost"
  | "equals"
  | "icontains"
  | "icontains-all"
  | "icontains-any"
  | "is-json"
  | "is-sql"
  | "is-xml"
  | "javascript"
  | "latency"
  | "levenshtein"
  | "perplexity-score"
  | "perplexity"
  | "python"
  | "regex"
  | "rouge-n"
  | "starts-with"

export const baseAssertionTypesArray: BaseAssertionTypes[] = [
  "contains",
  "contains-all",
  "contains-any",
  "contains-json",
  "contains-sql",
  "contains-xml",
  "cost",
  "equals",
  "icontains",
  "icontains-all",
  "icontains-any",
  "is-json",
  "is-sql",
  "is-xml",
  "javascript",
  "latency",
  "levenshtein",
  "perplexity-score",
  "perplexity",
  "python",
  "regex",
  "rouge-n",
  "starts-with",
]

export type BodyLoginAuthLoginPost = {
  grant_type?: string | null
  username: string
  password: string
  /**
   * @default
   */
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type EvaluateResult = {
  response?: ProviderResponse | null
  vars?: {
    [key: string]: string
  }
  score: number | null
  latencyMs: number
  gradingResult?: GradingResult | null
  namedScores: {
    [key: string]: number
  }
  cost?: number | null
  metadata?: Record<string, any> | null
}

export type EvaluateStats = {
  successes: number
  failures: number
  tokenUsage: TokenUsage
}

export type EvaluateSummary = {
  /**
   * @format date-time
   */
  timestamp: string
  results: EvaluateResult[]
  stats: EvaluateStats
}

export type GradingResult = {
  pass: boolean
  score: number | null
  componentResults?: GradingResult[] | null
  assertion?: Assertion | null
  comment?: string | null
}

export type HTTPValidationError = {
  detail?: ValidationError[]
}

export type HttpExceptionModel = {
  message: string
  status: number
}

export type InputVariable = {
  /**
   * @maxLength 40
   * @minLength 1
   * @pattern ^[^\s]+$
   */
  name: string
}

export type JsonSchemaInput = {
  type: "string" | "number" | "integer" | "boolean" | "object" | "array" | "null"
  ["enum"]?: string[] | number[] | number[] | null
  ["const"]?: void | null
  maxLength?: number | null
  minLength?: number | null
  pattern?: string | null
  multipleOf?: number | null
  maximum?: number | null
  exclusiveMaximum?: number | null
  minimum?: number | null
  exclusiveMinimum?: number | null
  items?: JsonSchemaInput | null
  contains?: JsonSchemaInput | null
  maxContains?: number | null
  minContains?: number | null
  maxItems?: number | null
  minItems?: number | null
  uniqueItems?: boolean | null
  properties?: {
    [key: string]: JsonSchemaInput
  } | null
  patternProperties?: {
    [key: string]: JsonSchemaInput
  } | null
  additionalProperties?: boolean | JsonSchemaInput | null
  maxProperties?: number | null
  minProperties?: number | null
  required?: string[] | null
  dependentRequired?: {
    [key: string]: string[]
  } | null
  dependentSchemas?: {
    [key: string]: JsonSchemaInput
  } | null
  propertyNames?: JsonSchemaInput | null
}

export type JsonSchemaOutput = {
  type: "string" | "number" | "integer" | "boolean" | "object" | "array" | "null"
  ["enum"]?: string[] | number[] | number[] | null
  ["const"]?: void | null
  maxLength?: number | null
  minLength?: number | null
  pattern?: string | null
  multipleOf?: number | null
  maximum?: number | null
  exclusiveMaximum?: number | null
  minimum?: number | null
  exclusiveMinimum?: number | null
  items?: JsonSchemaOutput | null
  contains?: JsonSchemaOutput | null
  maxContains?: number | null
  minContains?: number | null
  maxItems?: number | null
  minItems?: number | null
  uniqueItems?: boolean | null
  properties?: {
    [key: string]: JsonSchemaOutput
  } | null
  patternProperties?: {
    [key: string]: JsonSchemaOutput
  } | null
  additionalProperties?: boolean | JsonSchemaOutput | null
  maxProperties?: number | null
  minProperties?: number | null
  required?: string[] | null
  dependentRequired?: {
    [key: string]: string[]
  } | null
  dependentSchemas?: {
    [key: string]: JsonSchemaOutput
  } | null
  propertyNames?: JsonSchemaOutput | null
}

export type Prompt = {
  /**
   * @example single_shot
   */
  prompt_type: "single_shot" | "chat"
  /**
   * @example {"content":"Summarize the following text: {{text}} in {{number_of_sentences}} sentences.","role":"user"}
   */
  messages: PromptMessage[]
  ai_function_id: string
  _id?: string | null
  /**
   * @format email
   */
  username: string
  /**
   * @format date-time
   */
  creation_time: string
  last_eval?: EvaluateSummary | null
}

export type PromptMessage = {
  role: RoleEnum
  content: string
}

export type PromptRouteInput = {
  /**
   * @example single_shot
   */
  prompt_type: "single_shot" | "chat"
  /**
   * @example {"content":"Summarize the following text: {{text}} in {{number_of_sentences}} sentences.","role":"user"}
   */
  messages: PromptMessage[]
  ai_function_id: string
}

export type ProviderResponse = {
  cached?: number | null
  cost?: number | null
  error?: string | null
  logProbs?: number[] | null
  metadata?: Record<string, any> | null
  output?: string | void | null
  tokenUsage?: TokenUsage | null
}

export type RoleEnum = "system" | "user" | "assistant"

export type SuccessResponse = {
  /**
   * @default Success
   */
  message?: string
}

export type TestCaseInput = {
  vars: {
    [key: string]: string
  }
  assert: Assertion[] | null
}

export type TestCaseOutput = {
  vars: {
    [key: string]: string
  }
  assert: Assertion[] | null
}

export type TokenUsage = {
  /**
   * @default 0
   */
  total?: number | null
  /**
   * @default 0
   */
  prompt?: number | null
  /**
   * @default 0
   */
  completion?: number | null
  /**
   * @default 0
   */
  cached?: number | null
}

export type User = {
  /**
   * @format email
   */
  username: string
  /**
   * @minLength 1
   */
  first_name: string
  /**
   * @minLength 1
   */
  last_name: string
  role: "developer" | "prompt_engineer" | "admin"
  _id?: string | null
}

export type UserRouteInput = {
  /**
   * @format email
   */
  username: string
  /**
   * @minLength 1
   */
  first_name: string
  /**
   * @minLength 1
   */
  last_name: string
  role: "developer" | "prompt_engineer" | "admin"
  hashed_password: string
}

export type UserWithAccessToken = {
  access_token: string
  /**
   * @format email
   */
  username: string
  /**
   * @minLength 1
   */
  first_name: string
  /**
   * @minLength 1
   */
  last_name: string
  role: "developer" | "prompt_engineer" | "admin"
  _id: string
}

export type ValidationError = {
  loc: (string | number)[]
  msg: string
  type: string
}
