backend/
├─ node_modules/
├─ config/
│   └─ db.js                  # MongoDB connection
├─ controllers/
│   ├─ authController.js      # login, register
│   ├─ ticketController.js    # CRUD for tickets
│   └─ chatController.js      # chat messages
├─ middleware/
│   ├─ authMiddleware.js      # verify JWT, protect routes
│   └─ roleMiddleware.js      # role-based access control
├─ models/
│   ├─ User.js                # User schema
│   ├─ Ticket.js              # Ticket schema
│   └─ Chat.js                # Chat schema
├─ routes/
│   ├─ authRoutes.js          # login/register routes
│   ├─ ticketRoutes.js        # ticket CRUD routes
│   └─ chatRoutes.js          # chat routes
├─ utils/
│   └─ generateToken.js       # JWT token generation
├─ .env                       # environment variables (DB URI, JWT secret)
├─ server.js                  # main server entry
├─ package.json
└─ package-lock.json
