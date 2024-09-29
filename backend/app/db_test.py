import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv
from datetime import datetime
from db_functions import *

load_dotenv()

db_url = os.getenv("DB_URL")


# Unique Test Data
test_user_id = "test_user"
test_username = "testuser"
test_email = "testuser@example.com"
test_password = "franklovesrichardschema"
test_profile_pic = "testpic.png"
test_games_played = 10
test_time_played = 3600
test_games_won = 5
test_games_lost = 5
test_global_ranking = 1
test_gems = 100
test_coins = 200
test_elo = 1500
test_room = "test_room"
test_creator_id = test_user_id
test_game_mode = "timed 1"
test_difficulty = "novice"
test_max_players = 4
test_thread_id = 1
test_thread_name = "test_thread"
test_message_id = 1
test_content = "Hello, world!"

def run_schema():
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Read the schema file
        with open('backend/database/schema.sql', 'r') as file:
            schema_sql = file.read()

        # Execute the schema SQL
        cursor.execute(schema_sql)
        conn.commit()

        cursor.close()
        conn.close()
        print("Schema executed successfully.")
    except psycopg2.Error as e:
        print(f"Error executing schema: {e}")


# Test functions
def test_functions():
    run_schema()
    # Test create_user_stats
    create_user(test_user_id, test_username, test_email, test_password,test_profile_pic)

    create_user_stats(test_user_id, test_games_played, test_time_played, test_games_won, test_games_lost, test_global_ranking, test_gems, test_coins)

    
    # Test create_user_leaderboard
    create_user_leaderboard(test_user_id, test_elo)

    # Test get_global_rank
    rank = get_global_rank(test_user_id)
    print(f"Global rank of {test_user_id}: {rank}")

    # Test insert_mission
    insert_mission()

    # Test reset_daily_missions
    reset_daily_missions()
    
    # Test create_thread
    create_thread(test_thread_id, test_thread_name)

    # Test send_message
    send_message(test_message_id, test_user_id, test_thread_id, test_content)

    # Test retrieve_messages
    messages = retrieve_messages(test_thread_id)
    print(f"Messages in thread {test_thread_id}: {messages}")

if __name__ == "__main__":
    test_functions()