import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the structure of each todo item
interface Todo {
  id: string;
  text: string;
  status: string;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  const STATUS_PENDING = "pending";
  const STATUS_COMPLETED = "completed";

  const saveTodos = async (todos: Todo[]) => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('@todos', jsonValue);
      console.log('Tasks saved!');
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  }

  const loadTodos = async (status: string = '') => {
    try {
      const jsonValue = await AsyncStorage.getItem('@todos');
      if (jsonValue) {
        const allTodos = JSON.parse(jsonValue);
        return status ? allTodos.filter((todo: Todo) => todo.status === status) : allTodos;
      }
      return [];
    } catch (e) {
      console.error('Error loading todos:', e);
      return [];
    }
  }

  useEffect(() => {
    const fetchTodos = async () => {
      const pendingTodos = await loadTodos(STATUS_PENDING);
      setTodos(pendingTodos);
      const completed = await loadTodos(STATUS_COMPLETED);
      setCompletedTodos(completed);
    };

    fetchTodos();
  }, []);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = { id: Date.now().toString(), text: newTodoText, status: STATUS_PENDING };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodoText("");
    }
  }

  const completeTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);

    const completedTodo = todos.find(todo => todo.id === id);
    if (completedTodo) {
      completedTodo.status = STATUS_COMPLETED;
      setCompletedTodos([...completedTodos, completedTodo]);
      updateTodosInStorage(id, STATUS_COMPLETED);
    }
  }

  const uncompleteTodo = (id: string) => {
    const newCompletedTodos = completedTodos.filter(todo => todo.id !== id);
    setCompletedTodos(newCompletedTodos);

    const uncompletedTodo = completedTodos.find(todo => todo.id === id);
    if (uncompletedTodo) {
      uncompletedTodo.status = STATUS_PENDING;
      setTodos([...todos, uncompletedTodo]);
      updateTodosInStorage(id, STATUS_PENDING);
    }
  }

  const updateTodosInStorage = async (id: string, newStatus: string) => {
    const allTodos = await loadTodos();
    const updatedTodos = allTodos.map((todo: { id: string; }) => todo.id === id ? { ...todo, status: newStatus } : todo);
    saveTodos(updatedTodos);
  }

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  }

  const deleteCompletedTodo = (id: string) => {
    const newCompletedTodos = completedTodos.filter(todo => todo.id !== id);
    setCompletedTodos(newCompletedTodos);
    saveTodos([...todos, ...newCompletedTodos]);  // Save combined todos to storage
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To Dos</Text>
      
      <Text style={styles.subheader}>Pending</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => completeTodo(item.id)}>
              <Icon name="square-o" size={20} color="grey"/>
            </TouchableOpacity>
            <Text style={styles.taskText}>{item.text}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => deleteTodo(item.id)}>
              <Icon name="trash" size={20} color="red"/>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.subheader}>Completed</Text>
      <FlatList
        data={completedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => uncompleteTodo(item.id)}>
              <Icon name="check-square" size={20} color="red"/>
            </TouchableOpacity>
            <Text style={styles.completedTaskText}>{item.text}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => deleteCompletedTodo(item.id)}>
              <Icon name="trash" size={20} color="grey"/>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="I want to do..."
          value={newTodoText}
          onChangeText={setNewTodoText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Icon name="plus" size={20} color="white"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 50, 
    backgroundColor: '#f5f5f5', // Light gray background for a softer look
  },
  header: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333', // Darker text for better contrast
    marginBottom: 15,
    textAlign: 'center', // Center the header
  },
  subheader: { 
    fontSize: 22, 
    fontWeight: '600', // Slightly lighter boldness
    color: '#555', // Softer gray for subheader
    marginVertical: 10,
    textAlign: 'center', // Center the subheader as well
  },
  taskContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10, 
    borderBottomWidth: 1, // Subtle border at the bottom for separation
    borderBottomColor: '#eee', // Lighter gray border
    paddingBottom: 5,
  },
  taskText: { 
    fontSize: 18, 
    flex: 1, 
    color: '#333', // Dark text for clarity
    fontFamily: 'Roboto', // Modern font family
  },
  completedTaskText: { 
    fontSize: 18, 
    color: '#888', // Lighter gray for completed tasks
    textDecorationLine: 'line-through', 
    flex: 1, 
    fontFamily: 'Roboto', 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20,
    paddingVertical: 5,
  },
  input: { 
    flex: 1, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 12,
    marginEnd: 5,
    backgroundColor: '#f9f9f9', // Slightly off-white background
    fontSize: 16, 
    color: '#333', // Dark text for readability
  },
  addButton: { 
    backgroundColor: '#4CAF50', // Fresh green for the button
    padding: 12, 
    width: 50, 
    height: 50, 
    borderRadius: 25, // Circular button for a modern look
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5, // Adding some depth to the button
  },
  iconButton: { 
    padding: 8, 
    color: '#fff', // White icon for contrast
  },
});
