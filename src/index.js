import { format } from "date-fns"

class ToDo {
    constructor(title, desc, dueDate, priority) {
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

const categories = {}

function addCategory(name) {
    categories[name] = []
}

function removeCategory(name) {
    delete categories[name]
}

function addTaskToList(list, task) {
    categories[list].push(task)
}

function removeTaskFromList(list, div) {
    categories[list].splice(categories[list].findIndex(task => task.id === div.getAttribute("data-id")), 1)
}

export {ToDo, categories, addCategory, removeCategory, addTaskToList, removeTaskFromList}