# Low Level Design (LLD) Document
## Clinic Management System

### 1. System Overview

The Clinic Management System is designed as a three-tier architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Business      │    │   Data          │
│   Layer         │    │   Logic Layer   │    │   Layer         │
│                 │    │                 │    │                 │
│   React Frontend│◄──►│   Express API   │◄──►│   MongoDB       │
│   (UI/UX)       │    │   (Controllers) │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Component Architecture

#### 2.1 Backend Components
       
**Server Layer (`server.js`)**
- Entry point for the application
- Middleware configuration (CORS, JSON parsing)
- Route registration
- Database connection initialization

**Route Layer (`routes/`)**
- URL mapping to controller functions
- HTTP method handling (GET, POST, PUT, DELETE)
- Request validation middleware

**Controller Layer (`controllers/`)**
- Business logic implementation
- Request/response handling
- Error management
- Data transformation

**Service Layer (`services/`)**
- Complex business operations
- Cross-controller functionality
- Data archiving and history management

**Model Layer (`models/`)**
- Database schema definitions
- Data validation rules
- Relationship mappings

**Middleware Layer (`middleware/`)**
- Authentication and authorization
- Request preprocessing
- Error handling

#### 2.2 Frontend Components

**App Component (`App.jsx`)**
- Main application wrapper
- Routing configuration
- Global state providers

**Page Components (`pages/`)**
- Route-specific UI components
- User interaction handling
- API integration

**Context Providers (`AuthContext.jsx`, `PatientContext.jsx`)**
- Global state management
- User session handling
- Data sharing between components

**API Integration (`api.js`)**
- HTTP client configuration
- Request/response interceptors
- Error handling

### 3. Database Design

#### 3.1 Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Patient   │    │Prescription │
│             │    │             │    │             │
│ _id         │    │ _id         │    │ _id         │
│ name        │    │ name        │    │ patient     │
│ email       │    │ age         │    │ doctor      │
│ password    │    │ gender      │    │ diagnosis   │
│ role        │    │ contact     │    │ medicines   │
│ timestamps  │    │ tokenNumber │    │ notes       │
└─────────────┘    │ visitHistory│    │ timestamps  │
                   └─────────────┘    └─────────────┘
                            │                 │
                            │                 │
                   ┌─────────────┐    ┌─────────────┐
                   │    Bill     │    │   History   │
                   │             │    │             │
                   │ _id         │    │ _id         │
                   │ billId      │    │ patient     │
                   │ amount      │    │ bill        │
                   │ status      │    │ prescription│
                   │ patient     │    │ archivedAt  │
                   │ timestamps  │    │ timestamps  │
                   └─────────────┘    └─────────────┘
```

#### 3.2 Schema Details

**User Schema**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['doctor', 'receptionist']),
  timestamps: { createdAt, updatedAt }
}
```

**Patient Schema**
```javascript
{
  name: String (required),
  age: Number (required),
  gender: String (enum: ['male', 'female', 'other']),
  contact: {
    phone: String,
    email: String,
    address: String
  },
  tokenNumber: Number (required, unique),
  visitHistory: [{
    date: Date,
    doctor: ObjectId (ref: 'User'),
    notes: String,
    prescription: ObjectId (ref: 'Prescription')
  }],
  timestamps: { createdAt, updatedAt }
}
```

**Prescription Schema**
```javascript
{
  patient: ObjectId (ref: 'Patient', required),
  patientName: String (required),
  doctor: ObjectId (ref: 'User', required),
  diagnosis: String (required),
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
  }],
  notes: String,
  timestamps: { createdAt, updatedAt }
}
```

**Bill Schema**
```javascript
{
  billId: String (required, unique),
  amount: Number (required),
  issueDate: Date (required),
  status: String (enum: ['pending', 'paid', 'failed']),
  patient: ObjectId (ref: 'Patient', required),
  patientName: String (required),
  timestamps: { createdAt, updatedAt }
}
```

**History Schema**
```javascript
{
  patient: {
    _id: ObjectId (required),
    name: String (required),
    age: Number (required),
    gender: String (required),
    contact: Object,
    tokenNumber: Number (required)
  },
  bill: {
    billId: String (required),
    amount: Number (required),
    paymentDate: Date (required),
    status: String (required)
  },
  prescription: {
    prescriptionId: ObjectId (required),
    diagnosis: String (required),
    medicines: Array,
    notes: String,
    doctor: ObjectId (ref: 'User')
  },
  archivedAt: Date (default: current time),
  timestamps: { createdAt, updatedAt }
}
```

### 4. API Design

#### 4.1 Authentication Endpoints

**POST /api/auth/signup**
```javascript
Request: {
  name: String,
  email: String,
  password: String,
  role: String
}
Response: {
  message: String,
  user?: Object
}
```

**POST /api/auth/login**
```javascript
Request: {
  email: String,
  password: String
}
Response: {
  token: String,
  user: {
    id: String,
    name: String,
    email: String,
    role: String
  }
}
```

#### 4.2 Patient Management Endpoints

**GET /api/patients**
```javascript
Headers: { Authorization: "Bearer <token>" }
Response: [Patient]
```

**POST /api/patients**
```javascript
Headers: { Authorization: "Bearer <token>" }
Request: {
  name: String,
  age: Number,
  gender: String,
  contact: Object,
  tokenNumber: Number
}
Response: Patient
```

#### 4.3 Token Management Endpoints

**GET /api/tokens/generate**
```javascript
Headers: { Authorization: "Bearer <token>" }
Response: { token: Number }
```

**GET /api/tokens**
```javascript
Headers: { Authorization: "Bearer <token>" }
Response: [{ name: String, tokenNumber: Number, createdAt: Date }]
```

