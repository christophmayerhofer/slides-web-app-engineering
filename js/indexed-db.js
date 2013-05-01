/**
 * IndexedDB example (for Mozilla Firefox).
 *
 *  - WebKit needs the `webkit`-Prefix
 *  - `onerror` callbacks are not implemented
 */
(function() {

    $(document).ready(function() {
        var db, indexedDB = window.indexedDB;

        // remove db
        // indexedDB.deleteDatabase("todos");

        // open IndexedDB database
        var request = indexedDB.open("todos", 3);

        request.onupgradeneeded = function(e) {
            var db = e.target.result,
                tx = e.target.transaction,
                oldVersion = e.oldVersion;

            switch(oldVersion) {
                case 0:
                    db.createObjectStore("todo", { keyPath: "timestamp" });
                case 1:
                    tx.objectStore("todo").createIndex("name", "name", { unique: false });
                case 2:
                    tx.objectStore("todo").deleteIndex("name");
                    tx.objectStore("todo").createIndex("name", "name", { unique: true });
                case 3:
                    break; // upgrade completed
            }
        };

        request.onerror = function(e) {
            console.log(e);
        };

        request.onsuccess = function(e) {
            // save reference to database
            db = e.target.result;
        };

        var addTodo = function(todoText) {
            var tx = db.transaction("todo", "readwrite");
            var store = tx.objectStore("todo");

            var data = {
                "text": todoText,
                "timestamp": new Date().getTime()
            };

            var request = store.put(data);

            request.onsuccess = function(e) {
                getAllTodoItems();
            };
        };

        var deleteTodo = function(id) {
            var tx = db.transaction("todo", "readwrite");
            var store = tx.objectStore("todo");

            var request = store.delete(id);

            request.onsuccess = function(e) {
                getAllTodoItems();
            };
        };

        var getTodoItem = function(id) {
            var tx = db.transaction("todo", "readonly");
            var store = tx.objectStore("todo");

            var request = objectStore.get(id);

            request.onsuccess = function(e) {
                return e.target.result;
            };
        };

        var getAllTodoItems = function() {
            var tx = db.transaction("todo", "readonly");
            var store = tx.objectStore("todo");

            // Get everything in the store;
            var cursorRequest = store.openCursor();

            cursorRequest.onsuccess = function(e) {
                var result = e.target.result;
                if(!!result == false)
                    return;

                result.continue();
            };
        };
    });

})();