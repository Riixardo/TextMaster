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

difficulty = {
    "Hard": "The topic should be serious, semi formal, a little longer than the avgerage text message. Topic should not need any extensive previous background.",
    "Medium": "Topic that are a little more personal, opinionated, and a little less casual in topic. Also, use topics that do not require long responses.Topic should not need any extensive previous background.",
    "Easy": "topics that only really need one sentence per response from the user, extremely casual in topic and tone. Topic needs to be not serious. Topic should not need any extensive previous background."
}

# Hard: The topic should be serious, semi formal, a little longer than the avgerage text message. Topic should not need any extensive previous background.
# Intermediate: Topic that are a little more personal, opinionated, and a little less casual in topic. Topic should not need any extensive previous background. 
# Easy: topics that only really need one sentence per response from the user, extremely casual in topic and tone. Topic needs to be not serious. Topic should not need any extensive previous background.

def generate_prompt(prompt_diffculty):
    response = client.chat.completions.create(model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an useful program that will do anything to help the user, making sure you satisfy the user to the best of your abilities"},
        {"role": "user", "content": f"Generate me an conversation topic is likely to show up in people's lives. that is 2 sentences long, that are designed to be graded for english texting fluency, make sure the conversation is engaging and interesting. make it sound as human as possible. {difficulty[prompt_diffculty]}"}
    ])
    return response.choices[0].message.content.strip()

# TODO: check if there could be too many words, might cause crash
def ai_response_prompt(previous_conversation, prompt):
    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "you said: "
        else:
            prev_convo += "the other person said: "
        is_AI = not is_AI
        prev_convo += convo + "\n"
    response = client.chat.completions.create(model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an competent but easy conversation program, you should behave like one, that is trying to have a normal conversation with the user, make sure you best mimic how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Generate me the a starting piece to this prompt like an online text conversation, try to come up with personalized example based on the prompt, include that in the first reponse, keep the responses between 1 to 2 sentences, only include what you say to the person in the response."}
    ])
    return response.choices[0].message.content.strip()


def grade_user_responses(previous_conversation, prompt):
    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "you said: "
        else:
            prev_convo += "the other person said: "
        is_AI = not is_AI
        prev_convo += convo + "\n"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a competent grading program that has no bias. You should behave like one. Make sure you take into account how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Focusing on the latest response from the other person, give me a grade out of 100 for the following: Flow, Conciseness, Clarity, and On Topic. Please provide the grades in the following format, don't include any puntucation except : and , : Flow: [number], Conciseness: [number], Clarity: [number], On Topic: [number]"}
        ]
    )
    
    response_text = response.choices[0].message.content.strip()
    
    # Extract the numbers from the response
    grades = {}
    for line in response_text.split('\n'):
        if ':' in line:
            print(line)
            for small_part in line.split(","):
                smaller_part = small_part.split(":")
                grades[smaller_part[0]] = int(smaller_part[1])
    
    return grades


"""
['"Hey, what\'s the most riveting book you\'ve recently read, and why would you recommend it? I\'m trying to add more interesting stuff to my reading list."', 'All quiet on the Western Front is one of my personal favourites', '"Oh, \'All Quiet on the Western Front\' is a great choice! How did you feel about the book\'s portrayal of the harsh realities of war? What message stood out to you?"', 'I felt that it was great portrayal of war from the German perspective which was very under represented in media. The message that Peter was just another statistic on the Western Front was the most powerful for me because it showed just how insignificant his death was for the war.']
"""

pro = generate_prompt("Easy")
total_convo = [pro]
print(pro)
while True:
    response = input("give me your response")
    total_convo.append(response)
    print(total_convo)
    print(grade_user_responses(total_convo,pro))
    resp = ai_response_prompt(total_convo,pro)
    total_convo.append(resp)
    print(resp)
    print("\n")


