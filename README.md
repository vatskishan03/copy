CopyIt - Real-time Text Sharing Platform


CopyIt is a modern, real-time collaborative text sharing platform that allows users to create, share, and collaborate on text snippets with minimal friction. Perfect for quickly sharing code snippets, notes, or any text content across devices and with others.


Features

    ✨ No Account Required - Create and share snippets instantly
    🔄 Real-time Collaboration - Multiple users can edit the same snippet simultaneously
    🔑 Simple Token System - Share your content with a 5-character token
    🕒 Auto-Expiry - Snippets automatically expire after 24 hours
    🌓 Dark Mode Support - Easy on the eyes, day or night
    📱 Responsive Design - Works seamlessly on desktop and mobile
    🔒 Secure - Content is transmitted securely

Technology Stack

    Frontend

    React with TypeScript
    Tailwind CSS for styling
    Socket.IO client for real-time connections
    Vercel for hosting

    Backend

    Node.js with Express
    TypeScript
    PostgreSQL database with Prisma ORM
    Redis for caching
    Socket.IO for WebSockets
    Render for hosting

Getting Started

Prerequisites

    Node.js (v16 or later)
    npm or yarn
    PostgreSQL database
    Redis instance

    1. Clone the repository
       git clone https://github.com/yourusername/copyit.git
       cd copyit

    2. Install dependencies
       npm install
       cd client && npm install
       cd ../server && npm install
    
    3. Configure environment variables
       DATABASE_URL="your-postgres-connection-string"
       REDIS_HOST="your-redis-host"
       REDIS_PORT="your-redis-port"
       REDIS_PASSWORD="your-redis-password"
       PORT=3001
       CLIENT_URL="http://localhost:3000"
       NODE_ENV="development"

    4. Run migrations
       cd server
       npx prisma migrate dev

    5. Start development servers
       cd client
       npm run dev

       cd server
       npm start

How to Use

1. Create a snippet:
       Enter your text in the editor.
       Click "Create" to generate a unique token.

2. Share the token:
       Copy the generated token
       Share it with others who need access to your text

3. Join a collaboration:
       Enter the token in the "Join Collaboration" box
       Click "Receive" to load the content
       All connected users can edit in real-time

Contributing

    Contributions are welcome! Please feel free to submit a Pull Request.

License

    This project is licensed under the ISC License.
    
Creator

    Built by Kishan

