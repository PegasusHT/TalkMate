interface AIMate {
    id: string;
    name: string;
    avatar: string;
    background: string;
    personality: string;
    specialties: string[];
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  
  interface Scenario {
    id: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
  }

  interface ScenarioDetails {
    id: number;
    title: string;
    description: string;
    aiRole: {
      name: string;
      role: string;
      traits: string | string[];
      image: string;
      backgroundImage: string;
    };
    userRole: string;
    objectives: string[];
    usefulPhrases: {
      phrase: string;
      pronunciation: string;
    }[];
  }
  
  interface RoleplaySession {
    id: string;
    mateId: string;
    scenarioId: string;
    userRole: string;
    mateRole: string;
  }
  
  function createRoleplaySession(mateId: string, scenarioId: string): RoleplaySession {
    return {
      id: `session-${Date.now()}`,
      mateId,
      scenarioId,
      userRole: 'To be determined',
      mateRole: 'To be determined'
    };
  }
  
  export { createRoleplaySession };
  export type { AIMate, Scenario,ScenarioDetails, RoleplaySession };