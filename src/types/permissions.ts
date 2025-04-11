export type UserRole = 
  | 'super_admin'      // System administrator who manages all schools
  | 'school_admin'     // School principal/administrator
  | 'admin_staff'      // Administrative staff (registrar, accountant, etc.)
  | 'head_teacher'     // Department heads or senior teachers
  | 'teacher'          // Regular teachers
  | 'student'          // Students
  | 'parent'           // Parents/guardians
  | 'librarian'        // Library staff
  | 'counselor'        // School counselor
  | 'nurse';           // School nurse/medical staff

export type Feature = {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  enabled: boolean;
};

export interface SchoolSubscription {
  schoolId: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  features: {
    [key: string]: boolean;  // Feature ID to enabled/disabled status
  };
  customFeatures?: {
    [key: string]: boolean;  // Custom features enabled for this specific school
  };
}

export const FEATURES: { [key: string]: Feature } = {
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
  lessons: {
    id: 'lessons',
    name: 'Lesson Planning',
    description: 'Create and manage lesson plans',
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
    tier: 'standard',
    enabled: true,
  },
  finances: {
    id: 'finances',
    name: 'Financial Management',
    description: 'Manage fees, payments and expenses',
    tier: 'premium',
    enabled: true,
  },
  examinations: {
    id: 'examinations',
    name: 'Examination System',
    description: 'Advanced examination and assessment tools',
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
    name: 'School Life',
    description: 'Events, activities, and campus life',
    tier: 'standard',
    enabled: true,
  },
  blog: {
    id: 'blog',
    name: 'School Blog',
    description: 'School news and announcements platform',
    tier: 'premium',
    enabled: true,
  },
  advanced_analytics: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed insights and reporting',
    tier: 'enterprise',
    enabled: true,
  },
  api_access: {
    id: 'api_access',
    name: 'API Access',
    description: 'Access to school system API',
    tier: 'enterprise',
    enabled: true,
  },
};
