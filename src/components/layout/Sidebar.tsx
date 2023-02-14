import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { collection, doc, DocumentData, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiHome, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";

type propsType = {
  userID: string;
}

export const Sidebar = ({ userID }:propsType) => {
  //フレンドリスト管理
  const [friendList, setFriendList] = useState<Array<any>>([]);

    //フレンド情報を取得
    useEffect(() => {
      if (userID) {
        //Firestoreのサブコレクションのfriendsに接続
        const myFriendsCollectionRef = collection(db, "users", userID, "friendUsers");
        onSnapshot(myFriendsCollectionRef,
          (snapshot) => {
            let friendUsers: any = [];
            snapshot.docs.forEach((docValue: any) => {
              let friendUserID = docValue.data().userID;

              // フレンドのユーザー情報を取得
              const friendCollectionRef = doc(db, "users", friendUserID);
              getDoc(friendCollectionRef).then((docSnap: DocumentData | undefined) => {
                let friendUserDate = {
                  userID: friendUserID,
                  roomID: docValue.data().roomID,
                  friendName: docSnap?.data().name,
                }
                friendUsers = [...friendUsers, friendUserDate];

                //フレンド情報を格納
                setFriendList(friendUsers);
              });
            })
          })
      }
    }, [userID]);

  return (
      <Box
      transition="3s ease"
      bg="blue.50"
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full">
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      <Link to={`/`}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}>
          <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={FiHome}
            />
          Home
        </Flex>
        </Link>
        {friendList.length !== 0 && (
          <>
            {friendList.map(({ friendName, roomID, userID }:{friendName:string, roomID:string, userID:string }) => (
            <Link key={roomID} to={`/room/${roomID}`} state={{ friendRoomID: roomID, friendName, friendUserID: userID}}>
              <Flex
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              _hover={{
              bg: 'cyan.400',
              color: 'white',
              }}
              key={roomID}>
              <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                  color: 'white',
                }}
                as={FiUser}
              />
              {friendName}
                  </Flex>
            </Link>
            ))}
          </>
        )}
    </Box>
  );
};
