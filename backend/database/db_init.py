import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DB_URL")

try:
    conn = psycopg2.connect(db_url)

    with open("schema.sql", 'r') as sql_file:
        sql_commands = sql_file.read()

    cursor = conn.cursor()
    cursor.execute(sql_commands)
    conn.commit()
    cursor.close()
    conn.close()

except psycopg2.Error as e:
    print(f"Error: {e}")