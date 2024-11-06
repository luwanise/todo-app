import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BouncyCheckbox from "react-native-bouncy-checkbox";

// Define the structure of each todo item
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  // This will hold our tasks
  // todos is a list of todo objects, setTodos is what we use to update todos
  const [todos, setTodos] = useState<Todo[]>([]);

  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  const addTodo = () => {
    if (newTodoText.trim()){
      let newTodo = { // create a new todo object
        id: Date.now().toString(),
        text: newTodoText,
        completed: false
      };

      setTodos( // update the todos using the setTodos()
        [...todos, newTodo] // ...todos takes the whole todo, and then adds todo
      );

      setNewTodoText(""); // this changes newTodoText to ""
    }
  }

  const completeTodo = (id: string) => {
    // remove from todos
    let newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);

    // add to completedTodos
    let completedTodo = todos.filter(todo => todo.id === id)[0];

    setCompletedTodos(
      [...completedTodos, completedTodo]
    );
  }

  const uncompleteTodo = (id: string) => {
    // remove from completedTodos
    let newCompletedTodos = completedTodos.filter(completedTodo => completedTodo.id !== id);
    setCompletedTodos(newCompletedTodos);

    // add to todos
    let todo = completedTodos.filter(completedTodo => completedTodo.id === id)[0];

    setTodos(
      [...todos, todo]
    );
  }

  const deleteTodo = (id: string) => {
    let newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  }

  const deleteCompletedTodo = (id: string) => {
    let newCompletedTodos = completedTodos.filter(completedTodo => completedTodo.id !== id);
    setCompletedTodos(newCompletedTodos);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Inbox</Text>
      
      <Text style={styles.subheader}>To Do</Text>
      
      <FlatList
        data={todos} // iterates over the todos
        keyExtractor={(item) => item.id} // helps react track todos using id
        renderItem={({item}) => ( // renders each item in todos as a view
          
          <View style={styles.taskContainer}>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => completeTodo(item.id)}>
              <Icon name="square-o" size={20} color="grey"/>
            </TouchableOpacity>

            <Text style={styles.taskText}>{item.text}</Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteTodo(item.id)}>
              <Icon name="trash" size={20} color="red"/>
            </TouchableOpacity>

          </View>
        )}
      />

      <Text style={styles.subheader}>Completed</Text>

      <FlatList
        data={completedTodos} // iterates over the todos
        keyExtractor={(item) => item.id} // helps react track todos using id
        renderItem={({item}) => ( // renders each item in todos as a view
          
          <View style={styles.taskContainer}>
            
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => uncompleteTodo(item.id)}>
              <Icon name="check-square" size={20} color="red"/>
            </TouchableOpacity>

            <Text style={styles.completedTaskText}>{item.text}</Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteCompletedTodo(item.id)}>
              <Icon name="trash" size={20} color="grey"/>
            </TouchableOpacity>

          </View>
        )}
      />

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="I want to do..."
          value={newTodoText} // connects newTodoText state to display in the input
          onChangeText={(text) => setNewTodoText(text)} // updates newTodoText as the user types
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTodo()}>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    fontSize: 16,
    color: 'gray',
    textDecorationLine: 'line-through',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
  },
})