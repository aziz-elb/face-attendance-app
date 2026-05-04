import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text, Card, Surface, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KPICard = ({ title, value, icon, color, onPress }: { title: string, value: string, icon: string, color: string, onPress?: () => void }) => {
  const { colors } = useTheme();
  return (
    <Card 
      style={[styles.card, { borderLeftWidth: 6, borderLeftColor: color }]}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text variant="labelMedium" style={{ color: colors.outline }}>{title}</Text>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: colors.onSurface }}>{value}</Text>
        </View>
        <Surface style={[styles.iconContainer, { backgroundColor: color + '20' }]} elevation={0}>
          <MaterialCommunityIcons name={icon as any} size={32} color={color} />
        </Surface>
      </Card.Content>
    </Card>
  );
};

export default function SuperAdminDashboard() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.welcomeText}>Welcome, Super Admin</Text>
        <Text variant="bodyMedium" style={{ color: colors.outline }}>Here's an overview of your organization</Text>
      </View>

      <View style={styles.grid}>
        <KPICard 
          title="Total Users" 
          value="156" 
          icon="account-group" 
          color="#6200ee" 
          onPress={() => router.push('/(super-admin)/users')}
        />
        <KPICard 
          title="Active Admins" 
          value="12" 
          icon="shield-check" 
          color="#03dac6" 
          onPress={() => router.push('/(super-admin)/admins')}
        />
        <KPICard 
          title="Departments" 
          value="8" 
          icon="office-building" 
          color="#ff0266" 
          onPress={() => router.push('/(super-admin)/departments')}
        />
        <KPICard 
          title="Pending Requests" 
          value="5" 
          icon="clock-outline" 
          color="#ff9800" 
        />
      </View>

      <Card style={styles.recentActivityCard}>
        <Card.Title title="System Status" subtitle="All services are running normally" 
          left={(props) => <MaterialCommunityIcons {...props} name="server-network" color={colors.primary} />} 
        />
        <Card.Content>
          <Text variant="bodyMedium">Last automated backup: 2 hours ago</Text>
          <Text variant="bodyMedium">System Load: 12%</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentActivityCard: {
    marginBottom: 32,
  }
});
