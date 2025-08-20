# Clinic Management System

A comprehensive healthcare management solution designed to streamline communication between doctors and receptionists, automate patient token generation, and maintain complete patient records with billing and prescription management.

## 🏥 Project Overview

The Clinic Management System is a web-based application that facilitates efficient clinic operations by providing role-based access for doctors and receptionists. The system automates token generation, manages patient information, handles prescriptions, and processes billing through secure payment gateways.

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Doctor/Receptionist)
- **Secure JWT authentication**
- **Password encryption** using bcrypt

### 👥 User Management
- **Doctor Dashboard**: View patients, create prescriptions, access patient history
- **Receptionist Dashboard**: Register patients, assign tokens, manage billing
- **Patient Registration**: Complete patient information capture

### 🎫 Token Management
- **Automatic token generation** with sequential numbering
- **Real-time token tracking**
- **Token history maintenance**

### 📋 Patient Management
- **Complete patient profiles** (name, age, gender, contact details)
- **Visit history tracking**
- **Medical record maintenance**

### 💊 Prescription Management
- **Digital prescription creation**
- **Medicine details** (name, dosage, frequency, duration)
- **Diagnosis and notes**
- **Prescription history**

### 💳 Billing System
- **Automated bill generation**
- **Stripe payment integration**
- **Payment status tracking**
- **Bill history maintenance**

### 📊 History & Records
- **Complete patient visit history**
- **Archived records management**
- **Searchable patient data**

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Stripe React** - Payment components

## 📁 Project Structure

```
Clinic-management-final/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── auth-controller.js    # Authentication logic
│   │   ├── bill-controller.js    # Billing operations
│   │   ├── history-controller.js # History management
│   │   ├── patient-controller.js # Patient operations
│   │   ├── prescription-controller.js # Prescription management
│   │   └── token-controller.js   # Token generation
│   ├── middleware/
│   │   └── auth-middleware.js    # Authentication middleware
│   ├── models/
│   │   ├── bill-model.js         # Bill schema
│   │   ├── history-model.js      # History schema
│   │   ├── patient-model.js      # Patient schema
│   │   ├── prescription-model.js # Prescription schema
│   │   └── user-model.js         # User schema
│   ├── routes/
│   │   ├── auth-routes.js        # Authentication routes
│   │   ├── bill-routes.js        # Billing routes
│   │   ├── history-routes.js     # History routes
│   │   ├── patient-routes.js     # Patient routes
│   │   ├── prescription-routes.js # Prescription routes
│   │   └── token-routes.js       # Token routes
│   ├── services/
│   │   └── history-service.js    # History archiving service
│   ├── utils/
│   │   └── timezone.js           # Timezone utilities
│   ├── package.json
│   └── server.js                 # Main server file
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── BillingDashboard.jsx    # Billing interface
    │   │   ├── Dashboard.jsx           # Main dashboard
    │   │   ├── DoctorDashboard.jsx     # Doctor interface
    │   │   ├── Login.jsx               # Login page
    │   │   ├── PatientRegistration.jsx # Patient registration
    │   │   ├── Signup.jsx              # Signup page
    │   │   └── TokenDashboard.jsx      # Token management
    │   ├── App.jsx                     # Main app component
    │   ├── AuthContext.jsx             # Authentication context
    │   ├── PatientContext.jsx          # Patient state management
    │   └── api.js                      # API integration
    ├── package.json
    └── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Clinic-management-final/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/Clinic-Management
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Tokens
- `GET /api/tokens` - Get all tokens
- `GET /api/tokens/generate` - Generate new token

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/:id` - Get prescription by ID
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `GET /api/bills/:id` - Get bill by ID
- `PUT /api/bills/:id` - Update bill
- `POST /api/bills/:id/pay` - Process payment
- `DELETE /api/bills/:id` - Delete bill

### History
- `GET /api/history` - Get patient history
- `GET /api/history/:id` - Get specific history record

## 👥 User Roles & Workflows

### Doctor Workflow
1. **Login** with doctor credentials
2. **View patient list** with assigned tokens
3. **Access patient details** and medical history
4. **Create prescriptions** with diagnosis and medicines
5. **Review patient history** for previous visits

### Receptionist Workflow
1. **Login** with receptionist credentials
2. **Generate tokens** for new patients
3. **Register patients** with complete information
4. **Create bills** for services rendered
5. **Process payments** through Stripe integration
6. **Manage patient records** and history

## 🔒 Security Features

- **JWT-based authentication** with role-based access
- **Password encryption** using bcrypt
- **Input validation** and sanitization
- **CORS protection** for cross-origin requests
- **Secure payment processing** via Stripe
- **Environment variable** management for sensitive data

## 📊 Database Schema

### User Model
- name, email, password, role (doctor/receptionist)

### Patient Model
- name, age, gender, contact details, tokenNumber, visitHistory

### Prescription Model
- patient, doctor, diagnosis, medicines array, notes

### Bill Model
- billId, amount, status, patient, issueDate

### History Model
- archived patient, bill, and prescription data

## 📈 Performance Optimization

### Backend Optimizations
- **Database indexing** on frequently queried fields
- **Pagination** for large datasets
- **Caching** for static data
- **Compression** middleware

### Frontend Optimizations
- **Code splitting** for better load times
- **Lazy loading** of components
- **Image optimization**
- **Bundle size optimization**

## 🚀 Deployment Strategy

### Local Development
- MongoDB local instance
- Node.js development server
- React development server

### Production Deployment
- **Backend**: Node.js on cloud platform (Heroku, AWS, etc.)
- **Database**: MongoDB Atlas or cloud MongoDB
- **Frontend**: Static hosting (Vercel, Netlify, etc.)
- **Payment**: Stripe production environment

### Environment Variables
- Separate configuration for development and production
- Secure storage of API keys and secrets
- Database connection strings

## 📝 Logging Strategy

### Current Implementation
- Console logging for debugging
- Error logging for exceptions
- Request/response logging

### Recommended Enhancements
- **Structured logging** with Winston or Bunyan
- **Log levels** (error, warn, info, debug)
- **Log rotation** and archiving
- **Centralized logging** for production

## 🔄 Future Enhancements

### Planned Features
- **Email notifications** for appointments
- **SMS integration** for reminders
- **Report generation** and analytics
- **Mobile app** development
- **Multi-clinic support**
- **Inventory management**

### Technical Improvements
- **Real-time updates** with WebSocket
- **Offline capability** with service workers
- **Advanced search** and filtering
- **Data export** functionality
- **Backup and recovery** systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- MongoDB for database solution
- Stripe for payment processing
- React team for frontend framework
- Express.js team for backend framework

---

**Note**: This is a demonstration project for educational purposes. For production use, additional security measures and compliance with healthcare regulations should be implemented.
