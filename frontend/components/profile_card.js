import React from "react";

export default function profileCard({ username, profilePic }) {
    return (
        <div className="profile-card text-black" style={profileStyles.card}>
            <img src={profilePic} alt={`${username}'s profile`} style={profileStyles.profilePic} />
            <div style={profileStyles.username}>{username}</div>
        </div>
    );
}

const profileStyles = {
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
};