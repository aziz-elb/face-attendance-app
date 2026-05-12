import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await api.loadUser();
        if (storedUser) {
          if (storedUser.role === 'SUPER_ADMIN') {
            router.replace('/(super-admin)/admins');
          } else if (storedUser.role === 'ADMIN') {
            router.replace('/(admin)');
          } else {
            router.replace('/(user)');
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return <Redirect href="/(auth)/login" />;
}
