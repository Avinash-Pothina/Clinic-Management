# System Architecture Document
## Clinic Management System

### 1. Executive Summary

The Clinic Management System is designed as a modern, scalable web application following a three-tier architecture pattern. The system provides secure, role-based access for healthcare professionals while maintaining data integrity and ensuring compliance with healthcare data management standards.

### 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (Chrome, Firefox, Safari, Edge)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   React App     │  │   Responsive    │  │   Progressive   │ │
│  │   (SPA)         │  │   Design        │  │   Web App       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS/HTTP
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Load Balancer / Reverse Proxy (Nginx)                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Static Asset  │  │   SSL/TLS       │  │   Rate Limiting │ │
│  │   Serving       │  │   Termination   │  │   & Security    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ API Requests
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Node.js Application Server (Express.js)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   API Gateway   │  │   Business      │  │   Authentication│ │
│  │   & Routing     │  │   Logic         │  │   & Authorization│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Data          │  │   Error         │  │   Logging &      │ │
│  │   Validation    │  │   Handling      │  │   Monitoring    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Database Queries
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Database Cluster                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Primary       │  │   Secondary     │  │   Arbiter       │ │
│  │   Node          │  │   Nodes         │  │   Node          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ External API Calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Stripe        │  │   Email         │  │   SMS           │ │
│  │   Payment       │  │   Service       │  │   Service       │ │
│  │   Gateway       │  │   (Future)      │  │   (Future)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Component Architecture

#### 3.1 Frontend Architecture (React SPA)

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT APPLICATION                        │
├─────────────────────────────────────────────────────────────────┤
│  App.jsx (Root Component)                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Router        │  │   Context       │  │   Stripe        │ │
│  │   Configuration │  │   Providers     │  │   Elements      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PAGE COMPONENTS                          │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │   Login     │ │   Signup    │ │  Dashboard  │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │   Doctor    │ │  Receptionist│ │   Patient   │           │ │
│  │  │  Dashboard  │ │  Dashboard   │ │ Registration│           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  │  ┌─────────────┐ ┌─────────────┐                           │ │
│  │  │   Token     │ │   Billing   │                           │ │
│  │  │  Dashboard  │ │  Dashboard  │                           │ │
│  │  └─────────────┘ └─────────────┘                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2 Backend Architecture (Node.js/Express)

