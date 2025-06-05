import { format } from "date-fns"

class ToDo {
    constructor(title, desc, dueDate, priority) {
        this.__type = "task"
        this.title = title
        this.desc = desc
        this.dueDate = dueDate
        this.priority = priority
        this.completeness = "notDone"
        this.id = crypto.randomUUID()
    }

    changeCompleteness() {
        this.completeness = this.completeness === "notDone" ? "done" : "notDone"
    }

    get formattedDate() {
        return format(new Date(this.dueDate), "d MMMM yyyy")
    }
}

let categories = localStorage.getItem("todo") ? 
JSON.parse(localStorage.getItem("todo"), reviver) : {}

function reviver(key, value) {
    if (value?.__type === "task") {
        Object.setPrototypeOf(value, ToDo.prototype)
    } 
    return value
}

function updateStorage() {
    localStorage.setItem("todo", JSON.stringify(categories))
}

function addCategory(name) {
    categories[name] = []
    updateStorage()
}

function removeCategory(name) {
    delete categories[name]
    updateStorage()
}

function addTaskToList(list, task) {
    categories[list].push(task)
    updateStorage()
}

function removeTaskFromList(list, div) {
    categories[list].splice(categories[list].findIndex(task => task.id === div.getAttribute("data-id")), 1)
    updateStorage()
}

export {ToDo, categories, addCategory, removeCategory, addTaskToList, removeTaskFromList}