import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  ChakraProvider,
  Center,
  Alert,
  AlertIcon,
  Link,
  Divider,
  InputGroup,
  Image,
  InputRightElement,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";

export default function Auth() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const siteUrl = router.asPath;
  let siteUrlComplete = "https://www.watchtodayguide.com" + siteUrl;
  //let siteUrlComplete = "http://localhost:3000" + siteUrl;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    setAlertMessage("");
    try {
      const { user, error, status } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          redirectTo: siteUrlComplete,
        },
      });
      setAlertMessage("Check your Email");
      if (user) {
        console.log("User successfully registered:", user);
        setAlertMessage("Check your Email");
      } else if (error) {
        if (status === 429) {
          console.log("Status 429 - Too Many Request");
          setAlertMessage("Too Many Requests. Take a moment.");
        } else {
          console.error("Error, try again:", error);
          setAlertMessage(error.message);
        }
      }
    } catch (e) {
      console.error("Error:", e);
      setAlertMessage(e.message);
    }
  };

  const handleSignIn = async () => {
    setAlertMessage("");
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        options: {
          redirectTo: siteUrlComplete,
        },
      });
      if (error) {
        throw error;
      }
      setAlertMessage("User Logging In..");
      router.push("/");
      console.log(user);
      console.log(session);
    } catch (e) {
      setAlertMessage(e.message);
    }
  };
  const changeForm = () => {
    setIsSignUp((value) => !value);
  };

  const handleGoogleSignIn = async () => {
    setAlertMessage("");
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: siteUrlComplete,
        },
      });
      if (error) {
        throw error;
      }
      setAlertMessage("Logging In");
      const currentUrl = router.asPath;
      router.push(currentUrl);
    } catch (e) {
      setAlertMessage(e.message);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ChakraProvider>
      <>
        <ChakraProvider>
          <Center>
            {session ? (
              <p>
                User: {session.user.email} <br />
                <Center>
                  <Button
                    onClick={() => supabase.auth.signOut()}
                    colorScheme="red"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </Center>
              </p>
            ) : null}
          </Center>
        </ChakraProvider>
      </>
      <Center height="70vh">
        <Box
          p={2}
          borderWidth="2px"
          maxW="350px"
          width="100%"
          position="relative"
          marginTop={5}
        >
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            mb={4}
            style={{ color: "#7657be" }}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </Heading>
          <FormControl>
            <FormLabel style={{ color: "#7657be" }}>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel style={{ color: "#7657be" }}>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.5rem"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Link
            style={{ color: "#7657be" }}
            href="https://www.watchtodayguide.com/send-email-password-reset"
          >
            Forgot your password?
          </Link>

          <Center>
            {isSignUp && (
              <Button
                mt={4}
                size="md"
                onClick={handleSignUp}
                style={{ color: "#7657be" }}
              >
                Sign Up
              </Button>
            )}
            {!isSignUp && (
              <Button
                mt={4}
                style={{ color: "#7657be" }}
                size="md"
                onClick={handleSignIn}
              >
                Login
              </Button>
            )}
          </Center>
          <br />
          {alertMessage && (
            <ChakraProvider>
              <Alert status="info">
                <AlertIcon />
                {alertMessage === "Email not confirmed"
                  ? "E-mail not confirmed"
                  : alertMessage}
              </Alert>
            </ChakraProvider>
          )}
          <Divider my={4} />
          <Center>
            <Button
              mt={4}
              style={{ color: "#7657be" }}
              size="md"
              leftIcon={<FaGoogle />}
              onClick={handleGoogleSignIn}
            >
              Login with Google
            </Button>
          </Center>
          <br />
          <Center>
            <Link
              onClick={changeForm}
              cursor="pointer"
              style={{ color: "#7657be" }}
            >
              {isSignUp
                ? "Already have an account? Log In!"
                : "New here? Sign Up!"}
            </Link>
          </Center>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
