import { Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,Icon, Button, VStack, StackDivider, Box } from "@chakra-ui/react";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { db } from "../../config/firebase";
import { useLoginUser } from "../../hooks/useLoginUser";

export const FrendSerach = (props: any) => {

  const { selectedItem, onCloseDialog, loginUserID } = props;

  // ユーザー検索管理
  const [searchText, setSearchText] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  // フレンド検索入力内容保存
  const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchText(event.target.value);

  // Firestoreからユーザーを検索
  const onClickSearchUser = async () => {
    const userQuery = query(collection(db, "users"), where("email", "==", searchText));
    await getDocs(userQuery).then(snapshot => {
      let users: any = [];
      snapshot.docs.forEach(doc => {
        let userDate = {
          id: doc.id,
          userName: doc.data().name,
        }
        users = [...users, userDate];
        setSearchUsers(users);
      });
    }).catch(error => {
      console.log(error);
    });
  }

  // フレンド追加処理
  const onClickFriendAdd = async (friendID: string) => {
    //ルームIDを作成する
    const roomIdNumber:any = [];
    const min = 1, max = 10;
    const intRandom:any = (min:number, max:number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    for(let i = min; i <= max; i++){
      while(true){
        let tmp = intRandom(min, max);
        if(!roomIdNumber.includes(tmp)){
          roomIdNumber.push(tmp);
          break;
        }
      }
    }
    const strRoomIdNumber = "rid" + roomIdNumber.join('');
    //フレンドに追加する、現在ログイン中のユーザー情報
    const friendAddMyUserDate = {
      roomID: strRoomIdNumber,
      userID: loginUserID,
    }
    //ログイン中のユーザーに追加するフレンド情報
    const userAddFriendDate = {
      roomID: strRoomIdNumber,
      userID: friendID,
    }
    // ログイン中のユーザーのサブコレクション（friends）に接続
    const friendUserCollectionRef = collection(db, "users", friendID, "friendUsers");
    const myUserFriendsCollectionRef = collection(db, "users", loginUserID, "friendUsers");

    setDoc(doc(friendUserCollectionRef), friendAddMyUserDate);
    setDoc(doc(myUserFriendsCollectionRef), userAddFriendDate);
  }

  return (
    <>
      <Modal isOpen={'userSearch' === selectedItem} onClose={onCloseDialog}>
        <ModalOverlay />
        <ModalContent maxW="700px">
          <ModalHeader>ユーザーを検索</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justify="center">
              <HStack bgColor="white" borderRadius="10px">
                <Icon
                  as={FiSearch}
                  fontSize="27px"
                  color="teal.500"
                  ml="8px"
                  w="30px"
                />
                <Input
                  border="none"
                  outline="transparent solid 2px"
                  placeholder="メールアドレスを入力してください..."
                  w="530px"
                  h="65px"
                  onChange={onChangeSearchText}
                  value={searchText}
                  />
                  <Button w="80px" h="45px" colorScheme='teal' onClick={onClickSearchUser}>
                    検索
                  </Button>
              </HStack>
            </Flex>
            {searchUsers && (
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              >
              {searchUsers.map(({ userName, id }):any => (
                <Flex pt="30px" pb="30px" key={id} justifyContent="space-between">
                  <Box fontSize="18px">{userName}</Box>
                  <Button
                  variant="solid"
                  bg="#0D74FF"
                  color="white"
                    size="md"
                    onClick={() => onClickFriendAdd(id)}
                  >友達に追加する</Button>
                </Flex>
              ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
