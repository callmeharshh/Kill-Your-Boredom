import React, { useState, useEffect, useContext, createContext } from 'react';
import { Trophy, Star, Users, Camera, Target, Wallet, LogOut, Coins, Play, ArrowRight, Zap, Sparkles, TrendingUp, Calendar, Award, Crown, Shuffle, Heart, MessageCircle, Share2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

// Floating Emojis Animation Component
const FloatingEmojis = () => {
  const emojis = ['⚡', '🔥', '💫', '🎯', '💎', '🚀', '⭐', '💥'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-bounce opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

// Aptos Context for wallet management
const AptosContext = createContext(null);

// Mock Aptos wallet functions
const mockAptosWallet = {
  connect: async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      publicKey: '0xabcdef1234567890',
      network: 'mainnet'
    };
  },
  disconnect: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  getBalance: async () => {
    return 0;
  }
};

// Aptos Provider Component
const AptosProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [kybBalance, setKybBalance] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const walletInfo = await mockAptosWallet.connect();
      setWallet(walletInfo);
      const existingBalance = parseInt(window.kybBalance) || 0;
      const existingTasks = parseInt(window.tasksCompleted) || 0;
      const existingPoints = parseInt(window.totalPoints) || 0;
      const existingStreak = parseInt(window.currentStreak) || 0;
      const existingLevel = parseInt(window.level) || 1;
      
      setKybBalance(existingBalance);
      setTasksCompleted(existingTasks);
      setTotalPoints(existingPoints);
      setCurrentStreak(existingStreak);
      setLevel(existingLevel);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectGoogle = async () => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockGoogleUser = {
        address: 'google_' + Math.random().toString(36).substr(2, 9),
        publicKey: 'google_auth',
        network: 'google',
        loginType: 'google'
      };
      setWallet(mockGoogleUser);
      
      const existingBalance = parseInt(window.kybBalance) || 0;
      const existingTasks = parseInt(window.tasksCompleted) || 0;
      const existingPoints = parseInt(window.totalPoints) || 0;
      const existingStreak = parseInt(window.currentStreak) || 0;
      const existingLevel = parseInt(window.level) || 1;
      
      setKybBalance(existingBalance);
      setTasksCompleted(existingTasks);
      setTotalPoints(existingPoints);
      setCurrentStreak(existingStreak);
      setLevel(existingLevel);
    } catch (error) {
      console.error('Failed to connect with Google:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await mockAptosWallet.disconnect();
      setWallet(null);
      setKybBalance(0);
      setTasksCompleted(0);
      setCurrentStreak(0);
      setLevel(1);
      setTotalPoints(0);
      window.kybBalance = 0;
      window.tasksCompleted = 0;
      window.totalPoints = 0;
      window.currentStreak = 0;
      window.level = 1;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const completeTask = (tokensEarned) => {
    const newBalance = kybBalance + tokensEarned;
    const newTaskCount = tasksCompleted + 1;
    const newPoints = totalPoints + tokensEarned;
    const newLevel = Math.floor(newPoints / 500) + 1;
    const newStreak = currentStreak + 1;

    setKybBalance(newBalance);
    setTasksCompleted(newTaskCount);
    setTotalPoints(newPoints);
    setLevel(newLevel);
    setCurrentStreak(newStreak);

    window.kybBalance = newBalance;
    window.tasksCompleted = newTaskCount;
    window.totalPoints = newPoints;
    window.currentStreak = newStreak;
    window.level = newLevel;
  };

  useEffect(() => {
    if (wallet) {
      const savedBalance = parseInt(window.kybBalance) || 0;
      const savedTasks = parseInt(window.tasksCompleted) || 0;
      const savedPoints = parseInt(window.totalPoints) || 0;
      const savedStreak = parseInt(window.currentStreak) || 0;
      const savedLevel = parseInt(window.level) || 1;
      
      setKybBalance(savedBalance);
      setTasksCompleted(savedTasks);
      setTotalPoints(savedPoints);
      setCurrentStreak(savedStreak);
      setLevel(savedLevel);
    }
  }, [wallet]);

  return (
    <AptosContext.Provider value={{
      wallet,
      isConnecting,
      kybBalance,
      tasksCompleted,
      currentStreak,
      level,
      totalPoints,
      connectWallet,
      connectGoogle,
      disconnectWallet,
      completeTask
    }}>
      {children}
    </AptosContext.Provider>
  );
};

const useAptos = () => {
  const context = useContext(AptosContext);
  if (!context) {
    throw new Error('useAptos must be used within AptosProvider');
  }
  return context;
};

// Aptos Logo Component
const AptosLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#00D4AA"/>
    <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="#FFFFFF"/>
  </svg>
);

