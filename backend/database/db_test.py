import unittest
import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv
from datetime import datetime
from backend.app.db_functions import (
    create_user, create_user_stats, create_user_leaderboard, get_global_rank,
    insert_mission, reset_daily_missions, reset_user_daily_completion,
    create_lobby, join_lobby, leave_lobby, view_lobby,
    create_thread, send_message, retrieve_messages
)

load_dotenv()

db_url = os.getenv("DB_URL")

class TestDBFunctions(unittest.TestCase):

    def setUp(self):
        try:
            self.conn = psycopg2.connect(db_url)
            self.cursor = self.conn.cursor()
            print("Database connection established.")
            
            # Insert a test user
            self.cursor.execute("""
                INSERT INTO users (user_id, username, email, profile_pic)
                VALUES ('test_user', 'Test User', 'test_user@example.com', 'profile_pic_url')
                ON CONFLICT (user_id) DO NOTHING;
            """)
            self.conn.commit()
        except psycopg2.Error as e:
            print(f"Error setting up the database connection: {e}")

    def tearDown(self):
        self.cursor.execute("DELETE FROM users WHERE user_id = 'test_user';")
        self.conn.commit()
        self.conn.close()

    def test_create_user(self):
        create_user('test_user2', 10, 1000, 5, 5, 1, 100, 200)
        self.cursor.execute("SELECT * FROM user_stats WHERE user_id = %s;", ['test_user2'])
        user = self.cursor.fetchone()
        self.assertIsNotNone(user)
        self.assertEqual(user[0], 'test_user2')

    def test_create_user_stats(self):
        create_user_stats('test_user_stats', 20, 2000, 10, 10, 2, 200, 400)
        self.cursor.execute("SELECT * FROM user_stats WHERE user_id = %s;", ['test_user_stats'])
        user = self.cursor.fetchone()
        self.assertIsNotNone(user)
        self.assertEqual(user[0], 'test_user_stats')

    def test_create_user_leaderboard(self):
        create_user_leaderboard('test_user_leaderboard', 1500)
        self.cursor.execute("SELECT * FROM leaderboard WHERE user_id = %s;", ['test_user_leaderboard'])
        user = self.cursor.fetchone()
        self.assertIsNotNone(user)
        self.assertEqual(user[0], 'test_user_leaderboard')

    def test_get_global_rank(self):
        create_user_leaderboard('test_user_rank', 1500)
        rank = get_global_rank('test_user_rank')
        self.assertIsNotNone(rank)

    def test_insert_mission(self):
        insert_mission()
        self.cursor.execute("SELECT * FROM missions;")
        missions = self.cursor.fetchall()
        self.assertGreater(len(missions), 0)

    def test_reset_daily_missions(self):
        reset_daily_missions()
        self.cursor.execute("SELECT * FROM user_daily_completions;")
        completions = self.cursor.fetchall()
        self.assertEqual(len(completions), 0)

    def test_reset_user_daily_completion(self):
        reset_user_daily_completion()
        self.cursor.execute("SELECT * FROM user_daily_completions;")
        completions = self.cursor.fetchall()
        self.assertEqual(len(completions), 0)

    def test_create_lobby(self):
        create_lobby('test_room', 'test_user', 'timed 1', 'novice', 4)
        self.cursor.execute("SELECT * FROM lobby WHERE lobby_id = %s;", ['test_room'])
        lobby = self.cursor.fetchone()
        self.assertIsNotNone(lobby)
        self.assertEqual(lobby[0], 'test_room')

    def test_join_lobby(self):
        create_lobby('test_room_join', 'test_user', 'timed 1', 'novice', 4)
        result = join_lobby('test_room_join', 'test_user')
        self.assertNotEqual(result, -1)

    def test_leave_lobby(self):
        create_lobby('test_room_leave', 'test_user', 'timed 1', 'novice', 4)
        join_lobby('test_room_leave', 'test_user')
        leave_lobby('test_room_leave', 'test_user')
        self.cursor.execute("SELECT * FROM lobby_players WHERE lobby_id = %s AND user_id = %s;", ['test_room_leave', 'test_user'])
        player = self.cursor.fetchone()
        self.assertIsNone(player)

    def test_view_lobby(self):
        create_lobby('test_room_view', 'test_user', 'timed 1', 'novice', 4)
        join_lobby('test_room_view', 'test_user')
        players = view_lobby('test_room_view')
        self.assertIn('Test User', players)

    def test_create_thread(self):
        create_thread('test_thread', 'Test Thread')
        self.cursor.execute("SELECT * FROM thread WHERE thread_name = %s;", ['Test Thread'])
        thread = self.cursor.fetchone()
        self.assertIsNotNone(thread)
        self.assertEqual(thread[1], 'Test Thread')

    def test_send_message(self):
        create_thread('test_thread_message', 'Test Thread')
        send_message('test_message', 'test_user', 'test_thread_message', 'Hello, world!')
        self.cursor.execute("SELECT * FROM message WHERE content = %s;", ['Hello, world!'])
        message = self.cursor.fetchone()
        self.assertIsNotNone(message)
        self.assertEqual(message[3], 'Hello, world!')

    def test_retrieve_messages(self):
        create_thread('test_thread_retrieve', 'Test Thread')
        send_message('test_message_1', 'test_user', 'test_thread_retrieve', 'Hello, world!')
        send_message('test_message_2', 'test_user', 'test_thread_retrieve', 'Hello again!')
        messages = retrieve_messages('test_thread_retrieve')
        self.assertEqual(len(messages), 2)

if __name__ == '__main__':
    unittest.main()