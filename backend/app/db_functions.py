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
def create_user(user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins):
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

        sql_commands1 = "INSERT INTO lobby VALUES (%s, %s, %s, %s, %s, %s);"
        sql_commands2 = "INSERT INTO lobby_players VALUES (%s, %s);"

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [room, creator_id, max_players, 0, difficulty, game_mode])
        cursor.execute(sql_commands2, [room, creator_id])
        conn.commit()
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")


def join_lobby(room, user_id):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = "SELECT * FROM lobby WHERE lobby_id = %s;"
        sql_commands2 = "INSERT INTO lobby_players VALUES (%s, %s);"

        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute(sql_commands1, [room])
        result = cursor.fetchone()

        print(result)
        if result["num_players"] == result["max_players"]:
            cursor.close()
            conn.close()
            return -1

        cursor.execute(sql_commands2, [room, user_id])
        conn.commit()
        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

def leave_lobby(room, user_id):
    try:
        print("PWOAKDPOAKWDPOKWD")
        conn = psycopg2.connect(db_url)

        sql_commands1 = "DELETE FROM lobby_players WHERE lobby_id = %s AND user_id = %s;"
        sql_commands2 = "SELECT * FROM lobby WHERE lobby_id = %s;"
        sql_commands3 = "DELETE * FROM lobby_players WHERE lobby_id = %s;"
        sql_commands4 = "DELETE * FROM lobby WHERE lobby_id = %s;"

        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute(sql_commands1, [room, user_id])
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

# =================== threads and messaging stuff ====================================================================

# untested
def create_thread(thread_id, thread_name):
    try:
        conn = psycopg2.connect(db_url)

        sql_commands1 = "INSERT INTO thread VALUES (%s, %s);"

        cursor = conn.cursor()
        cursor.execute(sql_commands1, [thread_id, thread_name])


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


        cursor.close()
        conn.close()

    except psycopg2.Error as e:
        print(f"Error: {e}")

# untested
def retrieve_messages(thread_id):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        sql_command = "SELECT * FROM message WHERE thread_id = %s ORDER BY timestamp;"
        cursor.execute(sql_command, [thread_id])
        messages = cursor.fetchall()

        cursor.close()
        conn.close()

        return messages

    except psycopg2.Error as e:
        print(f"Error: {e}")
        return None


