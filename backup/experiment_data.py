from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
client = genai.Client(api_key=key)

def format_json_input(json_string: str) -> dict:
    """
    Takes a raw JSON string and returns a properly formatted JSON object.
    """
    try:
        cleaned_string = json_string.strip()
        json_data = json.loads(cleaned_string)
        
        if not isinstance(json_data, dict):
            raise ValueError("Input JSON must be an object (dictionary)")
        
        formatted_output = {}
        
        for key, value in json_data.items():
            clean_key = str(key).strip()
            
            if isinstance(value, str):
                formatted_output[clean_key] = " ".join(value.split())
            elif isinstance(value, (int, float, bool)) or value is None:
                formatted_output[clean_key] = value
            else:
                formatted_output[clean_key] = str(value)
                
        return formatted_output
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error processing JSON: {str(e)}")

@app.route('/generate', methods=["GET"])
def generate_mcqs():
    text = request.args.get("text")
    
    if not text:
        return jsonify({"error": "Missing 'text' query parameter"}), 400

    sys_instruct = '''
    You are an API that sends JSON response. Imagine you are also a teacher and you are preparing an experiment that contains 3 parts: aim, introduction, and a short note on the theory of the experiment.
    The aim should be short and concise, 25 words at maximum. The introduction should be brief, giving insight into the experiment, 75 words at maximum.
    The article should explain the theory behind the experiment, it should be at least 200 words but can be more depending on the given theory.
    Return all three parts in the following JSON format without any additional text:
    {
        "aim": "the aim of your experiment",
        "introduction": "a brief introduction to the experiment",
        "article": "theory of the experiment"
    }
    '''

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=sys_instruct),
        contents=[text]
    )

    output = response.text
    
    try:
        json_content = output.replace("```json", "").replace("```", "").strip()
        formatted_json = format_json_input(json_content)
        return jsonify(formatted_json)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5003)
