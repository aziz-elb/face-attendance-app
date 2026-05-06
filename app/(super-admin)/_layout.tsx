import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

export default function SuperAdminLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          headerShown: true, // Assurez-vous que le header est affiché
          headerLeft: () => (
            <IconButton
              icon="arrow-left" // Nom de l'icône selon votre bibliothèque
              onPress={() => router.push("/(super-admin)/departments")} // Redirige vers la page précédente
            />
          ),
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
          headerShown: false,
          title: "Super Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />

      {/* Hidden screens reachable from Profile */}
      <Tabs.Screen
        name="edit-info"
        options={{
          href: null,
          headerShown: false,
          title: "Super Admin Info",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(super-admin)/profile')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          headerShown: false,
          title: "Super Admin Password",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(super-admin)/profile')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
