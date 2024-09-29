import unittest
import psycopg2
from db_functions import create_user, send_message
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DB_URL")

class TestDBFunctions(unittest.TestCase):

    def setUp(self):
        print("Setting up the database connection...")
        # Set up a connection to the database
        self.conn = psycopg2.connect(db_url)
        self.cursor = self.conn.cursor()

        # Create a test user
        print("Inserting test user...")
        self.cursor.execute("INSERT INTO users (user_id) VALUES ('test_user');")
        self.conn.commit()

    def tearDown(self):
        print("Cleaning up the database...")
        # Clean up the database
        self.cursor.execute("DELETE FROM user_stats WHERE user_id = 'test_user';")
        self.cursor.execute("DELETE FROM users WHERE user_id = 'test_user';")
        self.conn.commit()

        # Close the connection
        self.cursor.close()
        self.conn.close()

    def test_create_user(self):
        print("Testing create_user function...")
        # Test creating a user
        create_user('test_user', 0, 1, 0, 0, 1000, 0, 0)
        self.cursor.execute("SELECT * FROM user_stats WHERE user_id = 'test_user';")
        user_stats = self.cursor.fetchone()
        print("User stats fetched:", user_stats)
        self.assertIsNotNone(user_stats)
        self.assertEqual(user_stats[0], 'test_user')

    def test_send_message(self):
        print("Testing send_message function...")
        # Test sending a message
        create_thread('test_thread', 'Test Thread')
        send_message('test_message', 'test_user', 'test_thread', 'Hello, world!')
        self.cursor.execute("SELECT * FROM messages WHERE message_id = 'test_message';")
        message = self.cursor.fetchone()
        print("Message fetched:", message)
        self.assertIsNotNone(message)
        self.assertEqual(message[0], 'test_message')

if __name__ == '__main__':
    unittest.main()