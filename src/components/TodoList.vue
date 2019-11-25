<template>
  <table class="table ">
    <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Priority</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(todo, index) in todos"
        :key="todo.id"
        v-on:remove="todos.splice(index, 1)"
      >
        <td>
          <input type="checkbox" class="form-check-input" value="" />
        </td>
        <td>{{ todo.taskname }}</td>
        <td>{{ todo.priority }}</td>
        <td>{{ todo.startDate }}</td>
        <td>{{ todo.endDate }}</td>
        <td>
          <button class="btn btn-info mx-2" v-on:click="editTodo()">
            Edit
          </button>
        </td>
        <td>
          <button class="btn btn-danger mx-2" v-on:click="deleteTodo()">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "TodoList",
  props: ["index", "todo"]
};
</script>

<style scoped></style>
