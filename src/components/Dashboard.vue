<template>
  <b-container>
    <b-container class>
      <div class="col-sm-12 text-left">
        <Toaster />
        <div class="alert alert-danger" v-if="error">
          <p>{{ error }}</p>
        </div>
        <div class="my-3">
          <b-button v-b-modal.modal-1 class="text-center">
            <span class="plusIcon" data-backdrop="static" data-keyboard="false" href="#">+</span>
            Add a Task
          </b-button>

          <b-modal
            id="modal-1"
            title="Create a Task"
            @ok="handleOK"
            @cancel="resetTodoForm()"
            @close="resetTodoForm()"
            :no-close-on-backdrop="true"
            :no-close-on-esc="true"
          >
            <b-container class>
              <b-row>
                <form ref="form" @submit.stop.prevent="addTask" class="row">
                  <b-col sm="12" md="12" lg="12" xl="12">
                    <b-form-group id="input-group-1" label="Task Name" label-for="taskname">
                      <b-form-input
                        id="dob"
                        v-model="$v.todo.taskname.$model"
                        :class="status($v.todo.taskname)"
                        type="text"
                        required
                        placeholder="Enter Task Name"
                      ></b-form-input>
                      <div
                        class="errorLabel"
                        v-if="
                          !$v.todo.taskname.required && $v.todo.taskname.$dirty
                        "
                      >Task Name is required.</div>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="12" lg="12" xl="12">
                    <b-form-group id="input-group-2" label="Priority:" label-for="Priority">
                      <b-form-select
                        v-model="$v.todo.priority.$model"
                        :options="options"
                        :class="status($v.todo.priority)"
                        class="form-control"
                        required
                      ></b-form-select>
                      <div
                        class="errorLabel"
                        v-if="
                          !$v.todo.priority.required && $v.todo.priority.$dirty
                        "
                      >Priority is required.</div>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="12" lg="12" xl="12">
                    <b-form-group id="input-group-3" label="Start Date:" label-for="startDate">
                      <b-form-input
                        id="startDate"
                        v-model="$v.todo.startDate.$model"
                        :class="status($v.todo.startDate)"
                        type="date"
                        :min="dateFormat()"
                        required
                        placeholder="Enter Start Date"
                      ></b-form-input>
                      <div
                        class="errorLabel"
                        v-if="
                          !$v.todo.startDate.required &&
                            $v.todo.startDate.$dirty
                        "
                      >Start Date is required.</div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="12" md="12" lg="12" xl="12">
                    <b-form-group id="input-group-4" label="End Date:" label-for="endDate">
                      <b-form-input
                        id="endDate"
                        v-model="$v.todo.endDate.$model"
                        :class="status($v.todo.endDate)"
                        type="date"
                        :min="dateFormat()" 
                        :disabled="todo.startDate === null"
                        required
                        placeholder="Enter End Date"
                      ></b-form-input>
                      <div
                        class="errorLabel"
                        v-if="
                          !$v.todo.endDate.required && $v.todo.endDate.$dirty
                        "
                      >End Date is required.</div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="12" md="12" lg="12" xl="12">
                    <b-form-group id="input-group-5" label="Comments:" label-for="comments">
                      <b-form-input
                        id="comments"
                        v-model="$v.todo.comments.$model"
                        :class="status($v.todo.comments)"
                        type="text"
                        required
                        placeholder="Enter Comments"
                      ></b-form-input>
                      <div
                        class="errorLabel"
                        v-if="
                          !$v.todo.comments.required && $v.todo.comments.$dirty
                        "
                      >Comments is required.</div>
                    </b-form-group>
                  </b-col>
                </form>
              </b-row>
            </b-container>
          </b-modal>
        </div>
      </div>

      <!-- <div v-if="loader" class="text-center text-info my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>-->
      <div class="taskList table-responsive" v-if="todos.length != 0">
        <table class="table">
          <thead>
            <tr>
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
              v-for="(todo, index) in pageOfItems"
              :key="todo.id"
              v-on:remove="todos.splice(index, 1)"
            >
              <td>{{ todo.taskname }}</td>
              <td>{{ todo.priority }}</td>
              <td>{{ todo.startDate }}</td>
              <td>{{ todo.endDate }}</td>
              <td>
                <button class="btn btn-info mx-2" v-on:click="editTask(todo)">
                  <i class="fa fa-pencil"></i>
                </button>
              </td>
              <td>
                <button class="btn btn-danger mx-2" v-on:click="deleteAlert(todo)">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <jw-pagination :items="todos" @changePage="onChangePage" :pageSize="pageSize"></jw-pagination>
      </div>
      <b-container v-else class="mt-5 text-center">No Tasks Added, Please add a Task</b-container>
    </b-container>
  </b-container>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import Toaster from "./Toaster.vue";
