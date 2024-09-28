-- DROP HEADERS 
-------------------------------------------------------------------------------------------------
DROP TYPE IF EXISTS DIFFICULTY CASCADE;
DROP TYPE IF EXISTS GAMEMODE CASCADE;
DROP TYPE IF EXISTS MISSION CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

DROP TABLE IF EXISTS multiplayer_games CASCADE;
DROP TABLE IF EXISTS player_game_stats CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;

DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS daily_missions CASCADE;
DROP TABLE IF EXISTS user_daily_completions CASCADE;

DROP TABLE IF EXISTS settings CASCADE;

DROP TABLE IF EXISTS message CASCADE;
DROP TABLE IF EXISTS thread CASCADE;
DROP TABLE IF EXISTS user_thread CASCADE;

-- TYPE DEFINITIONS
-------------------------------------------------------------------------------------------------

CREATE TYPE DIFFICULTY AS ENUM ('novice', 'seasoned', 'master');

-- For timed: the number is in minutes
-- For untimed: the number of number of messages user must complete
CREATE TYPE GAMEMODE AS ENUM ('timed 1', 'timed 3', 'timed 5', 'untimed 10', 'untimed 20', 'untimed 30');

-- For games: the number is the number of games they must win
-- For win: the number is the number of wins the must achieve
-- For combo: the number is the minimum combo they must get in any game
CREATE TYPE MISSION AS ENUM ('games', 'win', 'combo');

-- DATA TABLE DEFINITIONS
-------------------------------------------------------------------------------------------------

-- A user 
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    profile_pic TEXT NOT NULL
);

-- time_played: The time the user has played in seconds
-- global ranking will be computed at regular intervals to reduce constant delays
CREATE TABLE user_stats (
    user_id TEXT PRIMARY KEY,
    elo INT NOT NULL CHECK (elo >= 0),
    games_played INT NOT NULL,
    time_played INT NOT NULL CHECK (time_played > 0),
    win_rate FLOAT NOT NULL CHECK (win_rate > 0 AND win_rate <= 100),
    global_ranking INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- A multiplayer game instance
CREATE TABLE multiplayer_games (
    game_id SERIAL PRIMARY KEY,
    game_time TIMESTAMP DEFAULT NOW(),
    difficulty DIFFICULTY NOT NULL,
    gamemode GAMEMODE NOT NULL,
    average_elo INT NOT NULL CHECK (average_elo >= 0)
);

-- Needed since we possibly have multiple players per game
CREATE TABLE player_game_stats (
    game_id INT PRIMARY KEY,
    user_id TEXT NOT NULL,
    score FLOAT NOT NULL,
    highest_combo INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES multiplayer_games(game_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- I'll only put in ELO for now
-- Stores the top 10 people in terms of ELO
-- Is computed at regular intervals, same time as when rankings are computed
CREATE TABLE leaderboard (
    user_id TEXT PRIMARY KEY,
    elo INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Store all the possible missions
CREATE TABLE missions (
    mission_id SERIAL PRIMARY KEY,
    mission_type MISSION NOT NULL,
    -- This is number of games for "games" or "win", and number of combos for "combo"
    -- I'll make it possible to be NULL, in case we add a mission that doesnt require a number
    mission_number INT
);

-- I'll assume for now we won't store past daily missions
CREATE TABLE daily_missions (
    mission_id INT NOT NULL
);

-- Records which daily missions the user has completed
CREATE TABLE user_daily_completions (
    user_id TEXT NOT NULL,
    mission_id INT NOT NULL,
    PRIMARY KEY (user_id, mission_id)
);

CREATE TABLE settings (
    user_id TEXT PRIMARY KEY,
    options TEXT NOT NULL,
    dark_mode BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- A message thread
CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    thread_name TEXT NOT NULL
);

-- A single message
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    thread_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (thread_id) REFERENCES thread(thread_id)
);

-- Specified relationship between thread and message
CREATE TABLE user_thread (
    user_id TEXT NOT NULL,
    thread_id INT NOT NULL,
    PRIMARY KEY (user_id, thread_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (thread_id) REFERENCES thread(thread_id)
);

-------------------------------------------------------------------------------------------------
