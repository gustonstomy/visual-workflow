# Visual Workflow Builder

A powerful visual automation workflow builder that allows you to create complex workflows without writing code. Build automation flows with triggers, data sources, logic blocks, and actions - all through an intuitive drag-and-drop interface.

![Visual Workflow Builder](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![React Flow](https://img.shields.io/badge/React%20Flow-Latest-purple)

## ✨ Features

- **🎨 Visual Canvas**: Drag-and-drop interface built with React Flow
- **🔌 Node Types**:
  - **Triggers**: Manual, Schedule (cron), Webhook
  - **Data Sources**: Weather API, GitHub, Google Calendar, HTTP requests
  - **Logic**: Filter, Transform, Conditional branching, AI/LLM processing
  - **Actions**: Email, SMS, Webhooks, Social media posting, Notifications
- **⚡ Smart Execution Engine**: Topological sorting for correct execution order
- **💾 Persistence**: SQLite database for workflow storage
- **🎯 Real-time Configuration**: Configure each node with a dynamic config panel
- **🔄 Data Flow**: Pass data between nodes seamlessly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd visual-workflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Creating Your First Workflow

1. Click **"Create Workflow"** from the workflows page
2. Give your workflow a name and description
3. You'll be taken to the visual editor

### Building a Workflow

1. **Add Nodes**: Drag nodes from the left panel onto the canvas
2. **Connect Nodes**: Click and drag from the bottom of one node to the top of another
3. **Configure Nodes**: Click on a node to open its configuration panel
   - Set parameters like API endpoints, email addresses, conditions, etc.
   - Give nodes custom labels
4. **Save**: Click the "Save" button in the top toolbar
5. **Execute**: Click "Run Workflow" to execute your automation

### Example Workflows

#### Daily Weather Briefing

```
Schedule (9:00 AM) → Weather Data (Location) → Email (Send report)
```

#### GitHub Activity Digest

```
Schedule (Weekly) → GitHub (Commits) → Transform → Email
```

#### Smart Notifications

```
Data Source → Filter (Condition) → Email/SMS/Notification
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional - for external integrations):

```env
# Email Service (for email actions)
RESEND_API_KEY=your_resend_api_key

# Weather API (for weather data nodes)
OPENWEATHER_API_KEY=your_openweather_api_key

# GitHub API (for GitHub data nodes)
GITHUB_TOKEN=your_github_personal_access_token

# OpenAI API (for AI logic nodes)
OPENAI_API_KEY=your_openai_api_key
```

**Note**: The application works without these API keys - it will use mock data and simulations. Add keys only for production use.

## 🏗️ Project Structure

```
visual-workflow/
├── app/
│   ├── api/                    # API routes
│   │   ├── workflows/         # Workflow CRUD endpoints
│   │   └── execute/           # Workflow execution endpoint
│   ├── workflows/             # Workflow pages
│   │   ├── page.tsx          # Workflow list
│   │   └── [id]/page.tsx     # Workflow editor
│   ├── page.tsx               # Landing page
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── workflow/              # Workflow-specific components
│       ├── canvas.tsx         # React Flow canvas
│       ├── node-palette.tsx   # Draggable node library
│       ├── custom-node.tsx    # Node component
│       └── node-config-panel.tsx  # Configuration panel
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── types.ts               # TypeScript types
│   └── execution/             # Execution engine
│       ├── engine.ts          # Core execution logic
│       └── executors/         # Node-specific executors
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
└── public/                    # Static assets
```

## 📊 Database Schema

The application uses SQLite with three main models:

- **Workflow**: Stores workflow metadata (name, description, active status)
- **Node**: Individual nodes in a workflow (type, subtype, config, position)
- **Connection**: Edges connecting nodes (source, target, handles)

## 🎯 Node Types Reference

### Triggers

| Type     | Description        | Configuration        |
| -------- | ------------------ | -------------------- |
| Manual   | Manually triggered | None                 |
| Schedule | Time-based (cron)  | Schedule type, time  |
| Webhook  | External webhook   | URL, method, headers |

### Data Sources

| Type     | Description              | Configuration              |
| -------- | ------------------------ | -------------------------- |
| Weather  | Fetch weather data       | Location, units            |
| GitHub   | Fetch commits/issues/PRs | Owner, repository, type    |
| Calendar | Google Calendar events   | Calendar ID                |
| HTTP     | Generic HTTP request     | URL, method, headers, body |

### Logic

| Type      | Description              | Configuration          |
| --------- | ------------------------ | ---------------------- |
| Filter    | Filter data              | Field, operator, value |
| Transform | Transform data structure | Transform expression   |
| Condition | Conditional branching    | Field, operator, value |
| AI        | LLM processing           | Prompt, model          |

### Actions

| Type         | Description         | Configuration     |
| ------------ | ------------------- | ----------------- |
| Email        | Send email          | To, subject, body |
| SMS          | Send SMS            | To, message       |
| Webhook      | POST to endpoint    | URL, payload      |
| Social       | Social media post   | Platform, message |
| Notification | System notification | Title, message    |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js 14](https://nextjs.org/)
- Visual workflow powered by [React Flow](https://reactflow.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database with [Prisma](https://www.prisma.io/) and SQLite

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for automation enthusiasts**