// Login Screen Component
const LoginScreen = () => {
  const { connectWallet, connectGoogle, isConnecting } = useAptos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
      <FloatingEmojis />
      
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-pulse">⚡</div>
            <h1 className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Kill Your Boredom
            </h1>
            <div className="text-xl text-purple-200 mb-2">🔥 Gen-Z Dopamine Machine 🔥</div>
            <p className="text-purple-300">Ready to absolutely DESTROY boredom? Let's gooo! 🚀</p>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">What's good! 👋</h2>
              <p className="text-purple-200">Connect your wallet or sign in to start earning KYB tokens!</p>
            </div>

            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 mb-4 transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              <AptosLogo className="w-6 h-6" />
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Connecting...
                </>
              ) : (
                'Connect Aptos Wallet 🔗'
              )}
            </button>

            <div className="text-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-purple-500/30"></div>
                <span className="text-purple-300 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-purple-500/30"></div>
              </div>

              <button
                onClick={connectGoogle}
                disabled={isConnecting}
                className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mb-4 transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isConnecting ? 'Connecting...' : 'Continue with Google 🚀'}
              </button>

              <p className="text-purple-200 text-sm mb-4">New to Web3? No cap! 💯</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-purple-500/30">
                  📚 Learn Web3
                </button>
                <button className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 py-3 px-4 rounded-lg transition-colors text-sm font-medium border border-purple-500/30">
                  💸 Get Aptos
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-purple-300 text-xs leading-relaxed">
                🎯 By connecting, you're about to join the most legendary boredom-killing squad ever! 
                We're gonna turn your boring moments into absolute fire experiences! No cap! 🔥💯
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">🎰</div>
              <div className="text-white text-sm font-medium">Task Roulette</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-white text-sm font-medium">Earn KYB</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-white text-sm font-medium">Leaderboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component - Initial Screen
