import { Box } from '@chakra-ui/react';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ChatMessageList } from '../components/layout/ChatMessageList';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { db } from '../config/firebase';
import { useLoginUser } from '../hooks/useLoginUser';

export const Home = () => {

  //ログインユーザーの情報取得
  const { loginUser } = useLoginUser();
  const [userID, setUserID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [userName, setUserName] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  // ログインしているユーザー情報を取得
  useEffect(() => {
    if (loginUser) {
      setUserID(loginUser.uid);

      const userCollectionRef = doc(db, "users", loginUser!.uid);
      getDoc(userCollectionRef).then((docSnap: DocumentData | undefined) => {
        setRoomID(docSnap?.data().myroomID);
        setUserName(docSnap?.data().name);
        setIconUrl(docSnap?.data().icon);
      });
    }
  }, [loginUser]);


  return (
    <>
      {!loginUser ? (
        <Navigate to={"/login/"} />
      ) : (
        <Box minH="100vh" bg="gray.100">
          <Sidebar userID={userID} />
          <Header userID={userID} userName={userName} iconUrl={iconUrl} />
          <ChatMessageList userID={userID} loginUser={loginUser} roomID={roomID} />
        </Box>
      )}
    </>
  )
}
