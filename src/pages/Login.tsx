import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../services/store';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAppStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
            const success = await login(username);
            if (success) {
                navigate('/admin');
            } else {
                setError('Invalid username. Try "admin" or "delegate_bball".');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-neon-green)]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-neon-green)]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-[var(--color-neon-green)]/30 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
                            <Lock className="w-8 h-8 text-[var(--color-neon-green)]" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Enter your credentials to access the portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[var(--color-neon-green)] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-[var(--color-neon-green)] focus:bg-white/10 focus:outline-none transition-all"
                                    placeholder="Enter username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !username}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isLoading || !username
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-[var(--color-neon-green)] text-black hover:bg-[var(--color-neon-green-hover)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}
