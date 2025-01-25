from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
load_dotenv()

# apikey = "AIzaSyDV6TnK_RdbzCqqIbtIB-obxXLON0gMTs4"
# apikey = ""
genai.configure(api_key="AIzaSyBzHgFFZ4sqAU378KTGZASsA9f3l22JL7E")
generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1000,
}

system_message ="""
You are an assistant that generates SQL queries based on natural language requests. The dataset has the following schema:
    Table Name : Fishes
    Date (DATE): The date when the data was recorded.
    Species (TEXT): The species of marine life.
    Latitude (FLOAT): The latitude where the catch was recorded.
    Longitude (FLOAT): The longitude where the catch was recorded.
    Catch Weight (kg) (FLOAT): The weight of the catch in kilograms.
    Depth (m) (FLOAT): The depth in meters at which the catch was recorded.
Instructions:
    Generate SQL queries that explicitly reference columns from the schema to ensure clarity.
    Always include filtering conditions, sorting orders, or grouping criteria if requested in the input query.
    When processing ambiguous instructions, prioritize generating queries that return valid and meaningful results based on the schema.
    Validate the syntax to confirm that it adheres to standard SQL conventions.
"""
system_message = system_message.replace(f'\n', '')

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction=system_message,
)

app = Flask(__name__)
CORS(app)


@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    candidate_text = data.get("message", "")

    if not candidate_text:
        return jsonify({"error": "Message content is required."}), 400

    response = model.generate_content(candidate_text)
    ai_text = response.text
    ai_text = ai_text.replace(f'\n' ,' ')
    ai_text = ai_text.replace(f'sql' ,'')
    ai_text = ai_text.replace(f'```' ,' ')
    return jsonify({"ai_text": ai_text})
if __name__ == '__main__':
    app.run(debug=True)