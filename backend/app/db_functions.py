import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

db_url = os.getenv("DB_URL")

('timed 1', 'timed 3', 'timed 5', 'untimed 10', 'untimed 20', 'untimed 30')
daily_missions = [(1, 'games', 3), (2, 'combo', 10), (3, 'win', 1)]


# =================== user stats stuff ====================================================================

# untested
def create_user(user_id, username, email, password, profile_pic):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
        INSERT INTO users (user_id, username, email, password, profile_pic)
        VALUES (%s, %s, %s, %s, %s);
        """

        cursor.execute(sql_command, [user_id, username, email, password, profile_pic])

        conn.commit()  # Commit the transaction
        cursor.close()
        conn.close()
        return {"status": -1}

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return {"status": -1}

#untested
def create_user_stats(user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
        INSERT INTO user_stats (user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """

        cursor.execute(sql_command, [user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins])

        conn.commit()  # Commit the transaction
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

# untested
def create_user_leaderboard(user_id, elo):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
        INSERT INTO leaderboard (user_id, elo)
        VALUES (%s, %s);
        """

        cursor.execute(sql_command, [user_id, elo])
        conn.commit()  # Commit the transaction

        cursor.close()
        conn.close()

        print(f"User {user_id} with ELO {elo} added to the leaderboard.")

    except psycopg2.Error as e:
        print(f"Error: {e}")

# untested
def get_elo(user_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor() 

        # Get the ELO of the specified user
        cursor.execute("SELECT elo FROM leaderboard WHERE user_id = %s;", [user_id])
        user_elo = cursor.fetchone()

        if not user_elo:
            print(f"User {user_id} not found in the leaderboard.")
            return None

        user_elo = user_elo[0]

        cursor.close()
        conn.close()

        return user_elo

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None
    
# untested
def get_user_stats(user_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor(cursor_factory=DictCursor)

        sql_command = """
        SELECT * FROM user_stats WHERE user_id = %s;
        """

        cursor.execute(sql_command, [user_id])

        result = cursor.fetchone()

        cursor.close()
        conn.close()

        # hard coded elo for now until Sam finishes his function
        return {"status": 0, "stats": result, "elo": get_elo(user_id)}

    except psycopg2.Error as e:
        print(f"Error: {e}")

# untested
def get_global_rank(user_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Get the ELO of the specified user
        cursor.execute("SELECT elo FROM leaderboard WHERE user_id = %s;", [user_id])
        user_elo = cursor.fetchone()

        if not user_elo:
            print(f"User {user_id} not found in the leaderboard.")
            return None

        user_elo = user_elo[0]

        # Calculate the rank of the user
        cursor.execute("SELECT COUNT(*) + 1 FROM leaderboard WHERE elo > %s;", [user_elo])
        rank = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return rank

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None
    
# untested
def create_user(user_id, username, email, password):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
        INSERT INTO users (user_id, username, email, password, profile_pic)
        VALUES (%s, %s, %s, %s, %s);
        """

        cursor.execute(sql_command, [user_id, username, email, password, "LOL"])
        conn.commit()
        cursor.close()
        conn.close()
        create_user_leaderboard(user_id, 100)
        create_user_stats(user_id, 0, 0, 0, 0, get_global_rank(user_id), 0, 0)
        return {"status": 0, "user_id": user_id, "username": username}

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return {"status": -1}
    
