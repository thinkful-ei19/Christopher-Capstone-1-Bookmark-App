//bookmarks.js
//Handles main functions used to render the app.

//V1. Pass object to API
//V2. Callback function should append to store.
//V3. Get function should receive array from API and append to local store.
//V4. Use store array to render the html
//V5. Create a onclick listener to open an a detailed view on li element.

//Takes each array item passed as argument and returns a single string for buildHtml to create a full string.
const liItem = function(item) {
    //Simple list item
    return `
    <li class="simple"id="${item.id}">
        <h3>${item.title}</h3>
        <p class="rating${item.rating}"></p>
        <button class="delete-item">delete</button>
    </li>
    `
}

//Takes items from store and passes html string for render();
const buildHtml = function() {
    let items = store.bookmarks.map((item) => liItem(item));
    return items.join('');
}

const detailedView = function() {
    const detailedLiItem = function(item) {
        return `
        <div class="detailed-div-left">
            <h3>${item.title}</h3>
            <p class="rating${item.rating}"></p>
            <button class="delete-item">delete</button>
        </div>
        <div class="detailed-div-right>
            <button class="visit-url"><a href="${item.url}" target="_blank">Visit Page</a></button>
            <span>${item.desc}</span>
        </div>
        `
    }
    const simpleLiItem = function(item) {
        return `
            <h3>${item.title}</h3>
            <p class="rating${item.rating}"></p>
            <button class="delete-item">delete</button>
        `
    }
    $('ul').on('click', 'li', function() {
        let bookmark = store.findById(this.id);
        let htmlString = simpleLiItem(bookmark);
        if ($(this).hasClass('simple')) {
            $(this).removeClass('simple');
            htmlString = detailedLiItem(bookmark);
        } else {
            $(this).addClass('simple');
        }
        $(this).html(htmlString);
    })
}

const deleteBookmark = function() {
    $('ul').on('click', '.delete-item', function() {
        let bookmarkId = store.findById(this.closest('li').id).id;
        api.deleteBookmark(bookmarkId, ()=>{
            store.bookmarks = store.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
            render();
        })
        
    })
}

const render = function() {
    let htmlString = buildHtml();
    $('.results').html(htmlString);
}

//Toggle for form display
const displayForm = function() {
    $('.display-add-bookmark').on('click', function() {
    if ($('.form-div').hasClass('hidden') === true) {
        $('.form-div').removeClass('hidden');
    } else {
        $('.form-div').addClass('hidden');
    }   
    })
}

//Submit form- should 'POST' to API and return an array to pass into store, then render.
const submitBookmark = function() {
    $('#add-bookmark-form').on('submit', function(e) {
        $('.form-div').addClass('hidden');
        e.preventDefault();
        console.log('running submitBookmark')
        //Create an object
        let rating = document.getElementById('form-rating');
        let selectedRating = rating.options[rating.selectedIndex].value;
        const newBookmark = {
            id: cuid(),
            title: $('#title').val(),
            url: $('#link').val(),
            rating: selectedRating,
            desc: $('#description').val()
        }

        $('#title').val('');
        $('#link').val('');
        $('#description').val('');
        api.createBookmark(newBookmark, function() {
            console.log('pushed into store');
            render();
        });
        setTimeout(function(){
            api.getBookmarks((bookmarks) => {
                store.bookmarks = [];
                bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
                render();
              });
        }, 500)
    })
}

const handleApp = function() {
    displayForm();
    submitBookmark();
    detailedView();
    deleteBookmark();
    render();
}