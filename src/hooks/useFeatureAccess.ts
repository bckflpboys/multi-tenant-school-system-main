import { useEffect, useState } from 'react';
import type { SchoolSubscription, UserRole } from '@/types/permissions';
import { FEATURES } from '@/types/permissions';

interface UseFeatureAccessProps {
  userRole: UserRole;
  schoolId?: string;
  schoolSubscription?: SchoolSubscription;
}

export function useFeatureAccess({ 
  userRole, 
  schoolId, 
  schoolSubscription 
}: UseFeatureAccessProps) {
  const [accessibleFeatures, setAccessibleFeatures] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Super admin has access to everything
    if (userRole === 'super_admin') {
      const allFeatures = {
        dashboard: true,
        students: true,
        teachers: true,
        parents: true,
        staff: true,
        classes: true,
        lessons: true,
        examinations: true,
        discipline: true,
        finances: true,
        blog: true,
        messages: true,
        announcements: true,
        settings: true,
        school_life: true,
        grade_levels: true,
        subjects: true,
        schools: true,
      };
      
      setAccessibleFeatures(allFeatures);
      return;
    }

    // School admin access is based on subscription
    if (userRole === 'school_admin' && schoolSubscription) {
      const features = Object.keys(FEATURES).reduce((acc, key) => {
        const feature = FEATURES[key];
        
        // Check if feature is included in the school's subscription tier
        const isInTier = getTierLevel(schoolSubscription.tier) >= getTierLevel(feature.tier);
        
        // Check if feature is specifically enabled/disabled for this school
        const isEnabled = schoolSubscription.features[key] ?? isInTier;
        
        // Check for custom features
        const hasCustomAccess = schoolSubscription.customFeatures?.[key];
        
        acc[key] = hasCustomAccess ?? isEnabled;
        return acc;
      }, {} as { [key: string]: boolean });

      setAccessibleFeatures(features);
      return;
    }

    // Default to no access
    setAccessibleFeatures({});
  }, [userRole, schoolId, schoolSubscription]);

  return {
    hasAccess: (featureId: string) => accessibleFeatures[featureId] ?? false,
    accessibleFeatures,
  };
}

// Helper function to convert tier to numeric level
function getTierLevel(tier: string): number {
  const levels = {
    basic: 0,
    standard: 1,
    premium: 2,
    enterprise: 3,
  };
  return levels[tier as keyof typeof levels] ?? -1;
}
