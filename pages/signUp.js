import React, { useState } from "react";
import { Box, Button, Input, Text, ChakraProvider, Center } from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";

export default function SignUp() {
  const [session, setSession] = useState(null);

  return (
    <ChakraProvider>
      <>
        <ChakraProvider>
          <Center>
          {session ? (
            <p>
              Usuário: {session.user.email} <br />
              <Button
                onClick={() => supabase.auth.signOut()}
                colorScheme="red"
                size="sm"
              >
                Sair
              </Button>
            </p>
          ) : null}
          {/* Resto do seu código */}
          </Center>
        </ChakraProvider>
      </>
      <Auth />
    </ChakraProvider>
  );
}