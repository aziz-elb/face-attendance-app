import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, IconButton } from "react-native-paper";

export default function UserLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />

      {/* Hidden screens reachable from Profile */}
      <Tabs.Screen
        name="edit-info"
        options={{
          href: null,
          headerShown: true,
          title: "Edit Information",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(user)/profile')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          headerShown: true,
          title: "Change Password",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(user)/profile')}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          href: null,
          headerShown: true,
          title: "notification",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Tabs>
  );
}
