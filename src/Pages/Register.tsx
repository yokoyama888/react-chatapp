import { Box, Flex, Heading, Stack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink, Alert, AlertIcon } from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export const Register = () => {
  //登録完了フラグ管理
  const [registerFlg, setRegisterFlg] = useState(false);
  // 登録失敗フラグ管理
  const [registerErrorFlg, setRegisterErrorFlg] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const onClickRegister = () => {
    setRegisterFlg(false);
    setRegisterErrorFlg(false);

    try {
      // FireBaseのAuth登録を実施
      createUserWithEmailAndPassword(
      auth,
      registerEmail,
      registerPassword
      ).then((data:any) => {

        //ユーザーID
        const uid = data.user.uid;

        // 10桁のRoomIDを生成
        const roomIdNumber: any = [];
        // 最小値と最大値
        const min = 1, max = 10;
        const intRandom:any = (min:number, max:number) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        // 重複チェックしながら乱数作成
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

        // FireStoreのUsersにユーザー情報を登録
        const userData = {
          name: registerName,
          email: registerEmail,
          myroomID: strRoomIdNumber,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        // FireStoreのUsersコレクション情報
        const usersDocumentRef = doc(db, "users", uid);
        setDoc(usersDocumentRef, userData);

        // 登録通知を表示
        setRegisterFlg(true);

        // 各値をリセット
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");

      }).catch((error) => {
        setRegisterErrorFlg(true);
        console.log(error.message);
      })

    } catch (error) {
      setRegisterErrorFlg(true);

      console.log("登録自体失敗");
    }

  };

  return (
    <>
      {registerFlg && (
        <>
          <Alert status="success">
            <AlertIcon />
            ユーザーを登録しました！
          </Alert>
          <Navigate to={'/'} />
        </>
      )}
      {registerErrorFlg && (
        <Alert status="error">
          <AlertIcon />
          ユーザーの登録に失敗しました！
        </Alert>
      )}
      <Flex align="center" justify="center" height="100vh" backgroundColor="blue.50">
        <Box bg="white" w="lg" p={4} borderRadius="md" shadow="md">
          <Heading as="h1" size="lg" textAlign="center">会員登録</Heading>
          <Stack spacing={6} py={4} px={10}>
            <FormControl isRequired>
              <FormLabel>ユーザー名</FormLabel>
              <Input
                type="text"
                placeholder="たろう"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="email"
                placeholder="aaaa@a.co.jp"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>パスワード</FormLabel>
              <Input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="messenger"
              onClick={onClickRegister}
            >
              会員登録
            </Button>
            <Text textAlign="center">
              ログインは<ChakraLink as={RouterLink} to="/login/" color="linkedin.900" textDecoration="underline">こちら</ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}
