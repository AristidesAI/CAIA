#!/usr/bin/env python3
"""
Create a searchable index and structured format from extracted PDF text.
This makes it easier to generate quizzes from the content.
"""

import json
import re
from pathlib import Path
from collections import defaultdict


def extract_chapters(text):
    """Try to identify chapter boundaries in the text."""
    # Common chapter patterns
    chapter_patterns = [
        r'Chapter\s+(\d+)[:\.]?\s+(.+)',
        r'CHAPTER\s+(\d+)[:\.]?\s+(.+)',
        r'Chapter\s+(\d+)',
        r'CHAPTER\s+(\d+)',
    ]
    
    chapters = []
    lines = text.split('\n')
    current_chapter = None
    current_content = []
    
    for i, line in enumerate(lines):
        # Check if this line matches a chapter pattern
        is_chapter = False
        for pattern in chapter_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                # Save previous chapter if exists
                if current_chapter:
                    chapters.append({
                        'number': current_chapter['number'],
                        'title': current_chapter['title'],
                        'content': '\n'.join(current_content).strip(),
                        'start_line': current_chapter['start_line']
                    })
                
                # Start new chapter
                chapter_num = match.group(1) if match.groups() else None
                chapter_title = match.group(2) if len(match.groups()) > 1 else None
                current_chapter = {
                    'number': chapter_num,
                    'title': chapter_title or f'Chapter {chapter_num}',
                    'start_line': i
                }
                current_content = []
                is_chapter = True
                break
        
        if not is_chapter:
            current_content.append(line)
    
    # Add last chapter
    if current_chapter:
        chapters.append({
            'number': current_chapter['number'],
            'title': current_chapter['title'],
            'content': '\n'.join(current_content).strip(),
            'start_line': current_chapter['start_line']
        })
    
    return chapters


def create_searchable_index(extracted_text_dir):
    """Create a searchable index from all extracted text files."""
    index = {
        'books': [],
        'total_pages': 0,
        'total_words': 0,
        'total_characters': 0
    }
    
    # Load metadata
    metadata_path = Path(extracted_text_dir) / 'extraction_metadata.json'
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    # Process each book
    for pdf_name, book_meta in metadata.items():
        text_file = Path(extracted_text_dir) / Path(book_meta['text_file']).name
        
        if not text_file.exists():
            continue
        
        print(f"Processing: {pdf_name}...")
        
        # Read text content
        with open(text_file, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Try to extract chapters
        chapters = extract_chapters(text)
        
        # Create book entry
        book_entry = {
            'title': pdf_name.replace('.pdf', ''),
            'filename': pdf_name,
            'text_file': str(text_file),
            'pages': book_meta.get('page_count', 0),
            'words': book_meta.get('word_count', 0),
            'characters': book_meta.get('character_count', 0),
            'chapters': chapters if chapters else None,
            'full_text': text  # Keep full text for search
        }
        
        index['books'].append(book_entry)
        index['total_pages'] += book_meta.get('page_count', 0)
        index['total_words'] += book_meta.get('word_count', 0)
        index['total_characters'] += book_meta.get('character_count', 0)
        
        print(f"  ✓ Processed {book_meta.get('page_count', 0)} pages")
        if chapters:
            print(f"  ✓ Found {len(chapters)} chapters")
    
    # Save searchable index
    index_path = Path(extracted_text_dir) / 'searchable_index.json'
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Searchable index created: {index_path}")
    
    # Also create a lighter version without full text (for faster loading)
    light_index = {
        'books': [
            {
                'title': book['title'],
                'filename': book['filename'],
                'text_file': book['text_file'],
                'pages': book['pages'],
                'words': book['words'],
                'characters': book['characters'],
                'chapters': book['chapters']
            }
            for book in index['books']
        ],
        'total_pages': index['total_pages'],
        'total_words': index['total_words'],
        'total_characters': index['total_characters']
    }
    
    light_index_path = Path(extracted_text_dir) / 'index_metadata.json'
    with open(light_index_path, 'w', encoding='utf-8') as f:
        json.dump(light_index, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Light index created: {light_index_path}")
    
    return index


if __name__ == '__main__':
    extracted_dir = Path('extracted_text')
    if not extracted_dir.exists():
        print("Error: extracted_text directory not found. Run extract_pdf_text.py first.")
        exit(1)
    
    create_searchable_index(extracted_dir)
