//index.js
/*git checkout -b gh-pages
git push origin gh-pages
git merge master*/
//Handles document.ready and renders the page.
$(document).ready(function(){
    api.getBookmarks((items) => {
        items.forEach((bookmark) => store.addBookmark(bookmark));
        bookmarks.render();
      });
    bookmarks.handleApp();
})