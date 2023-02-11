import { Search2Icon } from '@chakra-ui/icons';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Image,
  Heading,
  Button,
  Textarea,
} from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { addDoc, collection, doc, DocumentData, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FiHome,
  FiMenu,
  FiChevronDown,
  FiUser
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FrendSerach } from '../components/organisms/FrendSerach';
import { auth, db } from '../config/firebase';
import { useLoginUser } from '../hooks/useLoginUser';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export const Home = () => {
  // Firebaseのモーダルウインドウ設定用
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const onOpenDialog = (name: string) => setSelectedItem(name);
  const onCloseDialog = () => setSelectedItem('');

  //メッセージ管理
  const [message, setMessage] = useState("");
  const messagecollectionRef = collection(db, "messages");
  const [messageList, setMessageList] = useState<Array<String | undefined>>([]);

  //ログインユーザーの情報取得
  const { loginUser } = useLoginUser();
  const [userID, setUserID] = useState("");
  const [roomID, setRoomID] = useState("");

  //フレンドリスト管理
  const [friendList, setFriendList] = useState<Array<any>>([]);

  // 処理内でのリダイレクト設定用
  const navigate = useNavigate();

  useEffect(() => {
    if (loginUser) {
      setUserID(loginUser.uid);

      const userCollectionRef = doc(db, "users", loginUser!.uid);
      getDoc(userCollectionRef).then((docSnap: DocumentData | undefined) => {
        setRoomID(docSnap?.data().myroomID);
      });
    }
  }, [loginUser]);

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

  // ログアウト処理
  const onClickSignOut = () => {
    signOut(auth);
    navigate("/login/");
  }

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

  //サイドバー
  const SidebarContent = ({ onClose }: SidebarProps) => {
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
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
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
        {friendList.length !== 0 && (
          <>
          {friendList.map(({friendName, roomID}) => (
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
          ))}
          </>
        )}
      </Link>
    </Box>
    );
  };

  // スマホナビゲーション
  const MobileNav = ({ onOpen }: MobileProps) => {
    return (
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg="blue.900"
        color="white"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex onClick={() => onOpenDialog('userSearch')} alignItems={'center'} cursor="pointer" _hover={{opacity: ".7"}}>
          <Search2Icon boxSize={4} mr="2" />
          <Text>ユーザーを検索</Text>
        </Flex>
        <FrendSerach selectedItem={selectedItem} onCloseDialog={onCloseDialog} loginUserID={userID} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')} color="black">
              <MenuItem onClick={onClickSignOut}>サインアウト</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
    );
  };

  return (
    <>
      <Box minH="100vh" bg="gray.100">
        <SidebarContent
          onClose={() => onClose}
          display={{ base: 'none', md: 'block' }}
        />
        <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="6">
          {/* コンテンツ */}
          <Heading as="h2" fontSize="2xl" marginBottom="20px" pb="15px" borderBottom="1px" borderColor="black">
            マイチャット
          </Heading>
          <Stack spacing={4} p="20px 30px 50px" overflowY="auto" maxH="500px" mb="50px" bg="white">
            {messageList.map(({id, messageText, senderName}:any) => (
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
            />
          </Box>
          {/* コンテンツここまで */}
        </Box>
      </Box>
    </>
  )
}
