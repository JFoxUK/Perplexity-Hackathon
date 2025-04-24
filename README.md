# Reverse Researcher

## 🎯 Project Overview
Reverse Researcher is an innovative research tool built for the Perplexity Hackathon 2025. Instead of starting with a question, users start with a conclusion and the tool uses Perplexity's Sonar API to find supporting and opposing evidence, creating a balanced view of any topic.

### 🌟 Key Features
- **Balanced Research**: Automatically finds both supporting and opposing evidence for any conclusion
- **Citation Support**: All evidence includes academic-style citations with links to sources
- **Follow-up Questions**: Users can ask follow-up questions to dive deeper into specific aspects
- **Multiple Research Angles**: Choose between balanced, support-only, or oppose-only views
- **Export Functionality**: Export your research results to PDF for easy sharing
- **Real-time Updates**: Leverages Perplexity's Sonar API for up-to-date information
- **Beautiful UI**: Modern, responsive interface with smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Perplexity API key ([Get it here](https://docs.perplexity.ai/docs/getting-started))

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd reverse-researcher
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```
4. Click the settings cog and add your API key

5. Enter your conclusion and choose support, opposed or balanced

6. Click research

7. Ask any questions for a general Q&A response via the follow-up questiosn section.

8. Refine and revise your conclusion statment

9. Export as a PDF for use else where!

## 🎮 How to Use

1. **Enter Your Conclusion**
   - Type any conclusion or hypothesis you want to research
   - Example: "Remote work improves productivity"

2. **Choose Research Angle**
   - Balanced: Shows both supporting and opposing evidence
   - Support Only: Shows only supporting evidence
   - Oppose Only: Shows only opposing evidence

3. **View Results**
   - Evidence is displayed with citations and source reliability assessments
   - Click on citation numbers to view source URLs
   - Each piece of evidence includes a reliability assessment

4. **Ask Follow-up Questions**
   - Use the follow-up question field for deeper investigation
   - Get targeted responses based on your specific queries

5. **Export Results**
   - Click "Export to PDF" to save your research
   - Includes all evidence, citations, and follow-up responses

## 🛠️ Technical Implementation

### Tech Stack
- React + Vite
- TailwindCSS for styling
- Perplexity Sonar API for research capabilities

### API Integration
The app uses Perplexity's Sonar API with the following features:
- Sonar Research Pro model for comprehensive analysis
- Real-time web search capabilities
- Citation tracking and verification
- Chain-of-thought reasoning for follow-up questions

### Code Structure
```
src/
├── app.jsx          # Main application component
├── index.css        # Global styles
└── components/      # UI components
```

## 🏆 Hackathon Category
This project is submitted in the **Research Tools** category, demonstrating innovative use of Perplexity's Sonar API for academic and professional research purposes.

## 🔑 API Usage
The application leverages Perplexity's Sonar API in several ways:
1. **Evidence Generation**: Uses the API to find and analyze relevant sources
2. **Citation Management**: Extracts and verifies citations from sources
3. **Follow-up Processing**: Handles follow-up questions with context awareness
4. **Source Reliability**: Assesses and reports on source credibility

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
This is a hackathon project, but suggestions and feedback are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 👥 Team
- [@JFoxUK](https://github.com/JFoxUK)

## 🎥 Demo Video
[Link to your 3-minute demo video] PLACEHOLDER

## 🔗 Links
- [Devpost Submission] PLACEHOLDER
- [Live Demo] PLACEHOLDER
- [Project Documentation] PLACEHOLDER