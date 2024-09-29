const RoomBlock = ({text, id, joinRoom}) => {

    // harcoded for now
    const username = sessionStorage.getItem("username")
    const user_id = sessionStorage.getItem("user_id")

    return (
        <div className="ml-8 rounded-xl bg-gray-200 p-4 w-[80%] mb-8 text-black text-center h-[15vh] hover:bg-[#333333]" onClick={() => joinRoom(id, username, user_id)}>{text}</div>
    )
}

export default RoomBlock;