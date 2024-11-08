
class GenParams {
  name string
  description string
  test_case map<string, string>
  variables string[]
}


enum GenRole {
  System
  User
  Assistant
}


class GenTestCase {
  variables map<string, string>
}

class GenPromptMessage {
  role GenRole
  content string
}

function GenerateTestCases(params: GenParams) -> GenTestCase[] {
    client GPT4Mini
    prompt #"
        To test out a function I wrote I require additional testing data.
        The function is called {{params.name}}. Here is a short description of the function:
        {{params.description}}

        Generate up to two data points for my function that each contain a value for the following fields:
        {% for var in params.variables %}
        {{ var }},
        {% endfor %}

        Here is an example:
        {{params.test_case}}


        If the provided informtation is not sufficient to generate data points, simply output "insufficient context".
        Do not exactly follow the example provided. The data points you generate may differ from the example but they must contain the same fields.
    "#
}


function GeneratePromptMessages(params: GenParams) -> GenPromptMessage[] {
  client GPT4Mini

  prompt #"
    I defined an AI function that takes a set parameters as input and returns a specific output. The AI function is called {{params.name}}.
    Here is a short description of the function {{params.description}}.

    The function takes the following parameters as input:
    {% for var in params.variables %}
    {{ var }},
    {% endfor %}

    Here are example values for each parameter:
    {{params.test_case}}

    A prompt is a set of prompt messages. Prompt messages follow the OpenAI specification. Each prompt message has a role: "user", "system" or "assistent" and content as a string.
    The prompt you generate may contain up to three prompt messages.

    Generate a prompt for the described AI Function in the specified output format for a prompt.
  "#
}
