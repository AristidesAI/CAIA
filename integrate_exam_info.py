#!/usr/bin/env python3
"""
Integrate CAIA exam information with the extracted text index.
"""

import json
from pathlib import Path


def integrate_exam_info():
    """Add exam information to the searchable index."""
    # Load exam info
    exam_info_path = Path('extracted_text/caia_exam_info.json')
    with open(exam_info_path, 'r', encoding='utf-8') as f:
        exam_info = json.load(f)
    
    # Load searchable index
    index_path = Path('extracted_text/searchable_index.json')
    with open(index_path, 'r', encoding='utf-8') as f:
        index = json.load(f)
    
    # Add exam info to index
    index['exam_information'] = exam_info
    index['exam_info_file'] = str(exam_info_path)
    
    # Map books to exam levels based on titles
    for book in index['books']:
        title_lower = book['title'].lower()
        if 'level i' in title_lower or 'level 1' in title_lower:
            book['exam_level'] = 'Level I'
            book['topics'] = exam_info['curriculum']['level_1_topics']
        elif 'level ii' in title_lower or 'level 2' in title_lower:
            book['exam_level'] = 'Level II'
            book['topics'] = exam_info['curriculum']['level_2_topics']
        else:
            book['exam_level'] = 'Unknown'
    
    # Save updated index
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Exam information integrated into searchable_index.json")
    
    # Also update lightweight index
    light_index_path = Path('extracted_text/index_metadata.json')
    with open(light_index_path, 'r', encoding='utf-8') as f:
        light_index = json.load(f)
    
    light_index['exam_information'] = exam_info
    light_index['exam_info_file'] = str(exam_info_path)
    
    for book in light_index['books']:
        title_lower = book['title'].lower()
        if 'level i' in title_lower or 'level 1' in title_lower:
            book['exam_level'] = 'Level I'
            book['topics'] = exam_info['curriculum']['level_1_topics']
        elif 'level ii' in title_lower or 'level 2' in title_lower:
            book['exam_level'] = 'Level II'
            book['topics'] = exam_info['curriculum']['level_2_topics']
        else:
            book['exam_level'] = 'Unknown'
    
    with open(light_index_path, 'w', encoding='utf-8') as f:
        json.dump(light_index, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Exam information integrated into index_metadata.json")


if __name__ == '__main__':
    integrate_exam_info()
