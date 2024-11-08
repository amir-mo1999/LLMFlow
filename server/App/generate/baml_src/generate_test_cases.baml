
class GenTestCasesParams {
  description string
  test_cases map<string, string>[]
  input_variables string[]
}

class GenTestCases {
  test_cases map<string, string>[]
}


function GenerateTestCases(params: GenTestCasesParams) -> GenTestCases {
    client GPT4Mini
    prompt #"
        To test out a function I wrote I require additional testing data.
        Here is a short description of my function:
        {{params.description}}

        Generate data points for my function that each contain a value for the following fields:
        {% for var in params.input_variables %}
        {{ var }},
        {% endfor %}

        Here are some examples, note that the examples your generate must not necessarily be similiar but they most contain the same fields:
        {% for test_case in params.test_cases %}
        {{ test_case}},
        {% endfor %}
    "#
}

test Test1 {
  functions [GenerateTestCases]
  args {
    params {
      description "Summarizes a text to a given number of sentences"
      test_cases [{
        text "Living abroad has its fair share of adventures and challenges. Every day feels like a new page, filled with small moments that bring both joy and growth. From navigating local markets to mastering unfamiliar public transit systems, each experience adds a layer to your independence. The thrill of discovering new foods, festivals, and traditions is balanced by the occasional pang of homesickness. However, those moments of nostalgia make connecting with fellow students or locals even more special. Studying abroad isn't just about classes or coursework; it's a journey in self-discovery. You learn the art of adapting, of communicating across language barriers, and of appreciating differences. Each friendship forged and each lesson learned becomes a part of who you are. By the time you return home, you realize you’re carrying a piece of this place with you. It’s the beauty of travel – it changes you in ways you never expected."
        number_of_sentences "2"
      }]
      input_variables [
        "text" 
        "number_of_sentences"
        ]
    }
  }
}