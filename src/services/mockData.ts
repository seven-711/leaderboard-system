export interface Department {
    id: string;
    name: string;
    logo: string; // URL or emoji for now
    color: string;
    wins: number;
    losses: number;
    points: number;
    support_count: number; // For "Cheer" feature
}

export interface Game {
    id: string;
    type: string; // e.g., "Basketball", "Esports"
    departmentA_id: string;
    departmentB_id: string;
    scoreA: number;
    scoreB: number;
    status: "upcoming" | "live" | "completed";
    startTime: string; // ISO string
    currentPeriod?: string; // e.g., "Q1", "Set 3", "Halftime"
    gameClock?: string; // e.g., "12:00", "Final"
}

export const MOCK_DEPARTMENTS: Department[] = [
    { id: "dept_1", name: "Engineering Eagles", logo: "🦅", color: "#FFD700", wins: 5, losses: 2, points: 15, support_count: 120 },
    { id: "dept_2", name: "Business Bulls", logo: "🐂", color: "#C0C0C0", wins: 4, losses: 3, points: 12, support_count: 95 },
    { id: "dept_3", name: "Arts Artists", logo: "🎨", color: "#FF69B4", wins: 3, losses: 4, points: 9, support_count: 150 },
    { id: "dept_4", name: "Science Scorpions", logo: "🦂", color: "#00CED1", wins: 6, losses: 1, points: 18, support_count: 80 },
    { id: "dept_5", name: "Tech Titans", logo: "🤖", color: "#8A2BE2", wins: 2, losses: 5, points: 6, support_count: 200 },
];

export const MOCK_GAMES: Game[] = [
    { id: "game_1", type: "Basketball", departmentA_id: "dept_1", departmentB_id: "dept_2", scoreA: 85, scoreB: 82, status: "completed", startTime: "2024-03-01T10:00:00Z" },
    { id: "game_2", type: "Volleyball", departmentA_id: "dept_3", departmentB_id: "dept_4", scoreA: 1, scoreB: 3, status: "completed", startTime: "2024-03-01T14:00:00Z" },
    { id: "game_3", type: "Esports (Valorant)", departmentA_id: "dept_5", departmentB_id: "dept_1", scoreA: 12, scoreB: 10, status: "live", startTime: "2024-03-02T09:00:00Z" }, // Currently Live
    { id: "game_4", type: "Soccer", departmentA_id: "dept_2", departmentB_id: "dept_3", scoreA: 0, scoreB: 0, status: "upcoming", startTime: "2024-03-03T16:00:00Z" },
];

// Helper to simulate fetching data
export const getDepartments = async (): Promise<Department[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DEPARTMENTS]), 500));
};

export const getGames = async (): Promise<Game[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_GAMES]), 500));
};
