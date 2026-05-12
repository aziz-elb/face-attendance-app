import { router, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton, useTheme } from "react-native-paper";

export default function AdminLayout() {
  const { colors } = useTheme();

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
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarLabel: "Mark",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" color={color} size={size} />
          ),
        }}
      />

        <Tabs.Screen
        name="archived-justifications"
        options={{
          href: null,
          title: "Archived Justifications",
          tabBarStyle: { display: 'none' },
        }}
      />


       <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="justifications"
        options={{
          title: "Justifications",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document-check-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-account" color={color} size={size} />
          ),
        }}
      />

      {/* Hidden screens reachable from Profile */}

        <Tabs.Screen
        name="attendance-today"
        options={{
          href: null,
          headerShown: false,
          title: "Today's History",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(admin)/attendance')}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="edit-info"
        options={{
          href: null,
          headerShown: false,
          title: "Admin Info",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(admin)/profile')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          headerShown: false,
          title: "Admin Password",
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              onPress={() => router.replace('/(admin)/profile')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