```
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                             │
├─────────────────────────────────────────────────────────────────┤
│  server.js (Entry Point)                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Middleware    │  │   Route         │  │   Database      │ │
│  │   Configuration │  │   Registration  │  │   Connection    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      ROUTE LAYER                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │   Auth      │ │   Patient   │ │   Token     │           │ │
│  │  │   Routes    │ │   Routes    │ │   Routes    │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │Prescription │ │   Bill      │ │   History   │           │ │
│  │  │   Routes    │ │   Routes    │ │   Routes    │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   CONTROLLER LAYER                          │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │   Auth      │ │   Patient   │ │   Token     │           │ │
│  │  │ Controller  │ │ Controller  │ │ Controller  │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │Prescription │ │   Bill      │ │   History   │           │ │
│  │  │ Controller  │ │ Controller  │ │ Controller  │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    SERVICE LAYER                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │   History   │ │   Payment   │ │   Email     │           │ │
│  │  │   Service   │ │   Service   │ │   Service   │           │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Data Flow Architecture

#### 4.1 Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Frontend  │    │   Backend   │    │  Database   │
│             │    │             │    │             │    │             │
│ 1. Login    │───►│ 2. Form     │───►│ 3. Validate │───►│ 4. Check    │
│   Request   │    │  Validation │    │  Credentials│    │  User Data  │
│             │    │             │    │             │    │             │
│             │    │             │    │             │    │             │
│ 8. Store    │◄───│ 7. Store    │◄───│ 6. Generate │◄───│ 5. Return   │
│   Token     │    │   Token     │    │   JWT Token │    │  User Info  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 4.2 Patient Registration Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Receptionist│    │   Frontend  │    │   Backend   │    │  Database   │
│             │    │             │    │             │    │             │
│ 1. Enter    │───►│ 2. Validate │───►│ 3. Generate │───►│ 4. Create   │
│   Patient   │    │  Form Data  │    │  Token      │    │  Patient    │
│   Details   │    │             │    │             │    │  Record     │
│             │    │             │    │             │    │             │
│ 6. View     │◄───│ 5. Display  │◄───│ 4. Return   │◄───│ 4. Return   │
│   Success   │    │  Success    │    │  Patient    │    │  Created    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 4.3 Prescription Creation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Doctor    │    │   Frontend  │    │   Backend   │    │  Database   │
│             │    │             │    │             │    │             │
│ 1. Select   │───►│ 2. Load     │───►│ 3. Fetch    │───►│ 4. Return   │
│   Patient   │    │  Patient    │    │  Patient    │    │  Patient    │
│             │    │  Details    │    │  Data       │    │  Data       │
│             │    │             │    │             │    │             │
│ 5. Create   │───►│ 6. Validate │───►│ 7. Create   │───►│ 8. Save     │
│  Prescription│    │  Prescription│    │  Prescription│    │  Prescription│
│             │    │             │    │             │    │             │
│ 10. View    │◄───│ 9. Display  │◄───│ 8. Return   │◄───│ 8. Return   │
│   Success   │    │  Success    │    │  Prescription│    │  Created    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 4.4 Payment Processing Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Receptionist│    │   Frontend  │    │   Backend   │    │   Stripe    │
│             │    │             │    │             │    │             │
│ 1. Create   │───►│ 2. Validate │───►│ 3. Create   │───►│ 4. Process  │
│   Bill      │    │  Bill Data  │    │  Bill       │    │  Payment    │
│             │    │             │    │             │    │             │
│             │    │             │    │             │    │             │
│ 6. Process  │───►│ 7. Stripe   │───►│ 8. Create   │───►│ 9. Return   │
│   Payment   │    │  Elements   │    │  Payment    │    │  Payment    │
│             │    │             │    │  Intent     │    │  Intent     │
│             │    │             │    │             │    │             │
│ 11. Confirm │◄───│ 10. Handle  │◄───│ 9. Update   │◄───│ 9. Webhook  │
│   Payment   │    │  Payment    │    │  Bill Status│    │  Notification│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 5. Security Architecture

#### 5.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Network       │  │   Application   │  │   Data          │ │
│  │   Security      │  │   Security      │  │   Security      │ │
│  │                 │  │                 │  │                 │ │
│  │ • HTTPS/TLS     │  │ • JWT Auth      │  │ • Encryption    │ │
│  │ • Firewall      │  │ • Input Val.    │  │ • Access Control│ │
│  │ • Rate Limiting │  │ • CORS          │  │ • Audit Logging │ │
│  │ • DDoS Protection│ │ • XSS Prevention│ │ • Backup        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│  1. User Login Request                                          │
│     ↓                                                           │
│  2. Credential Validation                                       │
│     ↓                                                           │
│  3. Password Verification (bcrypt)                              │
│     ↓                                                           │
│  4. JWT Token Generation                                        │
│     ↓                                                           │
│  5. Token Storage (Client)                                      │
│     ↓                                                           │
│  6. Request Authentication (Middleware)                         │
│     ↓                                                           │
│  7. Role-Based Authorization                                    │
│     ↓                                                           │
│  8. Resource Access Control                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Scalability Architecture

#### 6.1 Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    HORIZONTAL SCALING                           │
├─────────────────────────────────────────────────────────────────┤
│  Load Balancer (Nginx/HAProxy)                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   App Server    │  │   App Server    │  │   App Server    │ │
│  │   Instance 1    │  │   Instance 2    │  │   Instance N    │ │
│  │                 │  │                 │  │                 │ │
│  │ • Node.js       │  │ • Node.js       │  │ • Node.js       │ │
│  │ • Express       │  │ • Express       │  │ • Express       │ │
│  │ • Stateless     │  │ • Stateless     │  │ • Stateless     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    DATABASE CLUSTER                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │   Primary   │  │  Secondary  │  │  Secondary  │         │ │
│  │  │   Node      │  │   Node 1    │  │   Node 2    │         │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 6.2 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                        CACHING LAYER                            │
├─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Application   │  │   Database      │  │   CDN           │ │
│  │   Cache         │  │   Cache         │  │   Cache         │ │
│  │                 │  │                 │  │                 │ │
│  │ • Session Data  │  │ • Query Results │  │ • Static Assets │ │
│  │ • User Data     │  │ • Indexes       │  │ • Images        │ │
│  │ • Token Cache   │  │ • Aggregations  │  │ • CSS/JS        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 7. Deployment Architecture

#### 7.1 Development Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Frontend      │  │   Backend       │  │   Database      │ │
│  │   Development   │  │   Development   │  │   Local         │ │
│  │                 │  │                 │  │                 │ │
│  │ • React Dev     │  │ • Node.js Dev   │  │ • MongoDB       │ │
│  │ • Vite HMR      │  │ • Nodemon       │  │ • Local Data    │ │
│  │ • Localhost:5173│  │ • Localhost:5000│  │ • Localhost:27017│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 7.2 Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                       │
├─────────────────────────────────────────────────────────────────┤
│  CDN (Cloudflare/AWS CloudFront)                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Static Assets │  │   API Gateway   │  │   Load Balancer │ │
│  │   Distribution  │  │   (AWS API GW)  │  │   (AWS ALB)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    APPLICATION TIER                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │   EC2       │  │   EC2       │  │   EC2       │         │ │
│  │  │ Instance 1  │  │ Instance 2  │  │ Instance N  │         │ │
│  │  │             │  │             │  │             │         │ │
│  │  │ • Node.js   │  │ • Node.js   │  │ • Node.js   │         │ │
│  │  │ • Express   │  │ • Express   │  │ • Express   │         │ │
│  │  │ • PM2       │  │ • PM2       │  │ • PM2       │         │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      DATA TIER                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │ MongoDB     │  │ Redis       │  │ AWS S3      │         │ │
│  │  │ Atlas       │  │ Cache       │  │ Storage     │         │ │
│  │  │             │  │             │  │             │         │ │
│  │  │ • Primary   │  │ • Session   │  │ • Files     │         │ │
│  │  │ • Secondary │  │ • Cache     │  │ • Backups   │         │ │
│  │  │ • Arbiter   │  │ • Queues    │  │ • Logs      │         │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 8. Monitoring & Observability

#### 8.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      MONITORING STACK                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Application   │  │   Infrastructure│  │   Business      │ │
│  │   Monitoring    │  │   Monitoring    │  │   Metrics       │ │
│  │                 │  │                 │  │                 │ │
│  │ • New Relic     │  │ • CloudWatch    │  │ • Custom        │ │
│  │ • APM           │  │ • EC2 Metrics   │  │ • Dashboards    │ │
│  │ • Error Tracking│  │ • RDS Metrics   │  │ • KPI Tracking  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Logging       │  │   Alerting      │  │   Tracing       │ │
│  │   System        │  │   System        │  │   System        │ │
│  │                 │  │                 │  │                 │ │
│  │ • Winston       │  │ • PagerDuty     │  │ • Jaeger        │ │
│  │ • ELK Stack     │  │ • Slack         │  │ • Distributed   │ │
│  │ • Centralized   │  │ • Email         │  │ • Tracing       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 9. Disaster Recovery

#### 9.1 Backup Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      BACKUP STRATEGY                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Database      │  │   Application   │  │   Configuration │ │
│  │   Backups       │  │   Backups       │  │   Backups       │ │
│  │                 │  │                 │  │                 │ │
│  │ • Daily Full    │  │ • Code Version  │  │ • Environment   │ │
│  │ • Hourly Incre. │  │ • Container     │  │ • Variables     │ │
│  │ • Point-in-time │  │ • Images        │  │ • Secrets       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 9.2 Recovery Procedures

1. **Database Recovery**
   - Restore from latest backup
   - Point-in-time recovery
   - Data consistency verification

2. **Application Recovery**
   - Redeploy from version control
   - Restore configuration
   - Health check verification

3. **Infrastructure Recovery**
   - Cloud provider failover
   - Load balancer reconfiguration
   - DNS updates

### 10. Performance Optimization

#### 10.1 Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser caching and service workers
- **CDN**: Static asset distribution

#### 10.2 Backend Optimization

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression for responses

### 11. Compliance & Standards

#### 11.1 Healthcare Compliance

- **HIPAA Compliance**: Patient data protection
- **Data Encryption**: At rest and in transit
- **Access Controls**: Role-based permissions
- **Audit Logging**: Complete activity tracking

#### 11.2 Security Standards

- **OWASP Guidelines**: Web application security
- **ISO 27001**: Information security management
- **GDPR Compliance**: Data protection regulations
- **PCI DSS**: Payment card security (for Stripe)

### 12. Future Architecture Considerations

#### 12.1 Microservices Migration

```
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│  API Gateway (Kong/AWS API Gateway)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Auth          │  │   Patient       │  │   Billing       │ │
│  │   Service       │  │   Service       │  │   Service       │ │
│  │                 │  │                 │  │                 │ │
│  │ • Authentication│  │ • Patient Mgmt  │  │ • Payment Proc. │ │
│  │ • Authorization │  │ • Token Mgmt    │  │ • Invoice Gen.  │ │
│  │ • User Mgmt     │  │ • History       │  │ • Reports       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Prescription  │  │   Notification  │  │   Analytics     │ │
│  │   Service       │  │   Service       │  │   Service       │ │
│  │                 │  │                 │  │                 │ │
│  │ • Prescription  │  │ • Email         │  │ • Reports       │ │
│  │ • Medicine Mgmt │  │ • SMS           │  │ • Dashboards    │ │
│  │ • Diagnosis     │  │ • Push Notif.   │  │ • Insights      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 12.2 Container Orchestration

- **Kubernetes**: Container orchestration
- **Docker**: Containerization
- **Helm**: Package management
- **Istio**: Service mesh

---

This System Architecture document provides a comprehensive overview of the Clinic Management System's technical design, ensuring scalability, security, and maintainability while meeting all functional and non-functional requirements.
