-- DROP HEADERS 
-------------------------------------------------------------------------------------------------
DROP TYPE IF EXISTS DIFFICULTY CASCADE;
DROP TYPE IF EXISTS GAMEMODE CASCADE;
DROP TYPE IF EXISTS MISSION CASCADE;
DROP TYPE IF EXISTS PLAYERMODE CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

DROP TABLE IF EXISTS lobby CASCADE;
DROP TABLE IF EXISTS lobby_players CASCADE;

DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS player_game_stats CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS game_scores CASCADE;

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

CREATE TYPE PLAYERMODE AS ENUM ('singleplayer', 'multiplayer');

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
    password TEXT NOT NULL,
    profile_pic TEXT NOT NULL
);

-- time_played: The time the user has played in seconds
-- global ranking will be computed at regular intervals to reduce constant delays

-- todo: change win_rate out for wins and losses.
-- todo: potentially think abt the runtime of global_ranking
CREATE TABLE user_stats (
    user_id TEXT PRIMARY KEY,
    games_played INT NOT NULL,
    time_played INT NOT NULL CHECK (time_played > 0),
    games_won INT NOT NULL,
    games_lost INT NOT NULL,
    global_ranking INT NOT NULL,
    gems INT NOT NULL,
    coins INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- represents a multiplayer game lobby
CREATE TABLE lobby (
    lobby_id TEXT PRIMARY KEY,
    creator_id TEXT UNIQUE NOT NULL,
    max_players INT NOT NULL CHECK (max_players <= 8),
    num_players INT NOT NULL CHECK (num_players <= max_players),
    difficulty DIFFICULTY NOT NULL,
    game_mode GAMEMODE NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(user_id)
);

-- player in lobby
CREATE TABLE lobby_players (
    lobby_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY (lobby_id, user_id)
);

-- A multiplayer game instance
CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    player_mode PLAYERMODE not null,
    start_time TIMESTAMP DEFAULT NOW(),
    topic TEXT NOT NULL,
    difficulty DIFFICULTY NOT NULL,
    game_mode GAMEMODE NOT NULL,
    average_elo INT NOT NULL CHECK (average_elo >= 0)
);

-- Needed since we possibly have multiple players per game
CREATE TABLE player_game_stats (
    game_id INT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY(game_id, user_id),
    elo_difference INT NOT NULL,
    accuracy FLOAT NOT NULL,
    highest_combo INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- I'll only put in ELO for now
-- Is computed at regular intervals, same time as when rankings are computed
CREATE TABLE leaderboard (
    user_id TEXT PRIMARY KEY,
    elo INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE game_scores (
    user_id TEXT NOT NULL,
    game_id INT NOT NULL,
    message_id SERIAL NOT NULL,
    flow: INT NOT NULL,
    conciseness: INT NOT NULL,
    clarity: INT NOT NULL,
    relevance: INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (message_id) REFERENCES message(message_id),
    PRIMARY KEY(user_id, game_id, message_id)
)

-- Store all the possible missions
CREATE TABLE missions (
    mission_id SERIAL PRIMARY KEY,
    mission_type MISSION NOT NULL,
    -- This is number of games for "games" or "win", and number of combos for "combo"
    -- I'll make it possible to be NULL, in case we add a mission that doesnt require a number
    mission_number INT
);

-- I'll assume for now we won't store past daily missions
-- always has size 3
CREATE TABLE daily_missions (
    mission_id INT NOT NULL,
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id)
);

-- Records which daily missions the user has completed
-- Wipe every day
CREATE TABLE user_daily_completions (
    user_id TEXT NOT NULL,
    mission_id INT NOT NULL,
    PRIMARY KEY (user_id, mission_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id)
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
