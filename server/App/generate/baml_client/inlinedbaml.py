###############################################################################
#
#  Welcome to Baml! To use this generated code, please run the following:
#
#  $ pip install baml
#
###############################################################################

# This file was generated by BAML: please do not edit it. Instead, edit the
# BAML files and re-generate this code.
#
# ruff: noqa: E501,F401
# flake8: noqa: E501,F401
# pylint: disable=unused-import,line-too-long
# fmt: off

file_map = {

    "clients.baml": "// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview\n\n\nclient<llm> GPT4 {\n  provider openai\n  retry_policy Exponential\n  options {\n    model \"gpt-4o-mini\"\n    api_key env.OPENAI_API_KEY\n  }\n}\n\n\n// https://docs.boundaryml.com/docs/snippets/clients/round-robin\nclient<llm> CustomFast {\n  provider round-robin\n  options {\n    // This will alternate between the two clients\n    strategy [CustomGPT4oMini, CustomHaiku]\n  }\n}\n\n// https://docs.boundaryml.com/docs/snippets/clients/fallback\nclient<llm> OpenaiFallback {\n  provider fallback\n  options {\n    // This will try the clients in order until one succeeds\n    strategy [CustomGPT4oMini, CustomGPT4oMini]\n  }\n}\n\n// https://docs.boundaryml.com/docs/snippets/clients/retry\nretry_policy Constant {\n  max_retries 3\n  // Strategy is optional\n  strategy {\n    type constant_delay\n    delay_ms 200\n  }\n}\n\nretry_policy Exponential {\n  max_retries 2\n  // Strategy is optional\n  strategy {\n    type exponential_backoff\n    delay_ms 300\n    mutliplier 1.5\n    max_delay_ms 10000\n  }\n}",
    "generators.baml": "// This helps use auto generate libraries you can use in the language of\n// your choice. You can have multiple generators if you use multiple languages.\n// Just ensure that the output_dir is different for each generator.\ngenerator target {\n    // Valid values: \"python/pydantic\", \"typescript\", \"ruby/sorbet\", \"rest/openapi\"\n    output_type \"python/pydantic\"\n\n    // Where the generated code will be saved (relative to baml_src/)\n    output_dir \"../\"\n\n    // The version of the BAML package you have installed (e.g. same version as your baml-py or @boundaryml/baml).\n    // The BAML VSCode extension version should also match this version.\n    version \"0.67.0\"\n\n    // Valid values: \"sync\", \"async\"\n    // This controls what `b.FunctionName()` will be (sync or async).\n    default_client_mode sync\n}\n",
    "main.baml": "function GenerateTestCases(description:string, test_cases: map<string, string>[], input_variables: string[]) -> map<string, string>[] {\n    client GPT4\n    prompt #\"\n        To test out a function I wrote I require additional testing data.\n        Here is a short description of my function:\n        {{description}}\n\n        Generate data points for my function that each contain a value for the following fields:\n        {% for var in input_variables %}\n        {{ var }}, \n        {% endfor %}\n\n        Here are some examples:\n        {% for test_case in test_cases %}\n        {{ test_case}}, \n        {% endfor %}\n    \"#\n}\n\ntest Test {\n  functions [GenerateTestCases]\n  args {\n    description #\"\n      Summarizes a text to a given number of sentences.\n    \"#\n    test_cases [\n      {\n        \"text\" #\"\n          Living abroad has its fair share of adventures and challenges. Every day feels like a new page, filled with small moments that bring both joy and growth. From navigating local markets to mastering unfamiliar public transit systems, each experience adds a layer to your independence. The thrill of discovering new foods, festivals, and traditions is balanced by the occasional pang of homesickness. However, those moments of nostalgia make connecting with fellow students or locals even more special. Studying abroad isn't just about classes or coursework; it's a journey in self-discovery. You learn the art of adapting, of communicating across language barriers, and of appreciating differences. Each friendship forged and each lesson learned becomes a part of who you are. By the time you return home, you realize you’re carrying a piece of this place with you. It’s the beauty of travel – it changes you in ways you never expected.\n\n        \"#\n      },\n      {\n        \"number_of_sentnces\" #\"\n          2\n        \"#\n      }\n            {\n        \"text\" #\"\nLearning a new skill as an adult is like opening a door to a room you didn’t know existed. At first, there’s a mix of excitement and a bit of nervousness – you’re ready to dive in, but there’s also the nagging feeling that you might be “too late” or that others are miles ahead. Yet, as you start, you realize that this journey is uniquely your own. Whether it’s painting, playing an instrument, coding, or even baking, the first steps are usually humbling. Mistakes happen often, and it’s easy to feel frustrated, but every little bit of progress builds confidence and keeps you coming back.\n\nWith each attempt, you uncover new layers of knowledge and gain insights that weren’t visible from the start. You begin to appreciate the nuances – the way colors blend on a canvas, the intricate timing of a musical piece, or the delicate chemistry of ingredients in the kitchen. It’s a process that demands patience and persistence, teaching you to slow down and focus. In the beginning, it’s all about mastering the basics, but soon enough, you find yourself adding a bit of flair or experimenting outside the lines.\n\nAlong the way, you encounter communities of like-minded learners, each with their own stories and tips. Connecting with others who are on a similar path turns the journey into something shared and inspiring. There’s a unique thrill in celebrating small victories together, whether it’s nailing a difficult chord or baking your first loaf of bread from scratch. Eventually, the skill starts to feel like a part of you – no longer a daunting task but something that flows naturally. By the time you look back, you realize it wasn’t about perfection but about growth and resilience. The journey of learning becomes a reminder that there’s always room to grow and discover, no matter where you start.\n        \"#\n      },\n      {\n        \"number_of_sentnces\" #\"\n          4\n        \"#\n      }\n    ]\n    input_variables [\n      #\"\n        text\n      \"#,\n      #\"\n        number_of_sentences\n      \"#\n    ]\n  }\n}\n",
    "resume.baml": "// Defining a data model.\nclass Resume {\n  name string\n  email string\n  experience string[]\n  skills string[]\n}\n\n// Create a function to extract the resume from a string.\nfunction ExtractResume(resume: string) -> Resume {\n  // Specify a client as provider/model-name\n  // you can use custom LLM params with a custom client name from clients.baml like \"client CustomHaiku\"\n  client \"openai/gpt-4o\" // Set OPENAI_API_KEY to use this client.\n  prompt #\"\n    Extract from this content:\n    {{ resume }}\n\n    {{ ctx.output_format }}\n  \"#\n}\n\n// Test the function with a sample resume. Open the VSCode playground to run this.\ntest vaibhav_resume {\n  functions [ExtractResume]\n  args {\n    resume #\"\n      Vaibhav Gupta\n      vbv@boundaryml.com\n\n      Experience:\n      - Founder at BoundaryML\n      - CV Engineer at Google\n      - CV Engineer at Microsoft\n\n      Skills:\n      - Rust\n      - C++\n    \"#\n  }\n}\n",
}

def get_baml_files():
    return file_map
