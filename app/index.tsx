import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native";

export default function HomeScreen() {
  // This will hold our tasks
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{key:string; value: string}[]>([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, {key: Math.random().toString(), value: task}]);
      setTask('');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>To-Do-App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your task..."
        value={task}
        onChangeText={setTask}
      />

      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={
          ({item}) => <Text style={styles.task}>{item.value}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },

  task: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  }
})