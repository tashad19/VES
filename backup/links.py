from flask import Flask, request, jsonify
from googlesearch import search
from bs4 import BeautifulSoup
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)

def fetch_url(url):
    try:
        response = requests.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string if soup.title else "No title available"
        description = ""
        meta_desc = soup.find("meta", attrs={"name": "description"})
        
        if meta_desc and "content" in meta_desc.attrs:
            description = meta_desc["content"]
        else:
            paragraphs = soup.find_all("p")
            if paragraphs:
                description = paragraphs[0].get_text()
        
        return {
            "title": title,
            "link": url,
            "description": description
        }
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def google_search_scraper(query, num_results=10):
    urls = list(search(query, num_results=num_results))
    results = []
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(fetch_url, url): url for url in urls}
        for future in as_completed(future_to_url):
            result = future.result()
            if result:
                results.append(result)
    
    return results

@app.route('/search', methods=['GET'])
def search_api():
    query = request.args.get('query')
    query = "learn " + query
    num_results = request.args.get('num_results', default=10, type=int)
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    results = google_search_scraper(query, num_results)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