#### 4.4 Prescription Management Endpoints

**POST /api/prescriptions**
```javascript
Headers: { Authorization: "Bearer <token>" }
Request: {
  patient: ObjectId,
  patientName: String,
  diagnosis: String,
  medicines: Array,
  notes: String
}
Response: Prescription
```

#### 4.5 Billing Endpoints

**POST /api/bills**
```javascript
Headers: { Authorization: "Bearer <token>" }
Request: {
  patient: ObjectId,
  amount: Number
}
Response: Bill
```

**POST /api/bills/:id/pay**
```javascript
Headers: { Authorization: "Bearer <token>" }
Request: {
  billId: String,
  amount: Number
}
Response: {
  clientSecret: String,
  paymentIntentId: String,
  requiresAction: Boolean
}
```

### 5. Security Implementation

#### 5.1 Authentication Flow

1. **User Registration**
   - Password hashing with bcrypt (salt rounds: 10)
   - Email uniqueness validation
   - Role validation (doctor/receptionist only)

2. **User Login**
   - Password verification against hashed password
   - JWT token generation with user ID and role
   - Token expiration: 24 hours

3. **Request Authentication**
   - JWT token verification middleware
   - Role-based access control
   - Token refresh mechanism

#### 5.2 Authorization Matrix

| Endpoint | Doctor | Receptionist |
|----------|--------|--------------|
| GET /api/patients | ✅ | ✅ |
| POST /api/patients | ❌ | ✅ |
| GET /api/prescriptions | ✅ | ✅ |
| POST /api/prescriptions | ✅ | ❌ |
| GET /api/bills | ✅ | ✅ |
| POST /api/bills | ❌ | ✅ |
| POST /api/bills/:id/pay | ❌ | ✅ |
| GET /api/tokens/generate | ❌ | ✅ |

#### 5.3 Data Validation

**Input Sanitization**
- XSS prevention through input validation
- SQL injection prevention (MongoDB ODM)
- Request size limiting

**Output Encoding**
- HTML entity encoding for user-generated content
- JSON response sanitization

### 6. Error Handling Strategy

#### 6.1 Error Categories

**Client Errors (4xx)**
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate data)

**Server Errors (5xx)**
- 500: Internal Server Error (unexpected errors)
- 503: Service Unavailable (database connection issues)

#### 6.2 Error Response Format

```javascript
{
  message: String,
  error?: String,
  code?: String,
  timestamp: Date
}
```

#### 6.3 Error Logging

- Console logging for development
- Structured error logging for production
- Error tracking and monitoring

### 7. Performance Optimization

#### 7.1 Database Optimization

**Indexing Strategy**
```javascript
// User collection
{ email: 1 } // Unique index for login queries

// Patient collection
{ tokenNumber: 1 } // Unique index for token generation
{ name: 1 } // Index for patient search

// Bill collection
{ billId: 1 } // Unique index for bill lookup
{ status: 1 } // Index for status-based queries
{ patient: 1 } // Index for patient-based queries

// Prescription collection
{ patient: 1 } // Index for patient-based queries
{ doctor: 1 } // Index for doctor-based queries
```

**Query Optimization**
- Selective field projection
- Pagination for large datasets
- Aggregation pipelines for complex queries

#### 7.2 API Optimization

**Caching Strategy**
- Response caching for static data
- Token validation caching
- Database query result caching

**Compression**
- Gzip compression for API responses
- Static asset compression

### 8. Scalability Considerations

#### 8.1 Horizontal Scaling

**Load Balancing**
- Multiple server instances
- Round-robin load distribution
- Health check endpoints

**Database Scaling**
- MongoDB replica sets
- Read/write separation
- Connection pooling

#### 8.2 Vertical Scaling

**Resource Optimization**
- Memory usage monitoring
- CPU utilization tracking
- Database connection limits

### 9. Monitoring and Logging

#### 9.1 Application Monitoring

**Metrics Collection**
- Request/response times
- Error rates
- Database query performance
- Memory usage

**Health Checks**
- Database connectivity
- External service availability
- Application status endpoints

#### 9.2 Logging Strategy

**Log Levels**
- ERROR: System errors and exceptions
- WARN: Warning conditions
- INFO: General information
- DEBUG: Detailed debugging information

**Log Format**
```javascript
{
  timestamp: Date,
  level: String,
  message: String,
  userId: String,
  requestId: String,
  metadata: Object
}
```

### 10. Deployment Strategy

#### 10.1 Environment Configuration

**Development Environment**
- Local MongoDB instance
- Development API keys
- Debug logging enabled

**Production Environment**
- Cloud MongoDB (MongoDB Atlas)
- Production API keys
- Structured logging
- Error monitoring

#### 10.2 Deployment Pipeline

**Build Process**
- Code compilation and bundling
- Asset optimization
- Environment-specific configuration

**Deployment Process**
- Automated deployment scripts
- Health check verification
- Rollback procedures

### 11. Future Enhancements

#### 11.1 Technical Improvements

**Real-time Features**
- WebSocket integration for live updates
- Push notifications
- Real-time chat between users

**Advanced Features**
- Report generation
- Data analytics dashboard
- Mobile application
- Offline capability

#### 11.2 Scalability Improvements

**Microservices Architecture**
- Service decomposition
- API gateway implementation
- Service discovery

**Cloud-Native Features**
- Container orchestration
- Auto-scaling
- Multi-region deployment

---

This LLD document provides a comprehensive technical foundation for the Clinic Management System, ensuring maintainability, scalability, and security while meeting all functional requirements.
