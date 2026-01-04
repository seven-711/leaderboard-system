import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Department, type Game } from "./mockData";
import { supabase, type DbDepartment, type DbGame } from "../lib/supabase";

interface AppState {
    departments: Department[];
    games: Game[];
    liveGame: Game | null;
    loading: boolean;
    refreshData: () => Promise<void>;
    supportDepartment: (deptId: string) => Promise<void>;
    updateScore: (gameId: string, scoreA: number, scoreB: number, currentPeriod?: string, gameClock?: string) => Promise<void>;
    // Admin CRUD operations
    addDepartment: (dept: Omit<Department, 'id'>) => Promise<void>;
    updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
    deleteDepartment: (id: string) => Promise<void>;
    addGame: (game: Omit<Game, 'id'>) => Promise<void>;
    updateGame: (id: string, game: Partial<Game>) => Promise<void>;
    deleteGame: (id: string) => Promise<void>;
    uploadDepartmentLogo: (file: File) => Promise<string>;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Transform DB format to App format
const transformDepartment = (db: DbDepartment): Department => ({
    id: db.id,
    name: db.name,
    logo: db.logo,
    color: db.color,
    wins: db.wins,
    losses: db.losses,
    points: db.points,
    support_count: db.support_count,
});

const transformGame = (db: DbGame): Game => ({
    id: db.id,
    type: db.type,
    departmentA_id: db.department_a_id,
    departmentB_id: db.department_b_id,
    scoreA: db.score_a,
    scoreB: db.score_b,
    status: db.status,
    startTime: db.start_time,
    currentPeriod: db.current_period,
    gameClock: db.game_clock,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    const liveGame = games.find((g) => g.status === "live") || null;

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [deptRes, gameRes] = await Promise.all([
                supabase.from('departments').select('*').order('points', { ascending: false }),
                supabase.from('games').select('*').order('start_time', { ascending: false })
            ]);

            if (deptRes.data) {
                setDepartments(deptRes.data.map(transformDepartment));
            }
            if (gameRes.data) {
                setGames(gameRes.data.map(transformGame));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Real-time subscriptions
    useEffect(() => {
        const deptChannel = supabase
            .channel('departments-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' }, () => {
                refreshData();
            })
            .subscribe();

        const gameChannel = supabase
            .channel('games-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
                refreshData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(deptChannel);
            supabase.removeChannel(gameChannel);
        };
    }, [refreshData]);

    const supportDepartment = async (deptId: string) => {
        const dept = departments.find(d => d.id === deptId);
        if (!dept) return;

        await supabase
            .from('departments')
            .update({ support_count: dept.support_count + 1 })
            .eq('id', deptId);

        // Optimistic update
        setDepartments(prev =>
            prev.map(d => d.id === deptId ? { ...d, support_count: d.support_count + 1 } : d)
        );
    };

    const updateScore = async (gameId: string, scoreA: number, scoreB: number, currentPeriod?: string, gameClock?: string) => {
        const updates: any = { score_a: scoreA, score_b: scoreB };
        if (currentPeriod !== undefined) updates.current_period = currentPeriod;
        if (gameClock !== undefined) updates.game_clock = gameClock;

        await supabase
            .from('games')
            .update(updates)
            .eq('id', gameId);

        // Optimistic update
        setGames(prev => prev.map(g => g.id === gameId ? { ...g, scoreA, scoreB, ...(currentPeriod !== undefined && { currentPeriod }), ...(gameClock !== undefined && { gameClock }) } : g));
    };

    // Department CRUD
    const addDepartment = async (dept: Omit<Department, 'id'>) => {
        const { error } = await supabase.from('departments').insert({
            name: dept.name,
            logo: dept.logo,
            color: dept.color,
            wins: dept.wins,
            losses: dept.losses,
            points: dept.points,
            support_count: dept.support_count,
        });
        if (error) throw error;
        await refreshData();
    };

    const updateDepartment = async (id: string, dept: Partial<Department>) => {
        const { error } = await supabase.from('departments').update({
            ...(dept.name && { name: dept.name }),
            ...(dept.logo && { logo: dept.logo }),
            ...(dept.color && { color: dept.color }),
            ...(dept.wins !== undefined && { wins: dept.wins }),
            ...(dept.losses !== undefined && { losses: dept.losses }),
            ...(dept.points !== undefined && { points: dept.points }),
            ...(dept.support_count !== undefined && { support_count: dept.support_count }),
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deleteDepartment = async (id: string) => {
        const { error } = await supabase.from('departments').delete().eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    // Game CRUD
    const addGame = async (game: Omit<Game, 'id'>) => {
        const { error } = await supabase.from('games').insert({
            type: game.type,
            department_a_id: game.departmentA_id,
            department_b_id: game.departmentB_id,
            score_a: game.scoreA,
            score_b: game.scoreB,
            status: game.status,
            start_time: game.startTime,
            current_period: game.currentPeriod,
            game_clock: game.gameClock,
        });
        if (error) throw error;
        await refreshData();
    };

    const updateGame = async (id: string, game: Partial<Game>) => {
        const { error } = await supabase.from('games').update({
            ...(game.type && { type: game.type }),
            ...(game.departmentA_id && { department_a_id: game.departmentA_id }),
            ...(game.departmentB_id && { department_b_id: game.departmentB_id }),
            ...(game.scoreA !== undefined && { score_a: game.scoreA }),
            ...(game.scoreB !== undefined && { score_b: game.scoreB }),
            ...(game.status && { status: game.status }),
            ...(game.startTime && { start_time: game.startTime }),
            ...(game.currentPeriod !== undefined && { current_period: game.currentPeriod }),
            ...(game.gameClock !== undefined && { game_clock: game.gameClock }),
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deleteGame = async (id: string) => {
        const { error } = await supabase.from('games').delete().eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const uploadDepartmentLogo = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('departments')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('departments').getPublicUrl(filePath);
        return data.publicUrl;
    };

    return (
        <AppContext.Provider value={{
            departments,
            games,
            liveGame,
            loading,
            refreshData,
            supportDepartment,
            updateScore,
            addDepartment,
            updateDepartment,
            deleteDepartment,
            addGame,
            updateGame,
            deleteGame,
            uploadDepartmentLogo,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppStore must be used within an AppProvider");
    }
    return context;
};
