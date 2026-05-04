import { Tabs, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, IconButton } from "react-native-paper";

export default function SuperAdminLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.onSurface,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="departments/index"
        options={{
          title: "Departments",
          tabBarLabel: "Dept",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="office-building" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="departments/[id]"
        options={{
          href: null,
          title: "Department Users",
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="admins/index"
        options={{
          title: "Admin Management",
          tabBarLabel: "Admins",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-account" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="users/index"
        options={{
          title: "User Management",
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Super Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
