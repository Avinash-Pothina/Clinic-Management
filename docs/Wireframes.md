# Wireframes Document
## Clinic Management System

### 1. Overview

This document provides wireframe designs for the Clinic Management System user interface, showcasing the layout, navigation, and user experience for both doctor and receptionist roles.

### 2. Login Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLINIC MANAGEMENT SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                    🏥 Clinic Management                        │
│                                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     LOGIN FORM                              │ │
│  │                                                             │ │
│  │  Email: [________________________]                          │ │
│  │                                                             │ │
│  │  Password: [____________________]                           │ │
│  │                                                             │ │
│  │  [        Login        ]                                    │ │
│  │                                                             │ │
│  │  Don't have an account? [Sign Up]                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Clean, centered login form
- Email and password input fields
- Login button with proper styling
- Sign up link for new users
- Responsive design for mobile devices

### 3. Sign Up Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLINIC MANAGEMENT SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                    🏥 Create Account                           │ │
│                                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   REGISTRATION FORM                         │ │
│  │                                                             │ │
│  │  Name: [________________________]                          │ │
│  │                                                             │ │
│  │  Email: [________________________]                          │ │
│  │                                                             │ │
│  │  Password: [____________________]                           │ │
│  │                                                             │ │
│  │  Role: [Doctor ▼] [Receptionist ▼]                         │ │
│  │                                                             │ │
│  │  [        Sign Up        ]                                  │ │
│  │                                                             │ │
│  │  Already have an account? [Login]                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- User registration form
- Role selection dropdown
- Form validation
- Link back to login page

### 4. Main Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Dashboard | Doctor Dashboard | Logout          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Welcome, Dr. John Doe!                                         │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Quick Stats   │  │   Recent        │  │   Today's       │ │
│  │                 │  │   Patients      │  │   Schedule      │ │
│  │  Total Patients │  │                 │  │                 │ │
│  │      45         │  │  • Jane Smith   │  │  • 9:00 AM      │ │
│  │                 │  │  • John Doe     │  │  • 10:30 AM     │ │
│  │  Today's        │  │  • Mary Johnson │  │  • 2:00 PM      │ │
│  │  Appointments   │  │  • Bob Wilson   │  │  • 4:15 PM      │ │
│  │      8          │  │                 │  │                 │ │
│  │                 │  │  [View All]     │  │  [View All]     │ │
│  │  Pending        │  └─────────────────┘  └─────────────────┘ │
│  │  Prescriptions  │                                         │
│  │      3          │  ┌─────────────────────────────────────┐ │
│  └─────────────────┘  │         Quick Actions                │ │
│                       │                                       │ │
│  ┌─────────────────┐  │  [View Patients] [Create Prescription]│ │
│  │   System        │  │  [View History] [Generate Report]    │ │
│  │   Status        │  └─────────────────────────────────────┘ │
│  │                 │                                         │
│  │  ✅ Database     │                                         │
│  │  ✅ API Server   │                                         │
│  │  ✅ Payment      │                                         │
│  │     Gateway     │                                         │
│  └─────────────────┘                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Navigation bar with role-specific links
- Welcome message with user name
- Quick statistics cards
- Recent patients list
- Today's schedule
- Quick action buttons
- System status indicators

### 5. Doctor Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Dashboard | Doctor Dashboard | Logout          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Doctor Dashboard                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PATIENT LIST                             │ │
│  │                                                             │ │
│  │  Search: [________________________] [🔍]                    │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Token | Name          | Age | Gender | Status | Actions │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ 1     | Jane Smith    | 35  | Female | Waiting | [View] │ │ │
│  │  │ 2     | John Doe      | 42  | Male   | Waiting | [View] │ │ │
│  │  │ 3     | Mary Johnson  | 28  | Female | In Room | [View] │ │ │
│  │  │ 4     | Bob Wilson    | 55  | Male   | Waiting | [View] │ │ │
│  │  │ 5     | Sarah Brown   | 31  | Female | Waiting | [View] │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  [Previous] 1 2 3 4 5 [Next]                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   RECENT PRESCRIPTIONS                      │ │
│  │                                                             │ │
│  │  • Jane Smith - Common cold (2 hours ago)                  │ │
│  │  • John Doe - Hypertension (1 day ago)                     │ │
│  │  • Mary Johnson - Diabetes check (2 days ago)              │ │
│  │                                                             │ │
│  │  [View All Prescriptions]                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Patient list with search functionality
- Token numbers for queue management
- Patient status indicators
- Action buttons for each patient
- Pagination for large lists
- Recent prescriptions section

