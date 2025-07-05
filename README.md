# DevoverFlow

DevoverFlow (sometimes referred to as DevOverflow in the UI) is a community-driven Q&A platform for developers, inspired by Stack Overflow but with modern features and a focus on both doubt clarification and knowledge sharing.

## Purpose

The platform aims to become the go-to space for developers seeking help, clarifying doubts, and sharing programming knowledge. It creates a collaborative and supportive environment for users of all experience levels.

## Main Features

- **Ask & Answer Questions:** Users can post programming questions, provide answers, and clarify doubts.
- **Tagging System:** Questions can be tagged for better categorization and easier search.
- **Voting:** Community-driven voting system for questions and answers to highlight the best content.
- **Comments:** Threaded comments for in-depth discussions on questions and answers.
- **User Profiles:** Each user has a profile displaying reputation, activity, and contributions.
- **Image Uploads:** Attach images to questions and answers for better clarity.
- **Real-Time AI Models Showcase:** Highlights top AI models and their response times.
- **Search Functionality:** Users can search for questions, tags, and users.
- **Help Center:** Includes FAQs, platform guidelines, and contact options.

## Example Pages

- **Homepage:** Welcomes users, highlights the platform's purpose, and showcases top AI models.
- **Ask Question:** Intuitive form with tag validation (max 5 tags, each at least 2 characters).
- **Question Detail:** View, answer, comment, edit, and vote on questions; shows answer and comment threading.
- **About Page:** Describes the mission, vision, and team.
- **Careers Page:** Lists open positions and describes company culture.

## Technologies Used

- **Frontend:** React, TypeScript, React Router, Tailwind CSS, React Hook Form, Zod validation
- **Backend:** Node.js, Express, MongoDB (Mongoose ORM)
- **Other:** RESTful API, Lucide React icons
- **Cloud:** Image uploads via public cloud storage (details in server code)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/indrareddy15/DevoverFlow.git
   cd DevoverFlow
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or for backend and frontend separately
   cd server && npm install
   cd ../client && npm install
   ```

3. **Run the development servers:**
   - For the backend:
     ```sh
     cd server
     npm run dev
     ```
   - For the frontend:
     ```sh
     cd client
     npm start
     ```

4. **Configure Environment Variables:**
   - Add necessary environment variables for database and cloud storage (see server/README or `.env.example` if available).

## Contributing

Contributions are welcome! Please open issues and submit pull requests to help improve the platform.

## License

*No license specified yet.*

---

Inspired by Stack Overflow, built by and for developers!
