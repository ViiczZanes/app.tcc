import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loadingAuth, setLoadingAuth } = useContext(AuthContext);

  useEffect(() => {
    setLoadingAuth(false); // Redefine o estado loadingAuth quando a tela é montada novamente
  }, []);

  async function handleSubmit() {
    if (email === "" || password === "") {
      console.log("Email ou Senha Vazio");
      return;
    }

    await signIn({
      email,
      password,
    });
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Digite Seu Email"
          style={styles.input}
          placeholderTextColor="#f0f0f0"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Digite Sua Senha"
          style={styles.input}
          placeholderTextColor="#f0f0f0"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color={"#fff"} />
          ) : (
            <Text style={styles.btnText}>Acessar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d1d2e",
  },

  logo: {
    marginBottom: 18,
  },

  inputWrapper: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 32,
  },

  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#101026",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: "#fff",
  },

  btn: {
    width: "95%",
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3fffa3",
  },

  btnText: {
    fontWeight: "bold",
  },
});

export default Signin;
