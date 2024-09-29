import { useEffect, useState, useRef } from "react"
import { useRouter} from 'next/router';
import Sidebar from "@/components/side_bar";
import ProfileCard from "@/components/profile_card";

// this is a room 
const Room = ({ players = [], leaveRoom, startRoom }) => {

  const router = useRouter();
  const { id } = router.query;

  // harcoded for now
  const username = sessionStorage.getItem("username");
  const user_id = sessionStorage.getItem("user_id");

  const [selectedButton, setSelectedButton] = useState(null);
  const headingRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState('auto');
   
  useEffect(() => {
      if (headingRef.current) {
          setButtonWidth(headingRef.current.offsetWidth);
      }
  }, []);

  const handleButtonClick = (buttonIndex) => {
      setSelectedButton(buttonIndex);
  }; 

  return (
    <div className="min-h-screen w-screen" style={{ display: 'flex' }}>
        <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />
        <div style={{backgroundColor: '#FFFFFF', flex:1, padding: '33px', textAlign:'center'}}>
            <h1 className="text-4xl mt-5" style = {{color: '#4a4aff'}}>Multiplayer Room</h1>
            <div style={{overflowY: 'scroll', height:"400px"}}>
                <div style={{display: 'flex', flexDirection: 'row', paddingTop:'40px', gap:'100px'}}>
                    <div style={{paddingRight:'20px'}}>
                        <div style={styles.gridContainer}>
                            {players.length > 0 && players.map((user, index) => (
                            <ProfileCard
                                key={index}
                                username={user}
                                profilePic={"https://via.placeholder.com/40"}
                            />
                            ))} 
                        </div>
                        <button onClick={() => {
                          leaveRoom(id, username, user_id);
                          router.push("/multiplayer/rooms");
                        }}>LEAVE ROOM</button>
                        <button onClick={() => startRoom(id)}>START GAME</button>
                    </div>
                </div>    
            </div>     
        </div>    
    </div>
);
};

const styles = {
  gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Two columns
      gap: '20px', // Gap between grid items
  },
};

export default Room;