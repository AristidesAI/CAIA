# 🎓 CAIA Quiz Pro

<div align="center">

**A comprehensive, interactive quiz application for CAIA (Chartered Alternative Investment Analyst) exam preparation**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=for-the-badge&logo=github)](https://your-username.github.io/CAIA)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How the Quiz Works](#-how-the-quiz-works)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Data Sources](#-data-sources)
- [Technologies Used](#-technologies-used)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🎯 Overview

**CAIA Quiz Pro** is a modern, interactive web application designed to help candidates prepare for the Chartered Alternative Investment Analyst (CAIA) designation exams. The application provides:

- **60+ Practice Questions** covering both Level I and Level II topics
- **Interactive Quiz Interface** with real-time feedback and explanations
- **Performance Tracking** with detailed analytics by topic
- **Comprehensive Study Materials** extracted from official CAIA textbooks
- **Up-to-Date Exam Information** including topics, dates, fees, and pass rates

### 📊 Content Statistics

- **2,427 pages** of extracted study materials
- **536,717 words** from official CAIA textbooks
- **60+ practice questions** with detailed explanations
- **17 curriculum topics** across both exam levels
- **37+ chapters** automatically identified and indexed

---

## ✨ Features

### 🎮 Interactive Quiz System

- **Multiple Quiz Modes**
  - Level I only
  - Level II only
  - Mixed quiz (both levels)
  - Topic-specific quizzes

- **Real-Time Feedback**
  - ✅ Immediate correct/incorrect indicators
  - 📝 Detailed explanations for each answer
  - 💡 Reasoning for why other options are wrong

- **Progress Tracking**
  - Visual progress bar
  - Question navigator with status indicators
  - Timer to track study time

- **Performance Analytics**
  - Overall score percentage
  - Performance breakdown by topic
  - Correct/incorrect question counts
  - Time taken to complete quiz

### 📚 Comprehensive Study Materials

- **Extracted PDF Content**
  - CAIA Level I (2009) - 662 pages
  - CAIA Level II (2012) - 686 pages
  - CAIA Level II (2016) - 1,079 pages

- **Structured Data**
  - Searchable JSON indexes
  - Chapter-by-chapter organization
  - Topic-based categorization

### 📖 Practice Questions

- **Level I Questions** (34 questions)
  - CAIA Ethical Principles
  - Introduction to Alternative Investments
  - Real Assets
  - Private Equity
  - Private Debt
  - Hedge Funds
  - Digital Assets
  - Funds of Funds

- **Level II Questions** (26 questions)
  - CAIA Ethical Principles
  - Institutional Asset Owners
  - Asset Allocation
  - Risk and Risk Management
  - Methods and Models
  - Due Diligence and Selecting Managers
  - Volatility and Complex Strategies
  - Universal Investment Considerations
  - Emerging Topics

---

## 🎮 How the Quiz Works

### Starting a Quiz

1. **Select Your Level**
   - Click on "Level I" or "Level II" card to start a level-specific quiz
   - Or click "Start Mixed Quiz" for questions from both levels

2. **Topic Selection** (Optional)
   - When selecting a specific level, a modal appears
   - Choose which topics to include
   - Select all or customize your selection

3. **Quiz Interface**
   - Questions are presented one at a time
   - Select your answer by clicking on an option
   - Explanation appears immediately after selection
   - Navigate using Previous/Next buttons or question navigator

### Answering Questions

```
┌─────────────────────────────────────────┐
│  Question 5 of 20                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  Which of the following best describes │
│  the J-curve effect in private equity? │
│                                         │
│  ○ A) Immediate positive returns       │
│  ● B) Initial negative returns         │
│     C) Linear return pattern           │
│     D) Consistent returns               │
│                                         │
│  ✅ Correct!                            │
│  The J-curve describes the typical     │
│  pattern where early returns are...    │
└─────────────────────────────────────────┘
```

### Reviewing Results

After completing a quiz, you'll see:

1. **Score Overview**
   - Circular progress ring showing percentage
   - Total correct/incorrect counts
   - Time taken

2. **Performance by Topic**
   - Visual bars showing accuracy per topic
   - Color-coded (green ≥70%, yellow ≥50%, red <50%)

3. **Question Review**
   - Click any question to review
   - See your answer vs. correct answer
   - Read explanations again

4. **Actions Available**
   - Review All Answers (goes through all questions)
   - Retake Quiz (same questions, reshuffled)
   - New Quiz (return to home)

### Keyboard Shortcuts

- `←` Arrow Left: Previous question
- `→` Arrow Right: Next question
- `1-4` Number keys: Select answer option A-D

---

## 🌐 Live Demo

The application is hosted on GitHub Pages and can be accessed at:

**🔗 [View Live Demo](https://your-username.github.io/CAIA)**

> **Note:** Replace `your-username` with your actual GitHub username in the URL above.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.9+ (for running extraction scripts)
- Git (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/CAIA.git
   cd CAIA
   ```

2. **Install Python dependencies** (for text extraction scripts)
   ```bash
   pip install -r requirements.txt
   ```

3. **Open the application**
   - Simply open `index.html` in your web browser, or
   - Serve it using a local web server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     
     # Using PHP
     php -S localhost:8000
     ```

4. **Access the application**
   - Open `http://localhost:8000` in your browser

### For GitHub Pages Deployment

1. Push the repository to GitHub
2. Go to Settings → Pages
3. Select the main branch as source
4. The site will be available at `https://your-username.github.io/CAIA`

---

## 📁 Project Structure

```
CAIA/
├── index.html                          # Main application HTML
├── css/
│   ├── main.css                        # Base styles and design system
│   ├── components.css                  # Reusable component styles
│   └── quiz.css                        # Quiz-specific styles
├── js/
│   └── quiz.js                         # Main application logic
├── data/
│   └── questions/
│       └── questions.json              # Question database (60+ questions)
├── extracted_text/                     # Extracted study materials
│   ├── *.txt                          # Extracted text files
│   ├── searchable_index.json          # Full searchable index
│   ├── index_metadata.json            # Lightweight metadata index
│   └── caia_exam_info.json            # Exam information database
├── CAIA_PRACTICE_QUESTIONS.md          # Practice questions set 1
├── CAIA_DETAILED_PRACTICE_QUESTIONS.md # Practice questions set 2
├── extract_pdf_text.py                # PDF text extraction script
├── create_searchable_index.py         # Index creation script
├── integrate_exam_info.py             # Exam info integration script
├── requirements.txt                    # Python dependencies
└── README.md                          # This file
```

---

## 📚 Data Sources

### Study Materials

The application includes extracted text from:

1. **CAIA Level I** (2009, Wiley)
   - 662 pages, 131,656 words
   - Introduction to Core Topics in Alternative Investments

2. **CAIA Level II** (2012, Wiley)
   - 686 pages, 164,079 words
   - Advanced Core Topics in Alternative Investments

3. **CAIA Level II** (2016, Wiley)
   - 1,079 pages, 240,982 words
   - Alternative Investments: CAIA Level II

### Exam Information

- **Source**: Official CAIA Association website (caia.org)
- **Last Updated**: January 2025
- **Includes**: Topics, exam dates, fees, pass rates, study recommendations

### Practice Questions

- **Source**: Modeled after CAIA exam format based on publicly available curriculum
- **Note**: These are practice questions, not actual exam questions
- **Coverage**: All major topics from both exam levels

---

## 🛠️ Technologies Used

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS custom properties
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Font Awesome** - Icons (via SVG)

### Backend/Data Processing

- **Python 3.9+** - Text extraction and data processing
- **pdfplumber** - PDF text extraction
- **PyPDF2** - Alternative PDF processing

### Data Format

- **JSON** - Structured data storage
- **Markdown** - Documentation and practice questions

### Hosting

- **GitHub Pages** - Static site hosting

---

## 📖 Usage Guide

### For Students

1. **Start with Level I** if you're new to CAIA
2. **Take topic-specific quizzes** to focus on weak areas
3. **Review explanations** carefully to understand concepts
4. **Track your progress** using the performance analytics
5. **Use the extracted materials** for deeper study

### For Developers

#### Extracting New PDF Content

```bash
# Extract text from PDFs
python3 extract_pdf_text.py

# Create searchable index
python3 create_searchable_index.py

# Integrate exam information
python3 integrate_exam_info.py
```

#### Adding New Questions

1. Open `data/questions/questions.json`
2. Add a new question object following this format:

```json
{
  "id": 61,
  "level": 1,
  "topic": "Private Equity",
  "question": "Your question text here?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswer": 0,
  "explanation": "Detailed explanation here.",
  "wrongAnswerExplanations": {
    "0": "Why option A is wrong",
    "1": "Why option B is wrong",
    "2": "Why option C is wrong"
  }
}
```

3. Save the file - changes will appear immediately

#### Customizing Styles

- **Colors**: Edit CSS custom properties in `css/main.css`
- **Components**: Modify `css/components.css`
- **Quiz UI**: Adjust `css/quiz.css`

---

## 🔧 Development

### Running Locally

```bash
# Clone repository
git clone https://github.com/your-username/CAIA.git
cd CAIA

# Install dependencies
pip install -r requirements.txt

# Serve locally
python -m http.server 8000

# Open browser
open http://localhost:8000
```

### Building for Production

The application is already optimized for production:

- No build step required
- Vanilla JavaScript (no transpilation needed)
- Static assets only
- Works offline after initial load

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

1. **Add More Questions**
   - Follow the question format in `data/questions/questions.json`
   - Ensure explanations are clear and educational

2. **Improve Explanations**
   - Enhance existing question explanations
   - Add more detailed reasoning

3. **Fix Bugs**
   - Report issues via GitHub Issues
   - Submit pull requests with fixes

4. **Enhance Features**
   - Suggest new features
   - Implement UI/UX improvements

5. **Update Content**
   - Keep exam information current
   - Add new topics as curriculum evolves

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

**Important Legal Notice:**

- This application contains **practice questions** modeled after the CAIA exam format
- These are **NOT actual CAIA exam questions**
- Actual CAIA exam questions are **copyrighted and confidential**
- This project is **not affiliated with** or endorsed by the CAIA Association
- For official sample questions and study materials, visit [caia.org](https://caia.org)

**Educational Purpose Only:**

This application is intended solely for educational and study purposes. Users should supplement this tool with:
- Official CAIA curriculum materials
- Official CAIA sample exams
- Approved study guides and prep courses
- Professional exam preparation services

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note on PDF Content:**

The extracted text from CAIA textbooks is provided for educational purposes. The original PDFs remain the property of their respective copyright holders (Wiley, CAIA Association). Users are responsible for ensuring their use complies with applicable copyright laws.

---

## 📞 Support & Resources

### Official CAIA Resources

- **CAIA Association**: [caia.org](https://caia.org)
- **Sample Exams**: [caia.org/content/sample-exam-level-i](https://caia.org/content/sample-exam-level-i)
- **Registration**: [caia.org/registration-and-fees](https://caia.org/registration-and-fees)
- **Curriculum**: [caia.org/curriculum-study-tools](https://caia.org/curriculum-study-tools)

### Study Recommendations

- **Study Time**: 200-250 hours per level
- **Preparation**: Use official materials + practice questions
- **Timeline**: 12-18 months to complete both levels
- **Pass Rates**: Level I ~48%, Level II ~62% (March 2025)

---

## 🎯 Roadmap

Future enhancements planned:

- [ ] Question difficulty levels
- [ ] Study mode (unlimited attempts)
- [ ] Flashcard feature
- [ ] Progress tracking across sessions
- [ ] Export results to PDF
- [ ] Mobile app version
- [ ] More practice questions (target: 200+)
- [ ] AI-powered question generation

---

## 🙏 Acknowledgments

- **CAIA Association** for providing the curriculum framework
- **Wiley** for publishing comprehensive study materials
- **Open source community** for tools and libraries
- **Contributors** who help improve this project

---

<div align="center">

**Made with ❤️ for CAIA candidates**

[⭐ Star this repo](https://github.com/your-username/CAIA) | [🐛 Report Bug](https://github.com/your-username/CAIA/issues) | [💡 Request Feature](https://github.com/your-username/CAIA/issues)

**Good luck with your CAIA exam preparation! 🎓**

</div>
