//api.js
//Handles all api requests to server.
const api = (function() {
    BASE_URL = 'https://thinkful-list-api.herokuapp.com/christopher';
    const getBookmarks = function(callback) {
        console.log('getBookmarks ran');
        $.getJSON(BASE_URL + '/bookmarks', callback);
    }
    const createBookmark = function(bookmark, callback) {
        console.log('createBookmark running');
        $.ajax({
            url: BASE_URL + '/bookmarks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bookmark),
            success: callback
        }) 
        console.log('createBookmark successfully ran')
    }
    const updateBookmark = function(id, updateData, callback){
        console.log(`updateBookmark ran`);
        $.ajax({
            url: BASE_URL + '/bookmarks/' + id,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: callback
        })
    }
    const deleteBookmark = function(id, callback){
        console.log(`deleteBookmark ran`);
        $.ajax({
            url: BASE_URL + '/bookmarks/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            success: callback
        })
    }
    return {
        getBookmarks,
        createBookmark,
        updateBookmark,
        deleteBookmark
    }
}());