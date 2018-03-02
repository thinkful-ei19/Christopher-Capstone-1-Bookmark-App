//store.js
//Contains all parameters dealing with information storage.
const store = (function() {
    
    const addBookmark = function(bookmark) {
        console.log('string', this.bookmarks);
        this.bookmarks.push(bookmark);
    }
 
    const findById = function(id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
      };    

    return {
      bookmarks: [],
      addBookmark,
      findById
    }
}());