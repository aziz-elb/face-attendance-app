import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, IconButton } from "react-native-paper";

export default function UserLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  const HeaderRight = () => (
    <IconButton 
      icon="bell" 
      onPress={() => router.push('/(user)/notification')} 
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          // height: 60,
          // paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.onSurface,
          fontWeight: 'bold',
        },
        headerRight: HeaderRight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "My Attendance",
          tabBarLabel: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="justify-absence"
        options={{
          href: null,
          title: "Justify Absence",
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />

      <Tabs.Screen
        name="edit-info"
        options={{
          href: null,
          title: "Edit Information",
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          title: "Change Password",
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          href: null,
          title: "Notifications",
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />
    </Tabs>
  );
}