#untested
def login_user(username, password):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
        SELECT * FROM users WHERE username = %s AND password = %s;
        """

        cursor.execute(sql_command, [username, password])
        result = cursor.fetchone()

        if result != None:
            cursor.close()
            conn.close()
            return {"status": 0, "user_id": result[0], "username": result[1]}

        cursor.close()
        conn.close()
        return {"status": -1}

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return {"status": -1}

# =================== daily mission stuff ====================================================================

def insert_mission():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "INSERT INTO missions (mission_id, mission_type, mission_number) VALUES (%s, %s, %s);"
        for m in daily_missions:
            cursor.execute(sql_command, [m[0], m[1], m[2]])
            print(f"Mission inserted with ID: {m[0]}")
        conn.commit()  # Commit the transaction

        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None
    
def reset_daily_missions():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "DELETE FROM user_daily_completions;"

        cursor.execute(sql_command)
        conn.commit()  # Commit the transaction

        cursor.close()
        conn.close()

        print("All records from user_daily_completions have been deleted.")

    except psycopg2.Error as e:
        print(f"Error: {e}")

def reset_user_daily_completion():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "DELETE FROM user_daily_completions;"

        cursor.execute(sql_command)
        conn.commit()  # Commit the transaction

        cursor.close()
        conn.close()

        print("All records from user_daily_completions have been deleted.")

    except psycopg2.Error as e:
        print(f"Error: {e}")


# =================== lobby stuff ====================================================================

def create_lobby(room, creator_id, game_mode, difficulty, max_players):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_commands1 = """
            INSERT INTO lobby (lobby_id, creator_id, max_players, num_players, difficulty, game_mode)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        sql_commands2 = """
            INSERT INTO lobby_players (lobby_id, user_id)
            VALUES (%s, %s);
        """

        cursor.execute(sql_commands1, [room, creator_id, max_players, 1, difficulty, game_mode])
        cursor.execute(sql_commands2, [room, creator_id])
        conn.commit()

        # Debugging statements
        print(f"Lobby created with ID: {room}")
        print(f"Lobby players inserted: {creator_id}")

    except psycopg2.Error as e:
        conn.rollback()
        print(f"Error: {e}")

    finally:
        cursor.close()
        conn.close()


def join_lobby(room, user_id):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = "SELECT * FROM lobby WHERE lobby_id = %s;"
        sql_commands2 = "INSERT INTO lobby_players VALUES (%s, %s);"
        sql_commands3 = "UPDATE lobby SET num_players = num_players + 1 WHERE lobby_id = %s;"

        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute(sql_commands1, [room])
        result = cursor.fetchone()

        print(result)
        if result["num_players"] == result["max_players"]:
            cursor.close()
            conn.close()
            return -1

        cursor.execute(sql_commands3, [room])
        cursor.execute(sql_commands2, [room, user_id])
        conn.commit()
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

def leave_lobby(room, user_id):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = "DELETE FROM lobby_players WHERE lobby_id = %s AND user_id = %s RETURNING *;"
        sql_commands2 = "SELECT * FROM lobby WHERE lobby_id = %s;"
        sql_commands3 = "DELETE FROM lobby_players WHERE lobby_id = %s;"
        sql_commands4 = "DELETE FROM lobby WHERE lobby_id = %s;"
        sql_commands5 = "UPDATE lobby SET num_players = num_players - 1 WHERE lobby_id = %s;"


        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute(sql_commands1, [room, user_id])

        deleted = cursor.fetchone()

        if deleted == None:
            return
        
        cursor.execute(sql_commands5, [room])
        conn.commit()
        cursor.execute(sql_commands2, [room])
        result = cursor.fetchone()

        if result["creator_id"] == user_id:
            cursor.execute(sql_commands3, [room])
            cursor.execute(sql_commands4, [room])

        conn.commit()
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

def view_lobby(room):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = """
        SELECT u.username
        FROM lobby AS a 
        JOIN lobby_players AS b ON a.lobby_id = b.lobby_id 
        JOIN users AS u ON b.user_id = u.user_id
        WHERE a.lobby_id = %s;
        """

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [room])
        results = cursor.fetchall()
        players = []
        for row in results:
            players.append(row[0])

        cursor.close()
        conn.close()
        return players

    except psycopg2.Error as e:
        print(f"Error: {e}")

def view_lobbies_userIDs(room):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = """
        SELECT u.user_id
        FROM lobby AS a 
        JOIN lobby_players AS b ON a.lobby_id = b.lobby_id 
        JOIN users AS u ON b.user_id = u.user_id
        WHERE a.lobby_id = %s;
        """

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [room])
        results = cursor.fetchall()
        players = []
        for row in results:
            players.append(row[0])

        cursor.close()
        conn.close()
        return players

    except psycopg2.Error as e:
        print(f"Error: {e}")