const DashboardHome = ({ onKillBoredom, onProveIt, onHallOfFame, onSquad }) => {
  const { wallet, kybBalance, tasksCompleted, currentStreak } = useAptos();

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
      <FloatingEmojis />
      
      <div className="p-4 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h1 className="text-xl font-black text-white">Kill the Boredom</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-purple-500/30">
              <div className="text-purple-200 text-xs">Legend</div>
              <div className="text-white font-bold text-sm">{truncateAddress(wallet.address)}</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-3">
            Welcome Back, Legend! 👑
          </h2>
          <p className="text-xl text-purple-200 mb-6">
            Ready to absolutely demolish some boredom today?
          </p>
          <p className="text-purple-300">
            Your personalized boredom-killing machine is ready to serve you FIRE activities based on your epic profile! Let's make this day legendary! 🔥
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-500/30">
            <div className="text-yellow-400 text-2xl font-bold">{kybBalance}</div>
            <div className="text-purple-200 text-xs">KYB Tokens</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-500/30">
            <div className="text-green-400 text-2xl font-bold">{tasksCompleted}</div>
            <div className="text-purple-200 text-xs">Tasks Crushed</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-500/30">
            <div className="text-pink-400 text-2xl font-bold">{currentStreak}</div>
            <div className="text-purple-200 text-xs">Day Streak</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-yellow-500/30">
            <div className="text-yellow-400 text-sm font-medium">🔥 {tasksCompleted} tasks crushed</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-green-500/30">
            <div className="text-green-400 text-sm font-medium">⚡ {kybBalance} legends online</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-pink-500/30">
            <div className="text-pink-400 text-sm font-medium">💯 {currentStreak} day streak</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <div 
            onClick={onKillBoredom}
            className="bg-gradient-to-br from-red-500/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">🎯</div>
              <div className="bg-red-500/30 text-red-200 px-3 py-1 rounded-full text-xs font-bold">
                HOT! 🔥
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kill My Boredom</h3>
            <p className="text-red-200 text-sm mb-4">AI-Powered Task Generator</p>
            <p className="text-red-300 text-xs mb-4">Get 3 perfect activities tailored to your exact mood and situation</p>
            <div className="flex items-center gap-2 text-red-200 text-sm">
              <span>🧠 Fresh tasks every time</span>
            </div>
            <div className="mt-3 text-red-300 font-medium text-sm cursor-pointer">Let's Go →</div>
          </div>

          <div 
            onClick={onProveIt}
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">📸</div>
              <div className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-xs font-bold">
                EPIC SHOWCASE ✨
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Prove It</h3>
            <p className="text-purple-200 text-sm mb-4">Epic Task Verification</p>
            <p className="text-purple-300 text-xs mb-4">Upload photos/videos and let the community rate your creativity</p>
            <div className="flex items-center gap-2 text-purple-200 text-sm">
              <span>📸 See others' go viral</span>
            </div>
            <div className="mt-3 text-purple-300 font-medium text-sm cursor-pointer">Let's Go →</div>
          </div>

          <div 
            onClick={onHallOfFame}
            className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">🏆</div>
              <div className="bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full text-xs font-bold">
                LEGENDARY ✨
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hall of Fame</h3>
            <p className="text-yellow-200 text-sm mb-4">Global Rankings</p>
            <p className="text-yellow-300 text-xs mb-4">See who's absolutely crushing it killing boredom worldwide</p>
            <div className="flex items-center gap-2 text-yellow-200 text-sm">
              <span>🔥 889 users competing</span>
            </div>
            <div className="mt-3 text-yellow-300 font-medium text-sm cursor-pointer">Let's Go →</div>
          </div>

          <div 
            onClick={onSquad}
            className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">💥</div>
              <div className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-xs font-bold">
                VIBE! 😎
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Squad</h3>
            <p className="text-green-200 text-sm mb-4">Community Feed</p>
            <p className="text-green-300 text-xs mb-4">Check out the most creative task completions from your gang</p>
            <div className="flex items-center gap-2 text-green-200 text-sm">
              <span>✨ See what others are doing</span>
            </div>
            <div className="mt-3 text-green-300 font-medium text-sm cursor-pointer">Let's Go →</div>
          </div>
        </div>

        <div className="text-center max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-3">🚀 Ready to Become a Legend? 🚀</h3>
            <p className="text-purple-200 mb-4">Your personalized boredom-killing experience awaits! Time to make your gang jealous! 😎</p>
            <button 
              onClick={onKillBoredom}
              className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold py-3 px-6 rounded-xl hover:scale-105 transform transition-all shadow-lg"
            >
              ⚡ OBLITERATE MY BOREDOM NOW ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Swiper Component
const TaskSwiper = ({ tasks, onTaskSelect, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTask = () => {
    setCurrentIndex((prev) => (prev + 1) % tasks.length);
  };

  const prevTask = () => {
    setCurrentIndex((prev) => (prev - 1 + tasks.length) % tasks.length);
  };

  const currentTask = tasks[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
      <FloatingEmojis />
      
      <div className="p-4 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Perfect Activities 🎯</h1>
            <p className="text-purple-200">Swipe through your personalized suggestions</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                Activity {currentIndex + 1} of {tasks.length}
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">{currentTask.title}</h2>
              <p className="text-lg text-purple-200 leading-relaxed">{currentTask.description}</p>
            </div>

            <div className="mb-6">
              <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-purple-200 font-medium">Why this works:</span>
                </div>
                <p className="text-purple-300 text-sm">{currentTask.explanation}</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-bold inline-block">
                ⏰ Time needed: {currentTask.timeNeeded}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevTask}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors flex items-center gap-2"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              
              <div className="flex gap-2">
                {tasks.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-pink-500' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTask}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors flex items-center gap-2"
                disabled={currentIndex === tasks.length - 1}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onTaskSelect(currentTask)}
                className="bg-green-600/20 hover:bg-green-600/30 text-green-300 py-3 px-4 rounded-xl font-bold border border-green-500/30 transition-colors"
              >
                ⚡ I Did This!
              </button>
              <button 
                onClick={onBack}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-3 px-4 rounded-xl font-bold border border-blue-500/30 transition-colors"
              >
                🔄 Generate New
              </button>
              <button 
                onClick={onBack}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 py-3 px-4 rounded-xl font-bold border border-purple-500/30 transition-colors"
              >
                📝 Try Different
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onTaskSelect(currentTask)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              I Did This! Prove It ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Generator & Selection Flow
const TaskFlow = ({ onBack, onTaskComplete }) => {
  const [situation, setSituation] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('input');
  const [isGenerating, setIsGenerating] = useState(false);

  const vibes = [
    { emoji: '😈', label: 'Savage Mode', color: 'from-red-500 to-pink-600' },
    { emoji: '😌', label: 'Chill Vibes', color: 'from-blue-500 to-purple-600' },
    { emoji: '🤪', label: 'Silly Energy', color: 'from-yellow-500 to-orange-600' },
    { emoji: '🎨', label: 'Creative Flow', color: 'from-purple-500 to-pink-600' },
    { emoji: '🔥', label: 'High Energy', color: 'from-orange-500 to-red-600' },
    { emoji: '🧠', label: 'Brain Mode', color: 'from-green-500 to-blue-600' }
  ];

  const generateTasks = async (vibe) => {
    setSelectedVibe(vibe);
    setCurrentScreen('generating');
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contextualTasks = generateContextualTasks(situation, vibe);
    setGeneratedTasks(contextualTasks);
    setIsGenerating(false);
    setCurrentScreen('selection');
  };

  const generateContextualTasks = (userSituation, vibe) => {
    const situation_lower = userSituation.toLowerCase();
    
    const isTravel = situation_lower.includes('metro') || situation_lower.includes('train') || situation_lower.includes('bus');
    const isPublic = situation_lower.includes('cafe') || situation_lower.includes('library') || situation_lower.includes('office');
    const isPhone = situation_lower.includes('phone') || situation_lower.includes('tiktok') || situation_lower.includes('scroll');
    
    let tasks = [];
    
    if (isTravel) {
      tasks = [
        {
          id: 1,
          title: 'Metro People Detective Game',
          description: 'Look around and create epic backstories for 3 different people you see. What\'s their main character arc? What adventure are they heading to?',
          explanation: 'Observational creativity keeps your mind engaged while respecting others\' privacy through imaginative storytelling.',
          timeNeeded: '10 minutes',
          tokens: 60
        },
        {
          id: 2,
          title: 'Window World Explorer',
          description: 'Pick one interesting building or scene you pass and imagine what life is like there. Create a whole story about the people and their dreams.',
          explanation: 'External focus combined with creative thinking breaks internal boredom loops and engages spatial awareness.',
          timeNeeded: '15 minutes',
          tokens: 55
        },
        {
          id: 3,
          title: 'Secret Agent Mission Briefing',
          description: 'Pretend you\'re a secret agent and your destination is actually a mission location. What\'s your cover story? Plan it all out mentally.',
          explanation: 'Role-playing games activate multiple cognitive functions and make routine travel feel adventurous.',
          timeNeeded: '20 minutes',
          tokens: 70
        }
      ];
    } else if (isPublic) {
      tasks = [
        {
          id: 4,
          title: 'Stealth Compliment Mission',
          description: 'Find a way to genuinely compliment someone nearby - maybe about their outfit or book choice. Keep it natural and spread good vibes!',
          explanation: 'Social connection through kindness builds confidence and creates positive interactions that energize both people.',
          timeNeeded: '5 minutes',
          tokens: 65
        },
        {
          id: 5,
          title: 'Environment Mood Board',
          description: 'Look around and mentally collect everything that catches your eye. Imagine designing a room inspired by this exact vibe.',
          explanation: 'Mindful observation combined with design thinking engages both analytical and creative brain functions.',
          timeNeeded: '10 minutes',
          tokens: 50
        },
        {
          id: 6,
          title: 'Invisible Performance Art',
          description: 'Do subtle performance art that only you know about - sit like royalty or move like you\'re dancing to music only you hear.',
          explanation: 'Self-directed performance creates internal entertainment while building confidence and body awareness.',
          timeNeeded: '15 minutes',
          tokens: 60
        }
      ];
    } else if (isPhone) {
      tasks = [
        {
          id: 7,
          title: 'Phone Detox Power Hour',
          description: 'Put your phone away and spend 30 minutes doing something with your hands - draw, organize, stretch, or just think.',
          explanation: 'Digital detox allows your brain to reset dopamine pathways and rediscover offline engagement.',
          timeNeeded: '30 minutes',
          tokens: 85
        },
        {
          id: 8,
          title: 'Create Instead of Consume',
          description: 'Instead of scrolling, create something to post! Take an aesthetic photo, write a funny caption, or film a mini vlog.',
          explanation: 'Switching from passive consumption to active creation engages different brain regions and builds confidence.',
          timeNeeded: '15 minutes',
          tokens: 70
        },
        {
          id: 9,
          title: 'Digital Minimalism Challenge',
          description: 'Delete or hide 3 apps that you mindlessly scroll. Replace that screen time with something that makes you feel accomplished.',
          explanation: 'Removing digital distractions creates space for more intentional activities that provide genuine satisfaction.',
          timeNeeded: '10 minutes',
          tokens: 75
        }
      ];
    } else {
      const taskDatabase = {
        'Savage Mode': [
          {
            id: 10,
            title: 'Text Your Crush Energy',
            description: 'Send a confident, fun message to someone you like. Nothing desperate - just good vibes! Maybe react to their story cleverly.',
            explanation: 'Taking social risks in small doses builds confidence and creates exciting anticipation.',
            timeNeeded: '5 minutes',
            tokens: 60
          },
          {
            id: 11,
            title: 'Main Character Moment',
            description: 'Do one thing today that your future self will thank you for. Make a bold choice, start that project, or have that conversation.',
            explanation: 'Proactive behavior aligned with values creates genuine self-respect and momentum.',
            timeNeeded: '20 minutes',
            tokens: 85
          },
          {
            id: 12,
            title: 'Confidence Soundtrack Walk',
            description: 'Put on your most hype playlist and take a 10-minute walk like you own the world. Full main character energy!',
            explanation: 'Music plus movement plus confident posture creates immediate mood elevation and self-assurance.',
            timeNeeded: '15 minutes',
            tokens: 65
          }
        ],
        'Chill Vibes': [
          {
            id: 13,
            title: 'Gratitude Reality Check',
            description: 'List 5 things that are actually going well in your life right now. Include tiny things - like your favorite song.',
            explanation: 'Gratitude practice rewires the brain to notice positive aspects and creates genuine contentment.',
            timeNeeded: '10 minutes',
            tokens: 45
          },
          {
            id: 14,
            title: 'Future Self Visualization',
            description: 'Spend 10 minutes imagining your life 1 year from now. What does an ideal day look like? Be detailed.',
            explanation: 'Future-focused visualization creates motivation and helps clarify values and priorities.',
            timeNeeded: '15 minutes',
            tokens: 55
          },
          {
            id: 15,
            title: 'Cozy Corner Creation',
            description: 'Make your current space as cozy as possible using what you have. Adjust lighting, add blankets, play soft music.',
            explanation: 'Environmental design directly impacts mood and creates a sense of control and comfort.',
            timeNeeded: '15 minutes',
            tokens: 50
          }
        ],
        'Creative Flow': [
          {
            id: 16,
            title: 'Story Remix Challenge',
            description: 'Take a boring story from your day and retell it like it\'s an epic movie trailer. Make grocery shopping sound heroic!',
            explanation: 'Creative reframing exercises build storytelling skills and help find humor in ordinary moments.',
            timeNeeded: '10 minutes',
            tokens: 60
          },
          {
            id: 17,
            title: 'Invent Something Useful',
            description: 'Design a product that would solve a minor annoyance in your life. Draw it, name it, write a commercial for it.',
            explanation: 'Problem-solving creativity engages multiple brain regions and builds innovative thinking skills.',
            timeNeeded: '20 minutes',
            tokens: 75
          },
          {
            id: 18,
            title: 'Alternative Universe Journal',
            description: 'Write about what your life would be like if you made one different choice this year. Explore that timeline in detail.',
            explanation: 'Reflective writing with creative elements helps process decisions and explore possibilities.',
            timeNeeded: '20 minutes',
            tokens: 70
          }
        ]
      };

      const vibeKey = vibe === 'Custom' ? 'Chill Vibes' : vibe;
      tasks = taskDatabase[vibeKey] || taskDatabase['Chill Vibes'];
    }

    return tasks;
  };

  const handleTaskComplete = (task) => {
    onTaskComplete(task);
  };

  if (currentScreen === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
        <FloatingEmojis />
        
        <div className="p-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">BOREDOM = DELETED 🔥</h1>
              <p className="text-purple-200">What's good! Ready to absolutely destroy some boredom? 💯</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Drop your situation bestie! 📝</h3>
              <input
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="I'm traveling in the metro and feeling bored... OR I'm at home scrolling TikTok mindlessly..."
                className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
              {situation && (
                <button
                  onClick={() => generateTasks('Custom')}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold py-3 px-6 rounded-xl hover:scale-105 transform transition-all shadow-lg"
                >
                  KILL MY BOREDOM! ⚡
                </button>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 text-center">What's your vibe rn? 🤔</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vibes.map((vibe, index) => (
                <button
                  key={index}
                  onClick={() => generateTasks(vibe.label)}
                  className={`bg-gradient-to-r ${vibe.color} p-4 rounded-xl text-white font-medium hover:scale-105 transform transition-all shadow-lg`}
                >
                  <div className="text-2xl mb-2">{vibe.emoji}</div>
                  <div className="text-sm">{vibe.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-4xl mb-4 animate-spin">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4">AI is cooking up something FIRE... 🔥</h2>
            <p className="text-purple-200 mb-6">Analyzing your vibe and generating perfect dopamine hits!</p>
            
            <div className="w-full bg-purple-800/50 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 h-full rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-purple-300 text-sm mt-4">Finding the perfect tasks for you... ⚡</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'selection') {
    return (
      <TaskSwiper 
        tasks={generatedTasks}
        onTaskSelect={handleTaskComplete}
        onBack={() => setCurrentScreen('input')}
      />
    );
  }

  return null;
};

// Task Completion Screen
const TaskCompletionScreen = ({ task, onComplete, onBack }) => {
  const { completeTask } = useAptos();
  const [proof, setProof] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComplete = () => {
    if (proof.trim()) {
      completeTask(task.tokens);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl p-1">
            <div className="bg-black/90 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
                <Trophy className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">ABSOLUTELY LEGENDARY! 👑</h2>
              <div className="text-4xl font-black text-yellow-400 mb-2">+{task.tokens} KYB</div>
              <p className="text-yellow-200 mb-4">You just crushed that challenge!</p>
              <div className="flex justify-center gap-2 text-2xl">
                <span className="animate-pulse">⚡</span>
                <span className="animate-pulse">💎</span>
                <span className="animate-pulse">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Prove You Did It! 📸</h1>
            <p className="text-purple-200">Show the world your legendary completion</p>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 mb-6">
          <h2 className="text-2xl font-bold text-white mb-3">{task.title}</h2>
          <p className="text-purple-200 mb-4">{task.description}</p>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold inline-block">
            Earn {task.tokens} KYB Tokens! 💎
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Drop your proof! 🔥</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-4 px-6 rounded-xl font-bold border border-blue-500/30 transition-colors">
              📸 Upload Photo
            </button>
            <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 py-4 px-6 rounded-xl font-bold border border-purple-500/30 transition-colors">
              🎥 Upload Video
            </button>
          </div>

          <textarea
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Tell us how it went! What was the best part? Any funny moments? Be detailed - your story matters! ✨"
            className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-32 resize-none"
          />
        </div>

        <button
          onClick={handleComplete}
          disabled={!proof.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg text-lg"
        >
          {proof.trim() ? 'CLAIM MY LEGENDARY STATUS! 👑' : 'Add Your Proof First! ✏️'}
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedTask, setSelectedTask] = useState(null);

  const handleKillBoredom = () => {
    setCurrentScreen('taskFlow');
  };

  const handleTaskComplete = (task) => {
    setSelectedTask(task);
    setCurrentScreen('taskCompletion');
  };

  const handleCompletionFinish = () => {
    setCurrentScreen('home');
    setSelectedTask(null);
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedTask(null);
  };

  const handleProveIt = () => {
    alert('Prove It feature coming soon! 📸');
  };

  const handleHallOfFame = () => {
    alert('Hall of Fame feature coming soon! 🏆');
  };

  const handleSquad = () => {
    alert('Squad feature coming soon! 💥');
  };

  if (currentScreen === 'home') {
    return (
      <DashboardHome 
        onKillBoredom={handleKillBoredom}
        onProveIt={handleProveIt}
        onHallOfFame={handleHallOfFame}
        onSquad={handleSquad}
      />
    );
  }

  if (currentScreen === 'taskFlow') {
    return (
      <TaskFlow 
        onBack={handleBackToHome}
        onTaskComplete={handleTaskComplete}
      />
    );
  }

  if (currentScreen === 'taskCompletion') {
    return (
      <TaskCompletionScreen 
        task={selectedTask}
        onComplete={handleCompletionFinish}
        onBack={handleBackToHome}
      />
    );
  }

  return null;
};

// Main App Component
const App = () => {
  const { wallet } = useAptos();

  if (!wallet) {
    return <LoginScreen />;
  }

  return <Dashboard />;
};

// Main App with Provider
const MainApp = () => {
  return (
    <AptosProvider>
      <App />
    </AptosProvider>
  );
};

export default MainApp;