# CAIA Study Materials - Text Extraction

This repository contains extracted text from CAIA (Chartered Alternative Investment Analyst) study materials to facilitate quiz creation.

## Extracted Content

The following PDFs have been processed:

1. **CAIA Level I** (2009) - 662 pages, 131,656 words
2. **CAIA Level II** (2012) - 686 pages, 164,079 words  
3. **CAIA Level II** (2016) - 1,079 pages, 240,982 words

**Total**: 2,427 pages, 536,717 words

## File Structure

```
extracted_text/
├── [CAIA Knowledge] coll. - Alternative Investments_ CAIA Level II (2016, Wiley) - libgen.li.txt
├── [Wiley finance series] CAIA Association, Mark J. Anson PhD CFA - CAIA Level I_ An Introduction to Core Topics in Alternative Investments (Wiley Finance) (2009, Wiley) - libgen.li.txt
├── CAIA Association - CAIA Level II_ Advanced Core Topics in Alternative Investments (2012, Wiley) - libgen.li.txt
├── extraction_metadata.json          # Basic metadata about extraction
├── searchable_index.json             # Full searchable index with all text + exam info
├── index_metadata.json                # Lightweight index (metadata only, no full text) + exam info
└── caia_exam_info.json               # Comprehensive CAIA exam information (2026)
```

## CAIA Exam Information

The repository includes up-to-date CAIA exam information gathered from official sources:

### Key Exam Details

- **Two Levels**: Level I (foundational) and Level II (advanced)
- **Exam Windows**: March and September each year
- **Study Time**: 200-250 hours recommended per level
- **Pass Rates** (March 2025): Level I ~48%, Level II ~62%

### Topics Covered

**Level I Topics:**
- CAIA Ethical Principles
- Introduction to Alternative Investments
- Real Assets
- Private Equity
- Private Debt
- Hedge Funds
- Digital Assets
- Funds of Funds

**Level II Topics:**
- CAIA Ethical Principles
- Institutional Asset Owners
- Asset Allocation
- Risk and Risk Management
- Methods and Models
- Accessing Alternative Investments
- Due Diligence and Selecting Managers
- Volatility and Complex Strategies
- Universal Investment Considerations
- Emerging Topics

### Accessing Exam Information

```python
import json

# Load exam information
with open('extracted_text/caia_exam_info.json', 'r', encoding='utf-8') as f:
    exam_info = json.load(f)

# Access exam details
print(f"Level I Topics: {exam_info['curriculum']['level_1_topics']}")
print(f"Exam Fees: ${exam_info['fees']['exam_registration']['level_1']['standard']}")
print(f"2026 Exam Dates: {exam_info['exam_dates_2026']['march_window']['level_1_dates']}")
```

The exam information is also integrated into both `searchable_index.json` and `index_metadata.json` for easy access alongside the study materials.

## Usage for Quiz Creation

### Option 1: Use the Searchable Index (Recommended)

The `searchable_index.json` file contains:
- Full text from all books
- Chapter structure (37, 40, and 32 chapters identified)
- Metadata (page counts, word counts, etc.)
- CAIA exam information (topics, dates, fees, pass rates, etc.)
- Exam level mapping for each book

```python
import json

# Load the searchable index
with open('extracted_text/searchable_index.json', 'r', encoding='utf-8') as f:
    index = json.load(f)

# Access exam information
if 'exam_information' in index:
    exam_info = index['exam_information']
    print(f"Level I Topics: {exam_info['curriculum']['level_1_topics']}")

# Access a specific book
for book in index['books']:
    print(f"Book: {book['title']}")
    print(f"Exam Level: {book.get('exam_level', 'Unknown')}")
    print(f"Chapters: {len(book['chapters']) if book['chapters'] else 'N/A'}")
    
    # Access chapters
    if book['chapters']:
        for chapter in book['chapters']:
            print(f"  Chapter {chapter['number']}: {chapter['title']}")
            # Use chapter['content'] for quiz generation
```

### Option 2: Use Individual Text Files

Each PDF has been extracted to a separate `.txt` file with page markers:

```
--- Page 1 ---
[content]
--- Page 2 ---
[content]
...
```

### Option 3: Use the Lightweight Index

For faster loading (without full text), use `index_metadata.json`:

```python
import json

with open('extracted_text/index_metadata.json', 'r', encoding='utf-8') as f:
    metadata = json.load(f)

# Then load specific text files as needed
for book in metadata['books']:
    with open(book['text_file'], 'r', encoding='utf-8') as f:
        text = f.read()
    # Process text for quiz generation
```

## Practice Questions

Two comprehensive sets of practice questions are available:

### 1. `CAIA_PRACTICE_QUESTIONS.md`
- **Level I Questions**: 24 multiple-choice questions covering all Level I topics
- **Level II Questions**: 16 multiple-choice questions + 5 constructed response (essay) questions
- **Answers and Explanations**: Detailed explanations for all questions
- **Topic Coverage**: Questions organized by curriculum topics

### 2. `CAIA_DETAILED_PRACTICE_QUESTIONS.md` (NEW)
- **Level I Questions**: 10 additional multiple-choice questions with comprehensive explanations
- **Level II Questions**: 10 multiple-choice + 3 constructed response questions
- **Detailed Feedback**: 
  - ✅ Explanations when answers are correct
  - ❌ Explanations for why wrong answers are incorrect
  - 📝 Feedback for constructed response questions
- **Reasoning Behind Answers**: Each question includes detailed reasoning to help understand concepts deeply

**Note**: These are practice questions for study purposes, not actual CAIA exam questions. Actual past exam questions are copyrighted and not publicly available. For official sample exams, visit the [CAIA Association website](https://caia.org/content/sample-exam-level-i).

## Scripts

- `extract_pdf_text.py` - Extracts text from PDF files
- `create_searchable_index.py` - Creates structured indexes from extracted text
- `integrate_exam_info.py` - Integrates exam information with the indexes

## Requirements

```bash
pip install pdfplumber PyPDF2
```

Or use the provided `requirements.txt`:

```bash
pip install -r requirements.txt
```

## Re-extracting Text

If you need to re-extract text from the PDFs:

```bash
python3 extract_pdf_text.py
python3 create_searchable_index.py
```

## Notes

- Text extraction preserves page boundaries for reference
- Chapters are automatically detected where possible
- All text is UTF-8 encoded
- The searchable index includes full text for easy searching and quiz generation
- Exam information is sourced from official CAIA Association websites and updated as of January 2025
- Books are automatically mapped to exam levels (Level I or Level II) based on their titles