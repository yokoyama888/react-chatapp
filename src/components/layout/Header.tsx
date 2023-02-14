import { Search2Icon } from "@chakra-ui/icons"
import { Avatar, Box, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { signOut } from "firebase/auth"
import { useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { auth } from "../../config/firebase"
import { FrendSerach } from "../organisms/FrendSerach"

type propsType = {
  userID: string;
}


export const Header = ({userID}:propsType) => {
  // Firebaseのモーダルウインドウ設定用
  const [selectedItem, setSelectedItem] = useState<string>('');
  const onOpenDialog = (name: string) => setSelectedItem(name);
  const onCloseDialog = () => setSelectedItem('');

  // 処理内でのリダイレクト設定用
  const navigate = useNavigate();

  // ログアウト処理
  const onClickSignOut = () => {
    signOut(auth);
    navigate("/login/");
  }

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
  )
}
