//index.js
//Handles document.ready and renders the page.
$(document).ready(function(){
    api.getBookmarks((bookmarks) => {
        bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
        render();
      });
    handleApp();
})