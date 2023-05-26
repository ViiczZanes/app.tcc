import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

import AppRoutes from "./AppRoutes";
import AuthRoutes from "./AuthRoutes";





function Routes() {

  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1d1d2e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={60} color="#ffff"/>
      </View>
    );
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
