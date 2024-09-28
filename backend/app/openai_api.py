import os
from openai import OpenAI

from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

#flow, the sentences are not poorly structured
#grammar
#correctness
#on topic


def generate_prompt():
    response = client.chat.completions.create(model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an useful program that will do anything to help the user, making sure you satisfy the user to the best of your abilities"},
        {"role": "user", "content": "Generate me an conversation topic is likely to show up in people's lives. that is 2 sentences long, that are designed to be graded for english texting fluency, make sure the conversation is engaging and interesting. and most importantly will show up regularlly in everyday online conversations, make it sound as human as possible, don't keep it too formal."}
    ])
    return response.choices[0].message.content.strip()

# TODO: check if there could be too many words, might cause crash
def ai_response_prompt(previous_conversation, prompt):
    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "the other person said: "
        else:
            prev_convo += "the you said: "
        is_AI = not is_AI
        prev_convo += convo + "\n"
    print(prev_convo)
    response = client.chat.completions.create(model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an competent but easy conversation program, you should behave like one, that is trying to have a normal conversation with the user, make sure you best mimic how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Generate me the a starting piece to this prompt like an online text conversation, try to come up with personalized example based on the prompt, include that in the first reponse, keep the responses between 1 to 2 sentences, only include what you say to the person in the response."}
    ])
    return response.choices[0].message.content.strip()


pro = generate_prompt()
total_convo = [pro]
print(pro)
while True:
    response = input()
    total_convo.append(response)
    print(total_convo)
    resp = ai_response_prompt(total_convo,pro)
    total_convo.append(resp)
    print(resp)
    print("\n")


