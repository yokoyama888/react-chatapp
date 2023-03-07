import { Box } from '@chakra-ui/react';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { ChatMessageList } from '../components/layout/ChatMessageList';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { db } from '../config/firebase';
import { useLoginUser } from '../hooks/useLoginUser';

type locationType = {
  friendRoomID: string;
  friendName: string;
  friendUserID: string;
};

export const Room = () => {
  // URLのパスパラメータを取得
  const { urlParams } = useParams();

  // Linkからの値を管理
  const location = useLocation();
  const { friendRoomID, friendName, friendUserID } = location.state as locationType;

  //ログインユーザーの情報取得
  const { loginUser } = useLoginUser();
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    if (loginUser) {
      setUserID(loginUser.uid);

      const userCollectionRef = doc(db, "users", loginUser!.uid);
      getDoc(userCollectionRef).then((docSnap: DocumentData | undefined) => {
        setUserName(docSnap?.data().name);
        setIconUrl(docSnap?.data().icon);
      });
    }
  }, [loginUser]);

  return (
    <>
      {!loginUser ? (
        <Navigate to={`/room/${urlParams}`} />
      ) : (
        <Box minH="100vh" bg="gray.100">
          <Sidebar userID={userID} />
          <Header userID={userID} userName={userName} iconUrl={iconUrl} />
          <ChatMessageList userID={userID} loginUser={loginUser} roomID={friendRoomID} roomName={friendName} />
        </Box>
      )}
    </>
  )
}
