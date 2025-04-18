# Multi-Tenant School System

A comprehensive school management system built with Next.js that supports multiple schools (multi-tenant architecture). The system provides different interfaces for administrators, teachers, and students.

## Features

- 🏫 Multi-tenant architecture supporting multiple schools
- 🔐 Secure authentication and authorization with role-based access (Super Admin, School Admin, Teacher, Student)
- 👥 User management with different roles and permissions
- 📊 Interactive dashboards with analytics and charts using Chart.js
- 📝 Complete student management system
- 👨‍🏫 Teacher management and scheduling
- 📚 Subject and class management
- 📅 Lesson scheduling and timetable generation
- 📋 Examination management with auto-generated exam codes
- ⚖️ Discipline record management
- 🗄️ MongoDB multi-tenant database architecture
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Responsive design for all devices
- 📄 PDF generation for reports and documents
- ☁️ AWS S3 integration for secure file storage

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **Authentication:** NextAuth.js with JWT
- **Database:** MongoDB with Mongoose
- **Forms:** React Hook Form, Zod validation
- **Charts:** Chart.js, React-chartjs-2
- **File Storage:** AWS S3
- **PDF Generation:** html2pdf.js, jsPDF
- **Icons:** Lucide React, React Icons
- **State Management:** React Hooks
- **API Integration:** RESTful APIs
- **Date Handling:** date-fns

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── middleware.ts    # Next.js middleware for auth and routing
├── models/          # MongoDB/Mongoose models
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_bucket_name
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Key Features Implementation

- **Multi-tenancy**: Each school has its own isolated data and user management
- **Authentication**: Implemented using NextAuth.js with credential provider
- **File Upload**: AWS S3 integration for secure file storage
- **PDF Generation**: Support for generating reports and documents
- **Charts**: Interactive data visualization using Chart.js
- **Form Validation**: Robust form handling with React Hook Form and Zod
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Deployment

The application can be deployed on any platform that supports Next.js applications. Vercel is recommended for the best integration experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
