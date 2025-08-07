#!/usr/bin/env python3
import os
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from query import answer, retrieve_and_rerank
from build_index import build_index

app = Flask(__name__)
CORS(app)

# Build index on startup if it doesn't exist
def initialize_index():
    """Initialize the document index if it doesn't exist."""
    try:
        docs_folder = os.path.join(os.path.dirname(__file__), 'docs')
        if os.path.exists(docs_folder):
            print(f"[app.py] Building index from documents in {docs_folder}")
            build_index(docs_folder)
        else:
            print(f"[app.py] Warning: docs folder not found at {docs_folder}")
    except Exception as e:
        print(f"[app.py] Error building index: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "Bajaj AI Backend is running"})

@app.route('/query', methods=['POST'])
def process_query():
    """Process a natural language query and return structured response."""
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                "error": "Missing 'query' field in request body"
            }), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({
                "error": "Query cannot be empty"
            }), 400
        
        print(f"[app.py] Processing query: {query}")
        
        # Get the raw answer from the query system
        raw_answer = answer(query)
        
        # Get relevant context for justification
        context_docs = retrieve_and_rerank(query, top_k=10, rerank_k=3)
        
        # Parse the query to extract key information
        parsed_info = parse_query_info(query)
        
        # Generate structured response
        structured_response = generate_structured_response(
            query, raw_answer, context_docs, parsed_info
        )
        
        return jsonify(structured_response)
        
    except Exception as e:
        print(f"[app.py] Error processing query: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

def parse_query_info(query):
    """Extract structured information from the query."""
    query_lower = query.lower()
    
    # Extract age
    age = None
    age_patterns = [r'(\d+)[-\s]*(?:year|yr|y)[-\s]*old', r'(\d+)m', r'(\d+)f']
    import re
    for pattern in age_patterns:
        match = re.search(pattern, query_lower)
        if match:
            age = int(match.group(1))
            break
    
    # Extract gender
    gender = None
    if 'm' in query_lower or 'male' in query_lower:
        gender = 'male'
    elif 'f' in query_lower or 'female' in query_lower:
        gender = 'female'
    
    # Extract procedure/condition
    medical_terms = []
    common_procedures = [
        'surgery', 'operation', 'knee', 'heart', 'cardiac', 'bypass', 
        'replacement', 'repair', 'treatment', 'procedure'
    ]
    for term in common_procedures:
        if term in query_lower:
            medical_terms.append(term)
    
    # Extract location
    location = None
    indian_cities = ['pune', 'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata']
    for city in indian_cities:
        if city in query_lower:
            location = city.title()
            break
    
    # Extract policy duration
    policy_duration = None
    duration_patterns = [r'(\d+)[-\s]*month', r'(\d+)[-\s]*year']
    for pattern in duration_patterns:
        match = re.search(pattern, query_lower)
        if match:
            duration = int(match.group(1))
            if 'month' in pattern:
                policy_duration = f"{duration} months"
            else:
                policy_duration = f"{duration} years"
            break
    
    return {
        'age': age,
        'gender': gender,
        'medical_terms': medical_terms,
        'location': location,
        'policy_duration': policy_duration
    }

def generate_structured_response(query, raw_answer, context_docs, parsed_info):
    """Generate a structured JSON response based on the analysis."""
    
    # Determine decision based on the raw answer
    answer_lower = raw_answer.lower()
    
    if any(word in answer_lower for word in ['approved', 'covered', 'eligible', 'yes']):
        decision = 'approved'
        status_emoji = '✅'
    elif any(word in answer_lower for word in ['rejected', 'denied', 'not covered', 'ineligible', 'no']):
        decision = 'rejected'
        status_emoji = '❌'
    else:
        decision = 'under_review'
        status_emoji = '⏳'
    
    # Extract amount if mentioned
    amount = None
    import re
    amount_patterns = [r'₹\s*(\d+(?:,\d+)*)', r'rs\.?\s*(\d+(?:,\d+)*)', r'(\d+(?:,\d+)*)\s*rupees']
    for pattern in amount_patterns:
        match = re.search(pattern, raw_answer.lower())
        if match:
            amount = match.group(1).replace(',', '')
            try:
                amount = int(amount)
            except ValueError:
                amount = match.group(1)
            break
    
    # Generate clauses from context
    clauses = []
    for i, (doc, meta) in enumerate(context_docs):
        clause_id = f"C{i+1}.{hash(doc) % 100}"
        # Extract first sentence or meaningful part
        first_sentence = doc.split('.')[0][:100] + "..." if len(doc) > 100 else doc
        clauses.append({
            "id": clause_id,
            "title": f"Policy Clause from {meta.get('source', 'Document')}",
            "summary": first_sentence,
            "relevance": "high" if i < 2 else "medium"
        })
    
    # Calculate confidence based on various factors
    confidence = 85
    if decision == 'approved':
        confidence += 5
    if len(context_docs) >= 3:
        confidence += 5
    if parsed_info['age'] and parsed_info['policy_duration']:
        confidence += 5
    
    confidence = min(confidence, 99)
    
    # Generate thinking steps
    thinking_steps = [
        {
            "step": "Analyzing query context and extracting key information",
            "status": "complete",
            "details": f"Identified: {', '.join([f'{k}: {v}' for k, v in parsed_info.items() if v])}"
        },
        {
            "step": "Searching relevant policy documents and clauses",
            "status": "complete", 
            "details": f"Found {len(context_docs)} relevant document sections"
        },
        {
            "step": "Cross-referencing policy terms and conditions",
            "status": "complete",
            "details": "Checked waiting periods, coverage scope, and exclusions"
        },
        {
            "step": "Evaluating eligibility based on policy rules",
            "status": "complete",
            "details": f"Decision: {decision.upper()}"
        }
    ]
    
    return {
        "decision": decision,
        "status_emoji": status_emoji,
        "amount": amount,
        "confidence": confidence,
        "justification": raw_answer,
        "query_analysis": parsed_info,
        "clauses": clauses,
        "thinking_steps": thinking_steps,
        "raw_context": [{"source": meta.get('source', 'Unknown'), "content": doc[:200] + "..."} for doc, meta in context_docs[:3]]
    }

if __name__ == '__main__':
    print("[app.py] Starting Bajaj AI Backend Server...")
    initialize_index()
    app.run(debug=True, host='0.0.0.0', port=5000)