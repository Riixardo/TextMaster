import React from "react";

export default function ProfileCard({ username, profilePic }) {
    return (
        <div className="profile-card text-black bg-[#D9D9D9] h-[20%] rounded-xl">
            <div className="w-full h-full p-6 flex">
                <img src={profilePic} alt={`${username}'s profile`} className="h-full rounded-full"/>
                <div className="w-full font-bold text-xl flex flex-col h-full px-4">
                    <div className="text-left">{username}</div>
                    <div className="h-full w-full flex">
                        <img src="/rank1.svg" className="h-[50px] mt-auto"></img>
                        <p className="text-center w-full">Lvl 1438</p>
                    </div>
                </div>
            </div>
        </div>
    );
}