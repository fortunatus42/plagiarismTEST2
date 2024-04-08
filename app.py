from markupsafe import Markup
from difflib import SequenceMatcher
from flask import Flask, render_template, request, flash
import spacy

app = Flask(__name__, template_folder='templates')
app.secret_key = 'your_secret_key_here'  # Required for flashing messages

nlp = spacy.load("en_core_web_sm")

def check_plagiarism(text1, text2):
    """Check plagiarism between two texts."""
    text1_lower = text1.lower()
    text2_lower = text2.lower()

    matcher = SequenceMatcher(None, text1_lower, text2_lower)
    matching_blocks = matcher.get_matching_blocks()

    # Highlight the matching blocks in text1 and text2
    highlighted_text1 = ""
    highlighted_text2 = ""
    last_match_end1 = 0
    last_match_end2 = 0
    
    for match in matching_blocks:
        start1 = match.a
        end1 = match.a + match.size
        start2 = match.b
        end2 = match.b + match.size
        highlighted_text1 += text1[last_match_end1:start1]
        highlighted_text2 += text2[last_match_end2:start2]
        for i in range(match.size):
            if text1_lower[start1 + i] == text2_lower[start2 + i]:
                highlighted_text1 += '<span style="color:red">'
                highlighted_text1 += text1[start1 + i]
                highlighted_text1 += '</span>'
                highlighted_text2 += '<span style="color:red">'
                highlighted_text2 += text2[start2 + i]
                highlighted_text2 += '</span>'
            else:
                highlighted_text1 += text1[start1 + i]
                highlighted_text2 += text2[start2 + i]
        last_match_end1 = end1
        last_match_end2 = end2

    highlighted_text1 += text1[last_match_end1:]
    highlighted_text2 += text2[last_match_end2:]

    similarity_ratio = int(round(matcher.ratio() * 100))  # Calculate similarity as percentage
    return f"{similarity_ratio}%", Markup(highlighted_text1), Markup(highlighted_text2)  # Return similarity as a percentage with % symbol

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        text1 = request.form['text1']
        text2 = request.form['text2']

        if not text1.strip() or not text2.strip():
            flash('Please fill in both text areas.', 'error')
            return render_template('index.html')

        similarity, highlighted_text1, highlighted_text2 = check_plagiarism(text1, text2)
        return render_template('result.html', similarity=similarity, text1=highlighted_text1, text2=highlighted_text2)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
