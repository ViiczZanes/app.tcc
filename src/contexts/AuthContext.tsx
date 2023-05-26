import { createContext, useState, ReactNode } from "react";
import { api } from "../services/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  setLoadingAuth: (loading: boolean) => void;
  signOut: () => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
    role: "", // Initialize role as empty string
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem("@KVOrders");
      let userInfo: UserProps = JSON.parse(user || "{}");

      if (Object.keys(userInfo).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userInfo.token}`;
        setUser(userInfo);
      }

      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);
    try {
      const response = await api.post("/user/auth", {
        email,
        password,
      });

      const { id, name, token, role } = response.data;

      if (role !== "garcom" && role !== "admin") {
        throw new Error("Acesso negado"); // Throw an error if the role is not "garcom" or "admin"
      }

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@KVOrders", JSON.stringify(data));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id,
        name,
        email,
        token,
        role,
      });
    } catch (err) {
      console.log("Erro ao Acessar", err);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        id: "",
        name: "",
        email: "",
        token: "",
        role: "",
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loading, loadingAuth, signOut, setLoadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