### 6. Patient Details View

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Dashboard | Doctor Dashboard | Logout          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Patient Details - Jane Smith (Token #1)                    │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Personal      │  │   Contact       │  │   Medical       │ │
│  │   Information   │  │   Information   │  │   History       │ │
│  │                 │  │                 │  │                 │ │
│  │  Name: Jane     │  │  Phone: 987-    │  │  • Common cold  │ │
│  │     Smith       │  │     654-3210    │  │    (2 months ago)│ │
│  │                 │  │                 │  │                 │ │
│  │  Age: 35        │  │  Email: jane@   │  │  • Annual check │ │
│  │                 │  │     email.com   │  │    (6 months ago)│ │
│  │  Gender: Female │  │                 │  │                 │ │
│  │                 │  │  Address: 123   │  │  • Vaccination  │ │
│  │  Token: #1      │  │     Main St     │  │    (1 year ago) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   CREATE PRESCRIPTION                       │ │
│  │                                                             │ │
│  │  Diagnosis: [________________________________]               │ │
│  │                                                             │ │
│  │  Medicines:                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Name: [Paracetamol] Dosage: [500mg] Frequency: [6h]    │ │ │
│  │  │ Duration: [5 days] Notes: [Take with food]             │ │ │
│  │  │ [Add Medicine]                                          │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  Notes: [________________________________]                   │ │
│  │                                                             │ │
│  │  [Save Prescription] [Cancel]                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Patient information display
- Medical history section
- Prescription creation form
- Medicine addition interface
- Save and cancel actions

### 7. Receptionist Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Token Dashboard | Register Patient | Billing   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Receptionist Dashboard                                      │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Token         │  │   Today's       │  │   Pending       │ │
│  │   Management    │  │   Patients      │  │   Bills         │ │
│  │                 │  │                 │  │                 │ │
│  │  Current Token: │  │  • Token #1 -   │  │  • Bill #001 -  │ │
│  │      5          │  │    Jane Smith   │  │    ₹1500        │ │
│  │                 │  │  • Token #2 -   │  │  • Bill #002 -  │ │
│  │  [Generate      │  │    John Doe     │  │    ₹2000        │ │
│  │   Next Token]   │  │  • Token #3 -   │  │  • Bill #003 -  │ │
│  │                 │  │    Mary Johnson │  │    ₹1200        │ │
│  │  [Call Next     │  │                 │  │                 │ │
│  │   Patient]      │  │  [View All]     │  │  [View All]     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   QUICK ACTIONS                             │ │
│  │                                                             │ │
│  │  [Register New Patient] [Generate Bill] [Process Payment]   │ │
│  │  [View Patient History] [Generate Report] [System Status]   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Token management interface
- Current token display
- Generate next token button
- Call next patient functionality
- Today's patients list
- Pending bills section
- Quick action buttons

### 8. Patient Registration Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Token Dashboard | Register Patient | Billing   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Register New Patient                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   PATIENT REGISTRATION                      │ │
│  │                                                             │ │
│  │  Personal Information:                                      │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Name: [________________________]                        │ │ │
│  │  │                                                         │ │ │
│  │  │ Age: [__] Gender: [Male ▼] [Female ▼] [Other ▼]        │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  Contact Information:                                       │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Phone: [________________]                               │ │ │
│  │  │                                                         │ │ │
│  │  │ Email: [________________________]                       │ │ │
│  │  │                                                         │ │ │
│  │  │ Address: [________________________________]              │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  Token Information:                                         │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Auto-generated Token: [6]                               │ │ │
│  │  │ [Generate New Token]                                    │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  [Register Patient] [Cancel]                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Comprehensive patient information form
- Auto-generated token number
- Form validation
- Generate new token option
- Register and cancel actions

### 9. Billing Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Token Dashboard | Register Patient | Billing   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Billing Management                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    BILLS LIST                               │ │
│  │                                                             │ │
│  │  Search: [________________________] [🔍]                    │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Bill ID | Patient | Amount | Status | Date | Actions   │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ BILL-001| Jane S. | ₹1500  | Pending| Today| [Pay] [Edit]│ │ │
│  │  │ BILL-002| John D. | ₹2000  | Paid  | Today| [View] [Edit]│ │ │
│  │  │ BILL-003| Mary J. | ₹1200  | Failed| Today| [Retry] [Edit]│ │ │
│  │  │ BILL-004| Bob W.  | ₹1800  | Pending| Today| [Pay] [Edit]│ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  [Previous] 1 2 3 4 5 [Next]                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Create New    │  │   Payment       │  │   Reports       │ │
│  │     Bill        │  │   History       │  │                 │ │
│  │                 │  │                 │  │                 │ │
│  │  [Create Bill]  │  │  • Today: ₹4500 │  │  • Daily Report │ │
│  │                 │  │  • Week: ₹15,200│  │  • Weekly Report│ │
│  │                 │  │  • Month: ₹45,800│ │  • Monthly Report│ │
│  │                 │  │                 │  │                 │ │
│  │                 │  │  [View All]     │  │  [Generate]     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Bills list with search functionality
- Bill status indicators
- Action buttons for each bill
- Payment history summary
- Report generation options
- Create new bill functionality

### 10. Payment Processing Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Token Dashboard | Register Patient | Billing   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Process Payment - Bill #001                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   BILL DETAILS                              │ │
│  │                                                             │ │
│  │  Patient: Jane Smith                                        │ │
│  │  Bill ID: BILL-001                                          │ │
│  │  Amount: ₹1500                                               │ │
│  │  Date: 2024-01-15                                           │ │
│  │  Status: Pending                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   PAYMENT FORM                              │ │
│  │                                                             │ │
│  │  Payment Method: [Credit Card ▼] [Debit Card ▼] [UPI ▼]    │ │
│  │                                                             │ │
│  │  Card Number: [________________]                            │ │
│  │                                                             │ │
│  │  Expiry Date: [MM/YY] CVV: [___]                            │ │
│  │                                                             │ │
│  │  Cardholder Name: [________________]                        │ │
│  │                                                             │ │
│  │  [Process Payment] [Cancel]                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   PAYMENT STATUS                            │ │
│  │                                                             │ │
│  │  ⏳ Processing payment...                                    │ │
│  │  ✅ Payment successful!                                      │ │
│  │  ❌ Payment failed. Please try again.                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Bill details display
- Payment method selection
- Credit card form
- Payment processing status
- Success/failure messages

### 11. Patient History View

```
┌─────────────────────────────────────────────────────────────────┐
│  Clinic System | Dashboard | Doctor Dashboard | Logout          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏥 Patient History - Jane Smith                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   VISIT HISTORY                             │ │
│  │                                                             │ │
│  │  Search: [________________________] [🔍]                    │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Date | Doctor | Diagnosis | Prescription | Bill | Status│ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ 2024-│ Dr.    │ Common    │ Paracetamol  │ ₹1500│ Paid  │ │ │
│  │  │ 01-15│ John   │ cold      │ 500mg        │      │       │ │ │
│  │  │      │ Doe    │           │ 6h x 5 days  │      │       │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ 2023-│ Dr.    │ Annual    │ Vitamins     │ ₹800 │ Paid  │ │ │
│  │  │ 12-20│ John   │ checkup   │ Supplements  │      │       │ │ │
│  │  │      │ Doe    │           │ Daily        │      │       │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │ 2023-│ Dr.    │ Vaccination│ Flu shot     │ ₹500 │ Paid  │ │ │
│  │  │ 11-10│ John   │            │              │      │       │ │ │
│  │  │      │ Doe    │            │              │      │       │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  [Previous] 1 2 3 4 5 [Next]                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   EXPORT OPTIONS                            │ │
│  │                                                             │ │
│  │  [Export to PDF] [Export to Excel] [Print Report]           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Complete visit history
- Search functionality
- Detailed visit information
- Export options
- Pagination for large histories

### 12. Mobile Responsive Design

#### 12.1 Mobile Login

```
┌─────────────────────────────────────┐
│         CLINIC MANAGEMENT           │
│                                     │
│                                     │
│           🏥 Login                  │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │         LOGIN FORM              │ │
│  │                                 │ │
│  │  Email: [________________]      │ │
│  │                                 │ │
│  │  Password: [________________]   │ │
│  │                                 │ │
│  │  [      Login      ]            │ │
│  │                                 │ │
│  │  [Sign Up]                      │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 12.2 Mobile Dashboard

```
┌─────────────────────────────────────┐
│  🏥 | ≡ Menu                        │
├─────────────────────────────────────┤
│                                     │
│  Welcome, Dr. John Doe!             │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │         Quick Stats             │ │
│  │                                 │ │
│  │  Patients: 45                   │ │
│  │  Today: 8                       │ │
│  │  Pending: 3                     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │       Quick Actions             │ │
│  │                                 │ │
│  │  [View Patients]                │ │
│  │  [Create Prescription]          │ │
│  │  [View History]                 │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 13. Design System

#### 13.1 Color Palette

- **Primary Blue**: #1E40AF (Navigation, buttons)
- **Secondary Blue**: #3B82F6 (Links, highlights)
- **Success Green**: #10B981 (Success messages)
- **Warning Orange**: #F59E0B (Warnings)
- **Error Red**: #EF4444 (Errors, delete actions)
- **Background**: #F8FAFC (Light gray)
- **Text**: #1F2937 (Dark gray)

#### 13.2 Typography

- **Headings**: Inter, Bold, 24px/20px/18px
- **Body Text**: Inter, Regular, 16px
- **Small Text**: Inter, Regular, 14px
- **Button Text**: Inter, Medium, 14px

#### 13.3 Component Styles

- **Buttons**: Rounded corners (8px), padding 12px 24px
- **Cards**: White background, shadow, rounded corners (12px)
- **Forms**: Clean inputs with focus states
- **Tables**: Striped rows, hover effects
- **Navigation**: Fixed top bar, responsive menu

### 14. User Experience Considerations

#### 14.1 Accessibility

- High contrast color combinations
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators for all interactive elements
- Alt text for images and icons

#### 14.2 Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly button sizes
- Optimized forms for mobile input
- Collapsible navigation for small screens

#### 14.3 Performance

- Fast loading times
- Optimized images and icons
- Efficient state management
- Smooth transitions and animations
- Progressive loading for large datasets

---

This wireframe document provides a comprehensive visual guide for the Clinic Management System's user interface, ensuring a consistent and user-friendly experience across all devices and user roles.
