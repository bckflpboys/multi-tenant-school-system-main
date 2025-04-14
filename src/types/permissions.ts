export type UserRole = 
  | 'super_admin'      // System administrator who manages all schools
  | 'super_admin_staff' // Super admin support staff
  | 'school_admin'     // School principal/administrator
  | 'staff'           // School administrative staff
  | 'teacher'         // Regular teachers
  | 'student';        // Students

// Define permissions for each role
export const rolePermissions = {
  super_admin: [
    'manage_schools',
    'manage_super_admin_staff',
    'manage_system_settings',
    'view_all_schools',
    'view_analytics'
  ],
  super_admin_staff: [
    'view_all_schools',
    'view_analytics',
    'support_schools'
  ],
  school_admin: [
    'manage_staff',
    'manage_teachers',
    'manage_students',
    'manage_classes',
    'manage_subjects',
    'view_school_analytics',
    'manage_school_settings'
  ],
  staff: [
    'manage_students',
    'manage_attendance',
    'manage_grades',
    'view_classes',
    'view_subjects'
  ],
  teacher: [
    'manage_own_classes',
    'manage_grades',
    'manage_attendance',
    'view_students',
    'view_subjects'
  ],
  student: [
    'view_own_grades',
    'view_own_attendance',
    'view_own_schedule',
    'view_own_subjects'
  ]
} as const;

export type Permission = keyof typeof rolePermissions[UserRole];

export type Feature = {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'standard' | 'teacher_ai' | 'student_ai';
  enabled: boolean;
  price?: string;  // For AI features
};

export interface SchoolSubscription {
  schoolId: string;
  tier: 'basic' | 'standard' | 'teacher_ai' | 'student_ai';
  features: {
    [key: string]: boolean;  // Feature ID to enabled/disabled status
  };
  customFeatures?: {
    [key: string]: boolean;  // Custom features enabled for this specific school
  };
}

export const FEATURES: { [key: string]: Feature } = {
  // Basic Features
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'School system overview',
    tier: 'basic',
    enabled: true,
  },
  schools: {
    id: 'schools',
    name: 'Schools Management',
    description: 'Manage multiple schools',
    tier: 'basic',
    enabled: true,
  },
  principals: {
    id: 'principals',
    name: 'Principals Management',
    description: 'Manage school principals',
    tier: 'basic',
    enabled: true,
  },
  classes: {
    id: 'classes',
    name: 'Class Management',
    description: 'Manage school classes and schedules',
    tier: 'basic',
    enabled: true,
  },
  grade_levels: {
    id: 'grade_levels',
    name: 'Grade Levels',
    description: 'Manage grade levels and sections',
    tier: 'basic',
    enabled: true,
  },
  subjects: {
    id: 'subjects',
    name: 'Subjects',
    description: 'Manage school subjects and curriculum',
    tier: 'basic',
    enabled: true,
  },
  lessons_timetables: {
    id: 'lessons_timetables',
    name: 'Lessons and Timetables',
    description: 'Manage lessons and school timetables',
    tier: 'basic',
    enabled: true,
  },
  students: {
    id: 'students',
    name: 'Student Management',
    description: 'Manage student records and information',
    tier: 'basic',
    enabled: true,
  },
  attendance: {
    id: 'attendance',
    name: 'Attendance Tracking',
    description: 'Track student and staff attendance',
    tier: 'basic',
    enabled: true,
  },
  homework: {
    id: 'homework',
    name: 'Homework Management',
    description: 'Manage and track student homework',
    tier: 'basic',
    enabled: true,
  },
  staff: {
    id: 'staff',
    name: 'Staff Management',
    description: 'Manage all school staff members',
    tier: 'basic',
    enabled: true,
  },
  teachers: {
    id: 'teachers',
    name: 'Teacher Management',
    description: 'Manage teaching staff',
    tier: 'basic',
    enabled: true,
  },
  parents: {
    id: 'parents',
    name: 'Parent Portal',
    description: 'Parent communication and access',
    tier: 'basic',
    enabled: true,
  },
  examinations: {
    id: 'examinations',
    name: 'Examination System',
    description: 'Manage examinations and assessments',
    tier: 'basic',
    enabled: true,
  },
  forms: {
    id: 'forms',
    name: 'Registration Forms',
    description: 'Create and manage registration and other forms',
    tier: 'basic',
    enabled: true,
  },

  // Standard Features
  website: {
    id: 'website',
    name: 'School Website',
    description: 'School website and website integration',
    tier: 'standard',
    enabled: true,
  },
  finances: {
    id: 'finances',
    name: 'Financial Management',
    description: 'Manage fees, payments and expenses',
    tier: 'standard',
    enabled: true,
  },
  discipline: {
    id: 'discipline',
    name: 'Discipline Management',
    description: 'Track and manage student conduct',
    tier: 'standard',
    enabled: true,
  },
  school_life: {
    id: 'school_life',
    name: 'School Life/Activities',
    description: 'Events, activities, and campus life',
    tier: 'standard',
    enabled: true,
  },
  analytics: {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Detailed insights and reporting',
    tier: 'standard',
    enabled: true,
  },
  messaging: {
    id: 'messaging',
    name: 'In-app Messaging',
    description: 'Internal messaging system',
    tier: 'standard',
    enabled: true,
  },
  blog: {
    id: 'blog',
    name: 'School Blog/Magazine',
    description: 'School news and announcements platform',
    tier: 'standard',
    enabled: true,
  },
  library: {
    id: 'library',
    name: 'Library System',
    description: 'Manage school library resources',
    tier: 'standard',
    enabled: true,
  },

  // Teacher AI Features (R8,000)
  ai_video_explainers: {
    id: 'ai_video_explainers',
    name: 'AI Video Explainers',
    description: 'Auto create AI video explainers for lessons',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },
  plagiarism_checker: {
    id: 'plagiarism_checker',
    name: 'Plagiarism Checker',
    description: 'Check student work for plagiarism',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },
  learning_style: {
    id: 'learning_style',
    name: 'Custom Learning Style',
    description: 'Customize learning styles for individual students',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },
  auto_quizzes: {
    id: 'auto_quizzes',
    name: 'Automatic Weekly Quizzes',
    description: 'Create automatic weekly quizzes based on uploaded content',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },
  lesson_planner: {
    id: 'lesson_planner',
    name: 'Lesson Plan Generator',
    description: 'AI-powered lesson plan generation',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },
  performance_predictions: {
    id: 'performance_predictions',
    name: 'Performance Predictions',
    description: 'AI-powered student performance predictions',
    tier: 'teacher_ai',
    enabled: true,
    price: 'R8,000'
  },

  // Student AI Features (R15,000)
  online_tutor: {
    id: 'online_tutor',
    name: 'Online AI Tutor',
    description: 'AI-powered online tutoring system',
    tier: 'student_ai',
    enabled: true,
    price: 'R15,000'
  },
  smart_alerts: {
    id: 'smart_alerts',
    name: 'Smart Alerts',
    description: 'Alert parents on decline of student performance',
    tier: 'student_ai',
    enabled: true,
    price: 'R15,000'
  }
};
