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
  
  interface RoleplaySession {
    id: string;
    mateId: string;
    scenarioId: string;
    userRole: string;
    mateRole: string;
  }
  
  const aiMates: AIMate[] = [
    {
      id: 'mate1',
      name: 'Sarah',
      avatar: 'sarah.jpg',
      background: 'Marketing professional',
      personality: 'Friendly and outgoing',
      specialties: ['Business English', 'Small Talk', 'Presentations'],
      level: 'Intermediate'
    },
    {
      id: 'mate2',
      name: 'Dr. Chen',
      avatar: 'dr_chen.jpg',
      background: 'University professor',
      personality: 'Patient and knowledgeable',
      specialties: ['Academic English', 'Debates', 'Research Discussions'],
      level: 'Advanced'
    },
    // Add more AI mates...
  ];
  
  const scenarios: Scenario[] = [
    {
      id: 'scen1',
      title: 'Job Interview',
      description: 'Practice answering common job interview questions',
      category: 'Professional',
      subcategory: 'Job Search',
      difficulty: 'Intermediate',
      tags: ['interview', 'career', 'formal']
    },
    {
      id: 'scen2',
      title: 'Ordering at a Restaurant',
      description: 'Learn how to order food and interact with wait staff',
      category: 'Daily Life',
      subcategory: 'Dining Out',
      difficulty: 'Beginner',
      tags: ['food', 'casual conversation', 'service']
    },
    // Add more scenarios...
  ];
  
  function createRoleplaySession(mateId: string, scenarioId: string): RoleplaySession {
    return {
      id: `session-${Date.now()}`,
      mateId,
      scenarioId,
      userRole: 'To be determined',
      mateRole: 'To be determined'
    };
  }
  
  export { aiMates, scenarios, createRoleplaySession };
  export type { AIMate, Scenario, RoleplaySession };