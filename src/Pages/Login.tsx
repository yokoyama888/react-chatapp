import { Box, Flex, Heading, Stack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink, Alert, AlertIcon } from "@chakra-ui/react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useLoginUser } from "../hooks/useLoginUser";

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorFlg, setErrorFlg] = useState(false);

  //ログイン状態管理
  const {loginUser} = useLoginUser();

  //ログイン処理
  const onClickLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
    } catch (error) {
      setErrorFlg(true);
    }
  };

  return (
    <>
      {loginUser ? (
        <>
          <Alert status="success">
            <AlertIcon />
            ログインしました！
          </Alert>
          <Navigate to={'/'} />
        </>
      ) : (
        <Flex align="center" justify="center" height="100vh" backgroundColor="blue.50">
          <Box bg="white" w="lg" p={4} borderRadius="md" shadow="md">
            <Heading as="h1" size="lg" textAlign="center">ログイン画面</Heading>
            <Stack spacing={6} py={4} px={10}>
              <FormControl isRequired>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                  type="email"
                  placeholder="aaaa@a.co.jp"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>パスワード</FormLabel>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme="messenger"
                onClick={onClickLogin}
              >
                ログイン
              </Button>
              <Text textAlign="center">
                新規登録は<ChakraLink as={RouterLink} to="/register/" color="linkedin.900" textDecoration="underline">こちら</ChakraLink>
              </Text>
            </Stack>
          </Box>
        </Flex>
      )}
    </>
  );
}