def user_id_to_username(user_id):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = """
        SELECT username
        FROM users
        WHERE user_id = %s;
        """

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [user_id])
        result = cursor.fetchone()

        cursor.close()
        conn.close()
        return result[0]

    except psycopg2.Error as e:
        print(f"Error: {e}")

def get_lobbies():
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = """
        SELECT a.lobby_id, a.max_players, a.num_players, a.difficulty, a.game_mode, b.username
        FROM lobby AS a 
        JOIN users AS b ON a.creator_id = b.user_id
        """

        cursor = conn.cursor()
        cursor.execute(sql_commands1)
        results = cursor.fetchall()
        lobbies = []
        for row in results:
            lobbies.append(row)

        cursor.close()
        conn.close()
        return lobbies

    except psycopg2.Error as e:
        print(f"Error: {e}")


def get_lobby(lobby_id):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = """
        SELECT *
        FROM lobby 
        WHERE lobby_id = %s;
        """

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [lobby_id])
        result = cursor.fetchone()

        cursor.close()
        conn.close()
        return result
    
    except psycopg2.Error as e:
        print(f"Error: {e}")

def add_game_score(user_id, game_id, message_id, flow, conciseness, clarity, relevance):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
            INSERT INTO game_scores (user_id, game_id, message_id, flow, conciseness, clarity, relevance)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """

        cursor.execute(sql_command, [user_id, game_id, message_id, flow, conciseness, clarity, relevance])
        conn.commit()

        print(f"Score added for user {user_id} in game {game_id}")

    except psycopg2.Error as e:
        conn.rollback()
        print(f"Error: {e}")

    finally:
        cursor.close()
        conn.close()


    """
    [
    {
        "message_id": 101,
        "flow": 8,
        "conciseness": 7,
        "clarity": 9,
        "relevance": 10
    },
    {
        "message_id": 102,
        "flow": 6,
        "conciseness": 8,
        "clarity": 7,
        "relevance": 9
    },
    {
        "message_id": 103,
        "flow": 9,
        "conciseness": 6,
        "clarity": 8,
        "relevance": 7
    }
    ]
    """
def get_user_game_scores(user_id, game_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = """
            SELECT message_id, flow, conciseness, clarity, relevance
            FROM game_scores
            WHERE user_id = %s AND game_id = %s;
        """

        cursor.execute(sql_command, [user_id, game_id])
        scores = cursor.fetchall()

        # Get column names
        colnames = [desc[0] for desc in cursor.description]

        # Convert the results to a list of dictionaries
        scores_list = [dict(zip(colnames, score)) for score in scores]

        return scores_list

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return []

    finally:
        cursor.close()
        conn.close()

# =================== threads and messaging stuff ====================================================================
def generate_new_thread_id():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "SELECT COALESCE(MAX(thread_id), 0) + 1 FROM thread;"
        cursor.execute(sql_command)
        new_thread_id = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return new_thread_id

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None

# untested
def create_thread(thread_info, thread_name):
    try:
        thread_id = generate_new_thread_id()
        thread_info.append(thread_id)
        conn = psycopg2.connect(db_url)

        sql_commands1 = "INSERT INTO thread VALUES (%s, %s);"

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [thread_id, thread_name])
        conn.commit()

        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")
    
# untested
def send_message(message_id, user_id, thread_id, content):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = "INSERT INTO message VALUES (%s, %s, %s, %s, %s);"

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [message_id, user_id, thread_id, content, datetime.now()])

        conn.commit()

        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

# untested
def retrieve_messages(thread_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "SELECT * FROM message WHERE thread_id = %s ORDER BY created_at;"
        cursor.execute(sql_command, [thread_id])
        messages = cursor.fetchall()

        cursor.close()
        conn.close()

        return messages

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None

def generate_new_message_id():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "SELECT COALESCE(MAX(message_id), 0) + 1 FROM message;"
        cursor.execute(sql_command)
        new_message_id = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return new_message_id

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None