export default {
  name: "Dashboard",
  components: {
    Toaster
  },
  props: {
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      token: localStorage.getItem("user-token"),
      userID: localStorage.getItem("user-id"),
      user: localStorage.getItem("user-type"),
      todo: {
        id: "",
        taskname: "",
        startDate: "",
        endDate: "",
        comments: "",
        priority: null
      },
      options: [
        { value: null, text: "Please select an option" },
        { value: "low", text: "Low" },
        { value: "medium", text: "Medium" },
        { value: "high", text: "High" }
      ],
      todos: [],
      pageOfItems: [],
      index: "",
      isEdit: false,
      error: ""
    };
  },
  validations: {
    todo: {
      taskname: {
        required
      },
      startDate: {
        required
      },
      endDate: {
        required
      },
      priority: {
        required
      },
      comments: {
        required
      }
    }
  },
  created() {
    this.getTasks();
  },
  methods: {
    dateFormat() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    status(validation) {
      return {
        error: validation.$error,
        dirty: validation.$dirty
      };
    },
    resetTodoForm() {
      this.$nextTick(() => {
        this.$v.$reset();
      });
      // this.todo= {};
      this.isEdit = false;
      this.todo.taskname = null;
      this.todo.startDate = null;
      this.todo.endDate = null;
      this.todo.priority = null;
      this.todo.comments = null;
    },
    handleOK(bvModalEvt) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        bvModalEvt.preventDefault();
      } else {
        if (this.isEdit) {
          this.editSelectedTask(this.todo);
          this.$v.$reset();
        } else {
          this.addTask();
          this.$v.$reset();
        }
      }
    },
    addTask() {
      var _this = this;
      const token = localStorage.getItem("user-token");
      const user = localStorage.getItem("user-type");
      let userData = {
        userID: this.userID,
        taskname: this.todo.taskname,
        priority: this.todo.priority,
        startDate: this.todo.startDate,
        endDate: this.todo.endDate,
        comments: this.todo.comments
      };

      if (user == "regular") {
        if (token) {
          const config = {
            headers: { Authorization: "Bearer " + token }
          };
          this.axios
            .post("http://180.149.241.208:3022/createTask", userData, config)
            .then(function() {
              // alert(response.data.message);
              _this.getTasks();
              _this.resetTodoForm();
            })
            .catch(function(error) {
              console.log(error);
            });

          this.$swal({
            position: "top-end",
            icon: "success",
            title: "Your task added.",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "popup-class",
              title: "title-class"
            }
          });
        }
      } else {
        let id = Math.random()
          .toString(36)
          .substring(7);
        this.todo.id = id;
        this.todos.push(this.todo);
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.getTasks();
        this.$v.$reset();
        this.resetTodoForm();
      }
    },
    getTasks() {
      var _this = this;
      const token = localStorage.getItem("user-token");
      const userID = localStorage.getItem("user-id");
      const user = localStorage.getItem("user-type");
      if (user == "regular") {
        if (token) {
          const config = {
            headers: { Authorization: "Bearer " + token }
          };
          _this.loader = true;
          this.axios
            .get("http://180.149.241.208:3022/getTask/" + userID, config)
            .then(function(response) {
              _this.todos = response.data.data;
              _this.loader = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      } else {
        // let todos = localStorage.getItem("todos");
        let todos = localStorage.getItem("todos")
          ? JSON.parse(localStorage.getItem("todos"))
          : [];
        if (todos != 0) {
          this.todos = todos;
          this.resetTodoForm();
        }
      }
    },
    editSelectedTask(taskObj) {
      this.todo = { ...taskObj };
      var _this = this;
      const token = localStorage.getItem("user-token");
      const user = localStorage.getItem("user-type");

      if (user == "regular") {
        const config = {
          headers: { Authorization: "Bearer " + token }
        };
        this.axios
          .put(
            "http://180.149.241.208:3022/updateTask?userID=" +
              this.todo.userID +
              "&_id=" +
              this.todo._id,
            this.todo,
            config
          )
          .then(function(response) {
            console.log(response.data);
            _this.getTasks();
            _this.resetTodoForm();
            _this.todos.splice(_this.index, 1, response.data.data);
          })
          .catch(function(error) {
            console.log(error);
          });
        this.$swal({
          position: "top-end",
          icon: "success",
          title: "Your task updated.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "popup-class",
            title: "title-class"
          }
        });
      } else {
        this.todos.forEach(function(key, index) {
          if (index == _this.index) {
            _this.todos[index] = _this.todo;
          }
        });
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.isEdit = false;
        this.todo = {};
        _this.getTasks();
      }
    },
    editTask(taskObj) {
      const user = localStorage.getItem("user-type");
      var _this = this;
      this.$bvModal.show("modal-1");
      this.isEdit = true;
      this.todo = { ...taskObj };
      _this.index = taskObj.index;
      if (user == "regular") {
        this.todos.forEach(function(val, index) {
          if (val._id == taskObj.todo._id) {
            _this.index = index;
          }
        });
      } else {
        this.todos.forEach(function(val, index) {
          if (val.id == taskObj.id) {
            _this.index = index;
          }
        });
      }
    },
    deleteAlert(todo) {
      this.$swal({
        title: "Are you sure?",
        text: "You can't revert your action",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes Delete it!",
        cancelButtonText: "No, Keep it!",
        showCloseButton: true,
        showLoaderOnConfirm: true,
        customClass: {
          popup: "popup-class",
          header: "header-class",
          title: "title-class",
          closeButton: "close-button-class",
          content: "content-class",
          actions: "actions-class",
          confirmButton: "confirm-button-class",
          cancelButton: "cancel-button-class",
          footer: "footer-class"
        }
      }).then(result => {
        if (result.value) {
          this.deleteTodo(todo);
          this.$swal(
            "Deleted",
            "You successfully deleted this task",
            "success"
          );
        } else {
          this.$swal("Cancelled", "Your task is still intact", "info");
        }
      });
    },
    deleteTodo(todo) {
      var _this = this;
      const token = localStorage.getItem("user-token");
      const user = localStorage.getItem("user-type");

      if (user == "regular") {
        const config = {
          headers: { Authorization: "Bearer " + token }
        };
        this.axios
          .delete(
            "http://180.149.241.208:3022/deleteTask?userID=" +
              todo.userID +
              "&_id=" +
              todo._id,
            config
          )
          .then(function(response) {
            console.log(response.data);
            _this.getTasks();
            _this.todos.splice(_this.index, 1);
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.todos.forEach(function(val, index) {
          if (val.id == todo.id) {
            _this.todos.splice(index, 1);
            _this.index = index;
          }
        });

        localStorage.setItem("todos", JSON.stringify(_this.todos));
        _this.getTasks();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.plusIcon {
  border: 2px solid #fff;
  padding: 5px 9px;
  border-radius: 100%;
  font-weight: bold;
}
.form-control {
  margin-bottom: 20px;
}
.form__label {
  float: left;
}
.errorLabel {
  float: left;
  margin-top: -15px;
  font-size: 12px;
  color: red;
}
.error1 {
  margin-top: 15px;
  font-size: 15px;
  color: red;
}

/* _---------------------------------- */
/* input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
} */

.dirty {
  border-color: #5a5;
  background: #efe;
}

.dirty:focus {
  outline-color: #8e8;
}

.error {
  border-color: red;
  background: #fdd;
}

.error:focus {
  outline-color: #f99;
}
.popup-class {
  width: 30% !important;
  padding: 10px !important;
}
.title-class {
  font-size: 20px !important;
}
</style>
