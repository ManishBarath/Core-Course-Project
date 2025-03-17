from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
load_dotenv(dotenv_path=".env")

load_dotenv()

# apikey = os.getenv("AIzaSyBMLSQIGQlsNl38rZXL3R4cMWXv_bOpReA")
GOOGLE_API_KEY="AIzaSyBMLSQIGQlsNl38rZXL3R4cMWXv_bOpReA"
print(GOOGLE_API_KEY)
genai.configure(api_key=GOOGLE_API_KEY)

generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1000,
}

system_message = """
You are an assistant that generates SQL queries based on natural language requests. The dataset has the following schema:

table_name	column_name	data_type
abundancedata	abundance_id	integer
abundancedata	species_id	integer
abundancedata	catch_date	date
abundancedata	latitude	numeric
abundancedata	longitude	numeric
abundancedata	depth	numeric
abundancedata	catch_weight	numeric
abundancedata	data_source	text
occurrencedata	occurrence_id	integer
occurrencedata	species_id	integer
occurrencedata	catch_date	date
occurrencedata	latitude	numeric
occurrencedata	longitude	numeric
occurrencedata	depth	numeric
occurrencedata	catch_weight	numeric
occurrencedata	data_source	text
species	species_id	integer
species	species_name	character varying
users	user_id	integer
users	username	character varying
users	email	character varying
users	password_hash	text
Instructions:

Generate SQL queries that explicitly reference columns from the schema to ensure clarity.
Always include filtering conditions, sorting orders, or grouping criteria if requested in the input query.
When processing ambiguous instructions, prioritize generating queries that return valid and meaningful results based on the schema.
Validate the syntax to confirm that it adheres to standard SQL conventions.
The occurrencedata table contains only the information indicating whether a fish is found, while the abundancedata table contains information about the fish catch weight.
When a user requests data, determine whether to fetch from the occurrencedata table or the abundancedata table based on the requested information. If the request is for species data or does not specify fish catch weight, the query should fetch data solely from the occurrencedata table. If the request specifically asks for fish catch weight, then the query should fetch data from the abundancedata table.
In all cases, return all columns from the selected table(s) for the rows that meet the query criteria
"""
system_message = system_message.replace(f'\n', '')

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction=system_message,
)

app = Flask(__name__)
CORS(app)

@app.route('/generate-sql', methods=['POST'])
def send_message():
    data = request.json.get("query")

    if not data:
        return jsonify({"error": "Message content is required."}), 400

    response = model.generate_content(data)
    ai_text = response.text
    ai_text = ai_text.replace('\n', ' ')
    ai_text = ai_text.replace('sql', '')
    ai_text = ai_text.replace('```', ' ')
    
    return jsonify({"ai_text": ai_text})

if __name__ == '__main__':
    app.run(debug=True)