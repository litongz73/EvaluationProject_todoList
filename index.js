//console.log("hello world")

/* 
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)


*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

const APIs = (() => {
    const myFetch = (url, options) => {
        return new Promise((res, rej) => {
            const method = options && options.method ? options.method : 'GET';

            const xhttp = new XMLHttpRequest();

            xhttp.open(method, url, true);
            if (options && options.headers) {
                Object.entries(options.headers).forEach(([header, value]) => {
                    xhttp.setRequestHeader(header, value);
                });
            }

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
                    // Typical action to be performed when the document is ready:
                    const obj = {
                        json: function () {
                            return JSON.parse(xhttp.response);
                        },
                    };
                    res(obj);
                }
            };

            options && options.body ? xhttp.send(options.body) : xhttp.send();
        });
    }


    const createTodo = (newTodo) => {
        return myFetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const deleteTodo = (id) => {
        return myFetch("http://localhost:3000/todos/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
    };

    const updateTodo = (id, newTodo) => {
        return myFetch("http://localhost:3000/todos/" + id, {
            method: 'PATCH',
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }
    const getTodos = () => {
        return myFetch("http://localhost:3000/todos").then((res) => res.json());
    };
    return { createTodo, deleteTodo, getTodos, updateTodo };
})();

//IIFE
//todos
/* 
    hashMap: faster to search
    array: easier to iterate, has order
 
 
*/
const Model = (() => {
    class State {
        #todos; //private field
        #onChange; //function, will be called when setter function todos is called
        constructor() {
            this.#todos = [];
        }
        get todos() {
            return this.#todos;
        }
        set todos(newTodos) {
            // reassign value
            console.log("setter function");
            this.#todos = newTodos;
            this.#onChange?.(); // rendering
        }

        subscribe(callback) {
            //subscribe to the change of the state todos
            this.#onChange = callback;
        }
    }
    const { getTodos, createTodo, deleteTodo, updateTodo } = APIs;
    return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo
    };
})();
/* 
    todos = [
        {
            id:1,
            content:"eat lunch"
        },
        {
            id:2,
            content:"eat breakfast"
        }
    ]
 
*/
const View = (() => {
    const todolistEl = document.querySelector(".todo-list");
    const finishedE1 = document.querySelector(".finished-list");
    const submitBtnEl = document.querySelector(".submit-btn");
    const inputEl = document.querySelector(".input");

    const renderTodos = (todos) => {
        let todosTemplate = "";
        let finshiedTemplate = "";

        let incompleteCount = 0, completeCount = 0;

        todos.forEach((todo) => {
            if (!todo.complete) {
                incompleteCount++;
                const liTemplate = `
                    <li>
                        <span>${todo.content}</span>
                        <button class="edit-btn" id ="${todo.id}">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                            </svg>
                        </butuon>
                        <button class="delete-btn" id="${todo.id}">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                            </svg>
                        </button>
    
                         <button class="complete-btn" id ="${todo.id}">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small">
                                <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                            </svg>
                        </butuon>
                    </li>`;
                todosTemplate += liTemplate;
            } else {
                completeCount++;
                const liTemplate = `
                    <li>
                        <button class="complete-btn" id ="${todo.id}">
                             <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                             </svg>
                        </button>
                        <span>${todo.content}</span>
                        <button class="edit-btn" id ="${todo.id}">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                            </svg>
                        </butuon>
                        <button class="delete-btn" id="${todo.id}">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                            </svg>
                        </button>
                    </li>`;
                finshiedTemplate += liTemplate;
            }


        });
        if (incompleteCount === 0) {
            todosTemplate = "<h4>no task to display!</h4>";
        }
        if (completeCount === 0) {
            finshiedTemplate = "<h4>You finished all tasks!</h4>";
        }
        todolistEl.innerHTML = todosTemplate;
        finishedE1.innerHTML = finshiedTemplate;
    };





    const clearInput = () => {
        inputEl.value = "";
    };

    return { renderTodos, submitBtnEl, inputEl, clearInput, todolistEl, finishedE1 };
})();

const Controller = ((view, model) => {
    const state = new model.State();
    const init = () => {
        model.getTodos().then((todos) => {
            todos.reverse();
            state.todos = todos;
        });
    };

    const handleSubmit = () => {
        view.submitBtnEl.addEventListener("click", (event) => {
            /* 
                1. read the value from input
                2. post request
                3. update view
            */
            const inputValue = view.inputEl.value;
            if (inputValue !== "") {
                model.createTodo({ content: inputValue, complete: false }).then((data) => {
                    state.todos = [data, ...state.todos];
                    view.clearInput();
                });
            } else {
                window.alert("You need to write something!");
            }

        });
    };

    // method to handle the change of 
    const handleToggleComplete = () => {
        view.todolistEl.addEventListener("click", (event) => {
            if (event.target.className === "complete-btn") {
                const id = event.target.id;
                //console.log("id", typeof id);
                model.updateTodo(+id, { complete: true }).then((data) => {
                    state.todos = state.todos;
                });
            }
        });
        view.finishedE1.addEventListener("click", (event) => {
            if (event.target.className === "complete-btn") {
                const id = event.target.id;
                //console.log("id", typeof id);
                model.updateTodo(+id, { complete: false }).then((data) => {
                    state.todos = state.todos;
                });
            }
        });

    }

    // method to handle the edit button and update the text
    const handleUpdateText = () => {
        let list = [view.todolistEl, view.finishedE1];
        list.forEach((each) => {
            each.addEventListener("click", (event) => {
                if (event.target.className === "edit-btn") {
                    const id = event.target.id;

                    const parent = event.target.parentNode;
                    const spanElement = parent.querySelector('span');
                    if (spanElement) {

                        const inputElement = document.createElement("input");
                        inputElement.classList.add("edit-input");

                        inputElement.value = spanElement.textContent;
                        parent.replaceChild(inputElement, event.target.parentNode.querySelector('span'));
                    } else {
                        const newSpanElement = document.createElement("span");
                        const newText = parent.querySelector('input').value;
                        newSpanElement.textContent = newText;
                        parent.replaceChild(newSpanElement, event.target.parentNode.querySelector('input'));


                        model.updateTodo(+id, { content: newText }).then((data) => {
                            state.todos = state.todos;
                        });
                    }
                }


                //model.updateTodo();
            })
        })
    }


    const handleDelete = () => {
        //event bubbling
        /* 
            1. get id
            2. make delete request
            3. update view, remove
        */
        view.todolistEl.addEventListener("click", (event) => {
            console.log(event.target);
            if (event.target.className === "delete-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        });
        view.finishedE1.addEventListener("click", (event) => {
            if (event.target.className === "delete-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        });
    };

    const bootstrap = () => {
        init();
        handleSubmit();
        handleDelete();
        handleToggleComplete();
        handleUpdateText();
        state.subscribe(() => {
            view.renderTodos(state.todos);
        });
    };
    return {
        bootstrap,
    };
})(View, Model); //ViewModel

Controller.bootstrap();
