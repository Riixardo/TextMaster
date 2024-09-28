import React from "react";

export default function LeaderboardCard({ placing, username, points, profilePic }) {
    return (
        <div className="leaderboard-card" style={styles.card}>
            <div style={styles.placing}>{placing}</div>
            <img src={profilePic} alt={`${username}'s profile`} style={styles.profilePic} />
            <div style={styles.username}>{username}</div>
            <div style={styles.points}>{points} pts</div>
        </div>
    );
}

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '700px', 
    },
    placing: {
        width: '50px',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    profilePic: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginLeft: '10px',
    },
    username: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: '18px',
        marginLeft: '30px',
    },
    points: {
        fontWeight: 'bold',
        fontSize: '18px',
        marginLeft: '10px',
        marginRight: '30px',
    },
};