import { Box, Button, Flex, Heading, Image, Stack, Text, Textarea } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

type propsType = {
  userID: string;
  loginUser: User;
  roomID: string;
  roomName?: string;
}

export const ChatMessageList = ({userID, loginUser, roomID, roomName}:propsType) => {
  //メッセージ管理
  const [message, setMessage] = useState("");
  const messagecollectionRef = collection(db, "messages");

  // メッセージ管理
  const [messageList, setMessageList] = useState<Array<String | undefined>>([]);

  // 入力欄に入力された文字を保存
  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setMessage(event.target.value);

  // 送信ボタンをクリックしたらメッセージをFirebaseに保存
  const onClickMessageSave = async () => {
    if (message === "") return;

    await addDoc(messagecollectionRef, {
      texts: message,
      userID,
      roomID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setMessage("");
  }

    // Firebaseからメッセージをリアルタイム取得
    useEffect((): void => {
      if (loginUser) {
        const queryMessage = query(messagecollectionRef, where("roomID", "==", roomID), orderBy("createdAt"));
        onSnapshot(queryMessage, (querySnapshot) => {
          let getMessageList:any = [];
          querySnapshot.docs.forEach((querySnapshotData: any) => {
            const userCollectionRef = doc(db, "users", querySnapshotData.data().userID);
            getDoc(userCollectionRef).then((userDocSnap: DocumentData | undefined) => {
              const setMessageDate = {
                id: querySnapshotData.id,
                messageText: querySnapshotData.data().texts,
                senderName: userDocSnap?.data().name,
              }
              getMessageList = [...getMessageList, setMessageDate];
              setMessageList(getMessageList);
            });
          });
        });
      }
    }, [loginUser, roomID]);

  return (
    <Box ml={{ base: 0, md: 60 }} p="6">
      <Heading as="h2" fontSize="2xl" marginBottom="20px" pb="15px" borderBottom="1px" borderColor="black">
        {roomName ? roomName : "マイルーム"}
      </Heading>
      <Stack spacing={4} p="20px 30px 50px" overflowY="auto" maxH="500px" mb="50px" bg="white">
        {messageList.map(({ id, messageText, senderName }: any) => (
          <Box pt="20px" pb="30px" borderBottom="1px" borderColor="black" key={id}>
            <Flex w="500px" mb="5px" align="center">
              <Box w="55px" h="55px" borderRadius="100%" overflow="hidden" mr="3">
                <Image
                  h="100%"
                  fit="cover"
                  align="center"
                  src="https://thumb.photo-ac.com/b9/b9ccccbfd33ef11ab3c863218c93bab6_w.jpeg" />
              </Box>
              <Text fontSize="xl" fontWeight="bold">{senderName}</Text>
            </Flex>
            <Box ml="70px">
              <Text>
                {messageText}
              </Text>
            </Box>
          </Box>
        ))}

      </Stack>
      <Box>
        <Flex justify="flex-end" align="center" mb="10px">
          <Button
            variant="solid"
            bg="#0D74FF"
            color="white"
            onClick={onClickMessageSave}
          >送信</Button>
        </Flex>
        <Textarea
          bg="white"
          value={message}
          size="lg"
          h="200px"
          onChange={onChangeMessage}
          placeholder="メッセージを入力してください..."
        />
      </Box>
    </Box>
  );
}
