#!/usr/bin/env python3
"""
Extract text from CAIA PDF files for quiz creation.
"""

import os
import json
from pathlib import Path

try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False


def extract_with_pypdf2(pdf_path):
    """Extract text using PyPDF2."""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
    return text


def extract_with_pdfplumber(pdf_path):
    """Extract text using pdfplumber (better quality)."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
    return text


def extract_pdf_text(pdf_path):
    """Extract text from PDF using available library."""
    if HAS_PDFPLUMBER:
        return extract_with_pdfplumber(pdf_path)
    elif HAS_PYPDF2:
        return extract_with_pypdf2(pdf_path)
    else:
        raise ImportError("Neither pdfplumber nor PyPDF2 is installed. Please install one: pip install pdfplumber")


def main():
    """Extract text from all PDF files in the current directory."""
    # Find all PDF files
    pdf_files = list(Path('.').glob('*.pdf'))
    
    if not pdf_files:
        print("No PDF files found in the current directory.")
        return
    
    # Create output directory
    output_dir = Path('extracted_text')
    output_dir.mkdir(exist_ok=True)
    
    # Extract text from each PDF
    extracted_data = {}
    
    for pdf_path in pdf_files:
        print(f"Extracting text from: {pdf_path.name}...")
        try:
            text = extract_pdf_text(pdf_path)
            
            # Save as individual text file
            text_filename = pdf_path.stem + '.txt'
            text_path = output_dir / text_filename
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Store in dictionary for JSON output
            extracted_data[pdf_path.name] = {
                'filename': pdf_path.name,
                'text_file': str(text_path),
                'page_count': text.count('--- Page'),
                'character_count': len(text),
                'word_count': len(text.split())
            }
            
            print(f"  ✓ Extracted {extracted_data[pdf_path.name]['page_count']} pages")
            print(f"  ✓ Saved to: {text_path}")
            
        except Exception as e:
            print(f"  ✗ Error extracting {pdf_path.name}: {e}")
            extracted_data[pdf_path.name] = {
                'filename': pdf_path.name,
                'error': str(e)
            }
    
    # Save metadata as JSON
    metadata_path = output_dir / 'extraction_metadata.json'
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Extraction complete!")
    print(f"✓ Metadata saved to: {metadata_path}")
    print(f"\nText files are in: {output_dir}/")


if __name__ == '__main__':
    main()
