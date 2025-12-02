import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Search, 
  User, 
  Heart, 
  Star, 
  MoreHorizontal, 
  ChefHat, 
  Filter, 
  X, 
  AlertTriangle,
  Plus
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * TYPES & INTERFACES (Matching Mongoose Backend Plans)
 * ------------------------------------------------------------------
 */

type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  followers: number;
  following: number;
  avgRating: number;
}

interface Macros {
  calories: number;
  protein: number; // in grams
  carbs: number;
  fats: number;
}

interface Recipe {
  id: string;
  title: string;
  author: UserProfile;
  imageUrl: string;
  category: Category;
  rating: number; // 1-5
  likes: number;
  macros: Macros;
  tags: string[]; // e.g., 'Dairy-Free', 'Vegan'
  timestamp: Date;
}

/**
 * ------------------------------------------------------------------
 * MOCK DATA GENERATOR
 * ------------------------------------------------------------------
 */

const CURRENT_USER: UserProfile = {
  id: 'u1',
  username: 'Ahmed_Cooks',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  followers: 1205,
  following: 45,
  avgRating: 4.8
};

const MOCK_USERS: UserProfile[] = [
  { id: 'u2', username: 'SarahFit', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', followers: 890, following: 120, avgRating: 4.5 },
  { id: 'u3', username: 'KetoKing', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King', followers: 3400, following: 10, avgRating: 4.9 },
  { id: 'u4', username: 'VeganVibes', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegan', followers: 560, following: 500, avgRating: 4.2 },
];

const RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
];

const generateRecipes = (count: number): Recipe[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `r${i}`,
    title: `Delicious Liqma ${i + 1}`,
    author: MOCK_USERS[i % MOCK_USERS.length],
    imageUrl: RECIPE_IMAGES[i % RECIPE_IMAGES.length],
    category: ['Breakfast', 'Lunch', 'Dinner', 'Snack'][i % 4] as Category,
    rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
    likes: Math.floor(Math.random() * 500),
    macros: {
      calories: 300 + Math.floor(Math.random() * 500),
      protein: 10 + Math.floor(Math.random() * 50),
      carbs: 20 + Math.floor(Math.random() * 60),
      fats: 10 + Math.floor(Math.random() * 30),
    },
    tags: Math.random() > 0.5 ? ['Dairy-Free'] : ['High-Protein'],
    timestamp: new Date(),
  }));
};

const ALL_RECIPES = generateRecipes(20);

/**
 * ------------------------------------------------------------------
 * COMPONENTS
 * ------------------------------------------------------------------
 */

const StarRating = ({ rating, interactive = false, onRate }: { rating: number, interactive?: boolean, onRate?: (r: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={14} 
          fill={star <= rating ? "#FFD464" : "transparent"} 
          stroke={star <= rating ? "#FFD464" : "#8899A6"}
          onClick={(e) => {
            if (interactive && onRate) {
              e.stopPropagation();
              onRate(star);
            }
          }}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        />
      ))}
    </div>
  );
};

