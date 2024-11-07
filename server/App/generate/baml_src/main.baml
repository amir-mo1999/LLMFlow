function GenerateTestCases(description:string, test_cases: map<string, string>[], input_variables: string[]) -> map<string, string>[] {
    client GPT4
    prompt #"
        To test out a function I wrote I require additional testing data.
        Here is a short description of my function:
        {{description}}

        Generate data points for my function that each contain a value for the following fields:
        {% for var in input_variables %}
        {{ var }}, 
        {% endfor %}

        Here are some examples:
        {% for test_case in test_cases %}
        {{ test_case}}, 
        {% endfor %}
    "#
}

test Test {
  functions [GenerateTestCases]
  args {
    description #"
      Summarizes a text to a given number of sentences.
    "#
    test_cases [
      {
        "text" #"
          Living abroad has its fair share of adventures and challenges. Every day feels like a new page, filled with small moments that bring both joy and growth. From navigating local markets to mastering unfamiliar public transit systems, each experience adds a layer to your independence. The thrill of discovering new foods, festivals, and traditions is balanced by the occasional pang of homesickness. However, those moments of nostalgia make connecting with fellow students or locals even more special. Studying abroad isn't just about classes or coursework; it's a journey in self-discovery. You learn the art of adapting, of communicating across language barriers, and of appreciating differences. Each friendship forged and each lesson learned becomes a part of who you are. By the time you return home, you realize you’re carrying a piece of this place with you. It’s the beauty of travel – it changes you in ways you never expected.

        "#
      },
      {
        "number_of_sentnces" #"
          2
        "#
      }
            {
        "text" #"
Learning a new skill as an adult is like opening a door to a room you didn’t know existed. At first, there’s a mix of excitement and a bit of nervousness – you’re ready to dive in, but there’s also the nagging feeling that you might be “too late” or that others are miles ahead. Yet, as you start, you realize that this journey is uniquely your own. Whether it’s painting, playing an instrument, coding, or even baking, the first steps are usually humbling. Mistakes happen often, and it’s easy to feel frustrated, but every little bit of progress builds confidence and keeps you coming back.

With each attempt, you uncover new layers of knowledge and gain insights that weren’t visible from the start. You begin to appreciate the nuances – the way colors blend on a canvas, the intricate timing of a musical piece, or the delicate chemistry of ingredients in the kitchen. It’s a process that demands patience and persistence, teaching you to slow down and focus. In the beginning, it’s all about mastering the basics, but soon enough, you find yourself adding a bit of flair or experimenting outside the lines.

Along the way, you encounter communities of like-minded learners, each with their own stories and tips. Connecting with others who are on a similar path turns the journey into something shared and inspiring. There’s a unique thrill in celebrating small victories together, whether it’s nailing a difficult chord or baking your first loaf of bread from scratch. Eventually, the skill starts to feel like a part of you – no longer a daunting task but something that flows naturally. By the time you look back, you realize it wasn’t about perfection but about growth and resilience. The journey of learning becomes a reminder that there’s always room to grow and discover, no matter where you start.
        "#
      },
      {
        "number_of_sentnces" #"
          4
        "#
      }
    ]
    input_variables [
      #"
        text
      "#,
      #"
        number_of_sentences
      "#
    ]
  }
}
