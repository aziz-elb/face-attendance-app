import StatCard from '@/components/StatCard';
import { useLogout } from '@/hooks/useLogout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Card, Surface, Text, useTheme } from 'react-native-paper';
  

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
  const handleLogout = useLogout();

  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Content title="Dashboard" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>


      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Global Attendance</Text>



        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value="124"
            icon="account-group"
            color="#2196F3"
          />
          <StatCard
            title="Present"
            value="98"
            icon="account-check"
            color="#4CAF50"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Absent"
            value="26"
            icon="account-remove"
            color="#F44336"
          />
          <StatCard
            title="Late"
            value="12"
            icon="clock-alert"
            color="#FF9800"
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
  },
  sectionTitle: {
    marginVertical: 16,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionSurface: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
  },
  actionButton: {
    marginVertical: 6,
  },
  card: {
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
});
