// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/Head'; 

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    const today = new Date();
    const week = getWeekDays(today, activeWeek);
    setCurrentWeek(week);
    setSelectedDay(today.getDay());
  }, [activeWeek]);

  const getWeekDays = (date, weekOffset) => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay() + (weekOffset * 7));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      
      const isToday = day.toDateString() === new Date().toDateString();
      const status = isToday ? 'current' : 'pending';
      const icon = isToday ? '🏋️' : '🗓️';
      const color = isToday ? '#FFC107' : '#f0f0f0';
      
      week.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        date: day.getDate(),
        status,
        icon,
        color,
      });
    }
    return week;
  };

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', '...'];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calendar</Text>
          <View style={styles.weekRow}>
            {weeks.map((week, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveWeek(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.weekText,
                    index === activeWeek && styles.weekActive,
                  ]}
                >
                  {week}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.calendarDays}>
            {currentWeek.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDay(index)}
                activeOpacity={0.7}
                style={[
                  styles.dayBox,
                  { backgroundColor: selectedDay === index ? '#4834d4' : item.color },
                  selectedDay === index && styles.selectedDay,
                ]}
              >
                <Text 
                  style={[
                    styles.dayText,
                    selectedDay === index && styles.selectedDayText
                  ]}
                >
                  {item.day}
                </Text>
                <Text style={styles.dayNumber}>{item.date}</Text>
                <Text style={styles.dayIcon}>{item.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercise Section */}
        <View style={styles.exerciseContainer}>
          <Text style={styles.cardTitle}>Exercise</Text>
          <View style={styles.exerciseList}>
            {[
              { icon: '💪', title: 'Chest', color: '#FF9800' },
              { icon: '🏋️', title: 'Shoulder', color: '#2196F3' },
              { icon: '🤸', title: 'Abs', color: '#4CAF50' },
              { icon: '🦵', title: 'Legs', color: '#9C27B0' },
            ].map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.exerciseRow, { backgroundColor: exercise.color }]}
              >
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
                  <Text style={styles.catTitle}>{exercise.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    color: '#2d3436',
    fontWeight: '700',
    marginBottom: 15,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weekText: {
    color: '#636e72',
    fontSize: 14,
    fontWeight: '500',
  },
  weekActive: {
    color: '#FFC107',
    fontWeight: '700',
    fontSize: 15,
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBox: {
    width: 42,
    height: 65,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayText: {
    fontSize: 13,
    color: '#2d3436',
    fontWeight: '600',
    marginBottom: 5,
  },
  currentDayText: {
    color: '#fff',
  },
  dayIcon: {
    fontSize: 18,
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Replace exerciseGrid and exerciseBox styles with these:
  exerciseList: {
    width: '100%',
  },
  exerciseRow: {
    width: '100%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  catTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  selectedDay: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  weekActive: {
    color: '#4834d4',
    fontWeight: '700',
    fontSize: 15,
    transform: [{ scale: 1.1 }],
  },
});