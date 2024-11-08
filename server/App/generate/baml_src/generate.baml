
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


        If the provided information is not sufficient to generate data points, simply output "insufficient context".
        Do not exactly follow the example provided. The data points you generate may differ from the example but they must contain the same fields.
    "#
}


function GeneratePromptMessages(params: GenParams) -> GenPromptMessage[] {
  client GPT4Mini

  prompt #"
    I defined an AI function that takes a set of parameters as input and returns a specific output. Now I must define a prompt for this function.
    A prompt consists of several prompt messages. Prompt messages follow the OpenAI specification. Each prompt message has a role: "user", "system" or "assistant" and content as a string.
    
    Each parameter of the AI function must be contained in at least one prompt message in between two sets of braces.

    Here is an example of a prompt for the AI Function “Translate Text” that translates text to a target language, which takes the parameters: “text” and “language”:
    [
        {
            "role": "system",
            "content": "You are a translation AI that accurately translates text into specified target languages."
        },
        {
            "role": "user",
            "content": "Translate the following text into {% raw %}{{language}}{% endraw %}: {% raw %}{{text}}{% endraw %}"
        }
    ]

    Now generate a prompt for the AI function: {{params.name}}.
    Here is a short description of the function: {{params.description}}.

    The function takes the following parameters as input:
    {% for var in params.variables %}
    {{ var }},
    {% endfor %}

    Here are example values for each parameter:
    {{params.test_case}}

    If the provided context is not sufficient to generate a prompt simply output: "insufficient context".
  "#

}
