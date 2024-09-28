import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DB_URL")

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