const RecipeCard = ({ recipe, layout = 'feed' }: { recipe: Recipe, layout?: 'feed' | 'compact' }) => {
  const [liked, setLiked] = useState(false);
  
  if (layout === 'compact') {
    return (
      <div className="glass-card compact-card">
        <img src={recipe.imageUrl} alt={recipe.title} className="compact-img" />
        <div className="compact-info">
          <h4>{recipe.title}</h4>
          <div className="flex-row between">
            <span className="macro-pill">{recipe.macros.protein}g Pro</span>
            <span className="rating-pill">★ {recipe.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card feed-card">
      <div className="card-header">
        <div className="user-pill">
          <img src={recipe.author.avatarUrl} alt="avatar" />
          <span>{recipe.author.username}</span>
        </div>
        <button className="icon-btn"><MoreHorizontal size={20} /></button>
      </div>
      
      <div className="card-image-container">
        <img src={recipe.imageUrl} alt={recipe.title} className="feed-img" />
        <div className="image-overlay">
          <div className="macro-rings">
            <div className="macro-item">
              <span className="val">{recipe.macros.calories}</span>
              <span className="lbl">kcal</span>
            </div>
            <div className="divider"></div>
            <div className="macro-item">
              <span className="val">{recipe.macros.protein}g</span>
              <span className="lbl">Prot</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <div className="left-actions">
          <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
            <Heart size={24} fill={liked ? "#ff4757" : "transparent"} />
          </button>
          <button className="action-btn" onClick={() => alert(`Reported duplicate in ${recipe.category}`)}>
            <AlertTriangle size={22} />
          </button>
        </div>
        <div className="right-actions">
          <StarRating rating={recipe.rating} interactive={true} onRate={(r) => console.log(`Rated ${r}`)} />
        </div>
      </div>

      <div className="card-content">
        <h3>{recipe.title}</h3>
        <p className="tags">
          {recipe.tags.map(t => <span key={t}>#{t}</span>)} • {recipe.category}
        </p>
      </div>
    </div>
  );
};

// The "Today's Liqma" Bento Grid Logic
const BentoGrid = ({ recipes }: { recipes: Recipe[] }) => {
  // Logic: Sort by likes, but allow max 2 per category
  const featured = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const sorted = [...recipes].sort((a, b) => b.likes - a.likes);
    const selected: Recipe[] = [];

    for (const r of sorted) {
      const catCount = categoryCounts[r.category] || 0;
      if (catCount < 2 && selected.length < 8) {
        selected.push(r);
        categoryCounts[r.category] = catCount + 1;
      }
    }
    return selected;
  }, [recipes]);

  return (
    <div className="bento-grid">
      {featured.map((recipe, idx) => (
        <div 
          key={recipe.id} 
          className={`bento-item area-${idx}`}
          style={{ backgroundImage: `url(${recipe.imageUrl})` }}
        >
          <div className="bento-overlay">
            <span className="bento-cat">{recipe.category}</span>
            <span className="bento-likes">♥ {recipe.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FilterModal = ({ onClose, onApply }: any) => {
  const [protein, setProtein] = useState(20);
  const [dairyFree, setDairyFree] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="glass-modal">
        <div className="modal-header">
          <h3>Filters</h3>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="filter-section">
          <label>Min Protein: {protein}g</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={protein} 
            onChange={(e) => setProtein(parseInt(e.target.value))} 
            className="slider"
          />
        </div>

        <div className="filter-section">
          <label>Allergies & Preferences</label>
          <div className="tags-container">
            {['Dairy Free', 'Nut Free', 'Gluten Free'].map(tag => (
              <button 
                key={tag}
                className={`tag-btn ${tag === 'Dairy Free' && dairyFree ? 'active' : ''}`}
                onClick={() => tag === 'Dairy Free' && setDairyFree(!dairyFree)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="primary-btn" onClick={() => onApply({ protein, dairyFree })}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * MAIN SCREENS
 * ------------------------------------------------------------------
 */

const HomeScreen = () => {
  return (
    <div className="screen-content scrollable">
      <div className="header">
        <div>
          <h1>Good Morning,</h1>
          <h2 className="subtitle">Ready for your first Liqma?</h2>
        </div>
        <img src={CURRENT_USER.avatarUrl} className="avatar-small" alt="me" />
      </div>

      <section>
        <div className="section-title">
          <h3>Today's Liqmas</h3>
          <span className="highlight">Featured</span>
        </div>
        <BentoGrid recipes={ALL_RECIPES} />
      </section>

      <section>
        <div className="section-title">
          <h3>Categories</h3>
        </div>
        <div className="horizontal-scroll">
          {['Breakfast', 'Lunch', 'Dinner'].map(cat => (
            <div key={cat} className="category-pill-large">
              {cat}
            </div>
          ))}
        </div>
        <div className="list-vertical">
          {ALL_RECIPES.slice(0, 3).map(r => (
            <RecipeCard key={r.id} recipe={r} layout="compact" />
          ))}
        </div>
      </section>
      <div style={{ height: 80 }} />
    </div>
  );
};

const ExploreScreen = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<any>(null);

  const filteredRecipes = useMemo(() => {
    if (!filterCriteria) return ALL_RECIPES;
    return ALL_RECIPES.filter(r => r.macros.protein >= filterCriteria.protein);
  }, [filterCriteria]);

  return (
    <div className="screen-content scrollable">
      {showFilter && (
        <FilterModal 
          onClose={() => setShowFilter(false)} 
          onApply={(c: any) => { setFilterCriteria(c); setShowFilter(false); }} 
        />
      )}
      
      <div className="sticky-header">
        <div className="search-bar">
          <Search size={18} color="#666" />
          <input placeholder="Find a healthy bite..." />
          <button className="filter-icon-btn" onClick={() => setShowFilter(true)}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="feed-list">
        {filteredRecipes.map(r => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
};

const ProfileScreen = () => {
  const [isFollowing, setIsFollowing] = useState(false); // Demo state

  return (
    <div className="screen-content scrollable">
      <div className="profile-header">
        <img src={CURRENT_USER.avatarUrl} className="avatar-large" alt="profile" />
        <h2>{CURRENT_USER.username}</h2>
        <div className="stats-row">
          <div className="stat">
            <span className="num">{CURRENT_USER.followers}</span>
            <span className="lbl">Followers</span>
          </div>
          <div className="stat">
            <span className="num">{CURRENT_USER.following}</span>
            <span className="lbl">Following</span>
          </div>
          <div className="stat">
            <span className="num">{CURRENT_USER.avgRating}</span>
            <span className="lbl">Rating</span>
          </div>
        </div>
        <div className="profile-actions">
           <button className="primary-btn small">Edit Profile</button>
           <button className="secondary-btn small">Share Profile</button>
        </div>
      </div>

      <div className="tabs-row">
        <button className="tab-pill active">My Liqmas</button>
        <button className="tab-pill">Saved</button>
      </div>

      <div className="grid-2-col">
        {ALL_RECIPES.slice(0, 4).map(r => (
           <div key={r.id} className="grid-tile" style={{ backgroundImage: `url(${r.imageUrl})` }}>
             <span className="rating-badge">★ {r.rating}</span>
           </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * MAIN APP CONTAINER
 * ------------------------------------------------------------------
 */

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'profile'>('home');

  return (
    <div className="app-container">
      {/* Dynamic Content */}
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'explore' && <ExploreScreen />}
      {activeTab === 'profile' && <ProfileScreen />}

      {/* Bottom Dock Navigation */}
      <div className="bottom-dock">
        <div className="glass-dock">
          <button 
            className={`dock-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={24} />
          </button>
          
          <button 
            className={`dock-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Search size={24} />
          </button>
          
          <button className="dock-fab">
            <Plus size={28} color="#fff" />
          </button>

          <button className="dock-item">
            <Heart size={24} />
          </button>

          <button 
            className={`dock-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={24} />
          </button>
        </div>
      </div>

      {/* STYLES (Simulating standard CSS StyleSheet) */}
      <style>{`
        :root {
          --primary: #3FC380;
          --secondary: #42B8B2;
          --accent: #FFD464;
          --bg: #F0F4F8;
          --glass-bg: rgba(255, 255, 255, 0.75);
          --glass-border: rgba(255, 255, 255, 0.6);
          --text-main: #1F2937;
          --text-muted: #6B7280;
        }

        /* Base Reset */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        
        .app-container {
          width: 100%;
          max-width: 420px; /* Mobile width simulation */
          height: 100vh;
          margin: 0 auto;
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.1);
        }

        .screen-content {
          height: 100%;
          padding: 20px;
          padding-bottom: 100px;
        }

        .scrollable { overflow-y: auto; scroll-behavior: smooth; }
        .scrollable::-webkit-scrollbar { width: 0px; }

        /* Typography */
        h1 { font-size: 28px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
        h2 { font-size: 22px; font-weight: 700; color: var(--text-main); }
        h3 { font-size: 18px; font-weight: 600; color: var(--text-main); }
        .subtitle { font-size: 16px; font-weight: 400; color: var(--text-muted); margin-top: 4px; }
        
        /* Glass Components */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
          margin-bottom: 20px;
        }

        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-top: 20px; }
        .avatar-small { width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .avatar-large { width: 80px; height: 80px; border-radius: 50%; border: 3px solid white; box-shadow: 0 8px 20px rgba(0,0,0,0.1); margin-bottom: 12px; }

        /* Bento Grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: 160px 160px 160px;
          gap: 12px;
          margin-top: 16px;
        }
        .bento-item {
          background-size: cover;
          background-position: center;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .area-0 { grid-column: span 2; grid-row: span 1; } /* Hero item */
        .area-3 { grid-row: span 2; } /* Vertical item */
        
        .bento-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .bento-cat { color: white; font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 12px; }
        .bento-likes { color: white; font-size: 12px; font-weight: 700; }

        /* Categories */
        .horizontal-scroll { display: flex; gap: 12px; overflow-x: auto; padding: 4px; margin-bottom: 16px; }
        .horizontal-scroll::-webkit-scrollbar { display: none; }
        .category-pill-large {
          background: white; padding: 12px 24px; border-radius: 30px;
          font-weight: 600; color: var(--text-main);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          white-space: nowrap;
        }

        /* Feed Card */
        .card-header { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; }
        .user-pill { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }
        .user-pill img { width: 28px; height: 28px; border-radius: 50%; }
        
        .card-image-container { position: relative; border-radius: 16px; overflow: hidden; margin-bottom: 12px; height: 280px; }
        .feed-img { width: 100%; height: 100%; object-fit: cover; }
        
        .image-overlay { position: absolute; bottom: 12px; left: 12px; }
        .macro-rings {
          background: rgba(0,0,0,0.6); backdrop-filter: blur(10px);
          border-radius: 30px; padding: 6px 12px; display: flex; gap: 12px; color: white;
        }
        .macro-item { display: flex; flex-direction: column; align-items: center; line-height: 1; }
        .val { font-size: 12px; font-weight: 700; }
        .lbl { font-size: 10px; opacity: 0.8; }
        .divider { width: 1px; background: rgba(255,255,255,0.3); }

        .card-actions { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; }
        .left-actions { display: flex; gap: 12px; }
        .icon-btn, .action-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: var(--text-main); }
        
        /* Compact Card */
        .compact-card { display: flex; align-items: center; gap: 12px; padding: 10px; }
        .compact-img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
        .compact-info { flex: 1; }
        .compact-info h4 { font-size: 14px; margin-bottom: 4px; }
        .flex-row { display: flex; width: 100%; }
        .between { justify-content: space-between; }
        .macro-pill { font-size: 11px; color: var(--primary); background: rgba(63, 195, 128, 0.1); padding: 2px 6px; border-radius: 4px; }
        .rating-pill { font-size: 11px; color: #d97706; font-weight: 600; }

        /* Bottom Dock */
        .bottom-dock { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; pointer-events: none; }
        .glass-dock {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 30px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          pointer-events: auto;
        }
        .dock-item { background: none; border: none; color: #9CA3AF; cursor: pointer; transition: 0.2s; }
        .dock-item.active { color: var(--primary); transform: translateY(-2px); }
        .dock-fab {
          background: var(--primary);
          border: none;
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: -25px 0 0 0;
          box-shadow: 0 8px 20px rgba(63, 195, 128, 0.4);
          cursor: pointer;
        }

        /* Inputs & Modals */
        .sticky-header { position: sticky; top: 0; z-index: 10; padding: 20px 20px 10px 20px; background: linear-gradient(to bottom, #e0f2fe 50%, transparent); }
        .search-bar {
          background: white; border-radius: 12px; padding: 10px 16px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .search-bar input { border: none; outline: none; flex: 1; font-size: 14px; }
        .filter-icon-btn { border: none; background: none; cursor: pointer; }
        
        .modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 50; display: flex; align-items: flex-end; }
        .glass-modal { 
          background: #fff; width: 100%; border-radius: 24px 24px 0 0; padding: 24px; 
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .slider { width: 100%; margin: 10px 0; accent-color: var(--primary); }
        .filter-section { margin-bottom: 20px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .tag-btn { 
          background: #f3f4f6; border: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; color: var(--text-main); cursor: pointer; 
        }
        .tag-btn.active { background: var(--primary); color: white; }
        .primary-btn { width: 100%; background: var(--primary); color: white; border: none; padding: 14px; border-radius: 16px; font-weight: 600; cursor: pointer; }

        /* Profile */
        .profile-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; }
        .stats-row { display: flex; gap: 24px; margin: 16px 0; }
        .stat { display: flex; flex-direction: column; }
        .num { font-weight: 700; font-size: 18px; }
        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-tile { height: 140px; border-radius: 16px; background-size: cover; position: relative; }
        .rating-badge { position: absolute; bottom: 8px; left: 8px; background: rgba(255,255,255,0.9); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
      `}</style>
    </div>
  );
}