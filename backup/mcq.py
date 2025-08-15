from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import re
from google.genai import types
from dotenv import load_dotenv
import os
# from parser import text #parser is supposed to take in the input from documents

load_dotenv()

key = os.getenv('GEMINI_API_KEY')

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
client = genai.Client(api_key=key)

def convert_quiz_data(input_string):
    try:
        cleaned_string = input_string
        
        if "```" in cleaned_string:
            cleaned_string = re.sub(r'```json\n|\n```|```', '', cleaned_string)
        
        cleaned_string = cleaned_string.replace('\\n', '\n')
        
        parsed_data = json.loads(cleaned_string)
        
        formatted_questions = []
        for q in parsed_data['questions']:
            formatted_questions.append({
                'id': q['id'],
                'question': q['question'],
                'options': [opt['option'] for opt in q['options']],
                'correctAnswer': q['answer'],
                'difficulty': q['difficulty']
            })
        
        result = {
            'totalQuestions': len(formatted_questions),
            'questions': formatted_questions
        }
        
        return result
    except Exception as e:
        return {
            'error': f'Failed to parse JSON: {str(e)}',
            'originalInput': input_string
        }

@app.route('/generate', methods=["GET"])
def generate_mcqs():
    topic = request.args.get('topic', 'general knowledge')  # Default topic if not provided

    sys_instruct = f'''
    You are an API that sends JSON response. Imagine you are also a teacher and you are preparing a set of MCQs on the topic "{topic}" with a minimum of 10 questions and a maximum of 15 questions.
    Each question should have an ID, question text, and options as an array of objects where each option has a key "option" and a value representing the choice.
    Please ensure to include at max 3 HARD questions and rest mostly keep EASY and MEDIUM. Return the questions and options in the following JSON format without any additional text:
    {{
    "questions": [
        {{
        "id": 1,
        "question": "Your question here",
        "options": [
            {{"option": "Option A"}},
            {{"option": "Option B"}},
            {{"option": "Option C"}},
            {{"option": "Option D"}}
        ],
        "answer": "Correct option text",
        "difficulty": "question difficulty here EASY | MEDIUM | HARD"
        }}
    ]
    }} '''

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=sys_instruct),
        contents=[f"Generate MCQs for {topic}"]
    )

    output = convert_quiz_data(response.text)

    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port=5001)