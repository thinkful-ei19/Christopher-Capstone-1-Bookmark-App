//bookmarks.js
//Handles main functions used to render the app.

//V1. Pass object to API
//V2. Callback function should append to store.
//V3. Get function should receive array from API and append to local store.
//V4. Use store array to render the html
//V5. Create a onclick listener to open an a detailed view on li element.

//Takes each array item passed as argument and returns a single string for buildHtml to create a full string.
const bookmarks = (function () {

    const liItem = function(item) {
        //Simple list item
        const star = `<span class="fa fa-star checked"></span>`;
        let starString = '';
        for (let i=0; i<item.rating; i++) {
            starString += star;
        }
        return `
        <li class="simple"id="${item.id}">
            <div class="col-3">
                <h3>${item.title}</h3>
                <button class="show-details">Show Details</button>
                <p class="rating${item.rating}">${starString}</p>
            </div>
        </li>
        `
    }

    //Takes items from store and passes html string for render();
    const buildHtml = function(bookmarks=store.bookmarks) {
        let items = bookmarks.map((item) => liItem(item));
        return items.join('');
    }

    const detailedView = function() {
        const detailedLiItem = function(item) {
            const star = `<span class="fa fa-star checked"></span>`;
            let starString = '';
            for (let i=0; i<item.rating; i++) {
                starString += star;
            }
            return `
            <div class="col-3">
                <h3>${item.title}</h3>
                <p class="rating${item.rating}">${starString}</p>
            </div>
            <div class="col-3">
                <span id="change-rating-span">Change Rating
                <select id="change-rating">
                    <option></option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
                </span>
                <button class="visit-url"><a href="${item.url}" target="_blank">Visit Page</a></button>
                <button class="delete-item">Delete</button>
                <button class="show-details">Close Details</button>
            </div>
            <div class="col-6">
                <span class="item-description">${item.desc}</span>
                <br>
                <button class="item-description-button">Edit Description</button>
            </div>
            <div class="details-button-div">
            </div>
            `
        }
        const simpleLiItem = function(item) {
            const star = `<span class="fa fa-star checked"></span>`;
            let starString = '';
            for (let i=0; i<item.rating; i++) {
                starString += star;
            }
            return `
            <div class="col-3">
                <h3>${item.title}</h3>
                <button class="show-details">Show Details</button>
                <p class="rating${item.rating}">${starString}</p>
            </div>
            `
        }
        $('ul').on('click', '.show-details', function() {
            let bookmark = store.findById(this.closest('li').id);
            let htmlString = simpleLiItem(bookmark);
            if ($(this).closest('li').hasClass('simple')) {
                $(this).closest('li').removeClass('simple');
                htmlString = detailedLiItem(bookmark);
            } else {
                $(this).closest('li').addClass('simple');
            }
            $(this).closest('li').html(htmlString);
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

    const sort = function() {
        $('#filter-by-rating').on('change', function(){
            let rating = document.getElementById('filter-by-rating');
            let selectedRating = rating.options[rating.selectedIndex].value;
            let tempArray = store.bookmarks.filter((bookmark) => (bookmark.rating >= selectedRating))
            let htmlString = buildHtml(tempArray);
            $('.results').html(htmlString);
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
            });
            setTimeout(function(){
                api.getBookmarks((bookmarks) => {
                    store.bookmarks = [];
                    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
                    render();
                });
            }, 1000)
        })
    }

    const changeRating = function() {
        $('ul').on('change', '#change-rating', function() {
            let rating = document.getElementById('change-rating');
            let selectedRating = rating.options[rating.selectedIndex].value;
            let bookmarkId = store.findById(this.closest('li').id).id;
            api.updateBookmark(bookmarkId, {rating: selectedRating}, function() {
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

    const changeDesc = function() {
        $('ul').on('click', '.item-description-button', function() {
                const placeholder = $(this).siblings('.item-description').text();
                $(this).siblings('.item-description').html(`<textarea class="desc-edit">${placeholder}</textarea><br>
                <button class="submit-changes">Submit Changes</button>`)
                $(this).addClass('hidden');
        })
        $('ul').on('click', '.submit-changes', function() {
            let newDesc = $('.desc-edit').val();
            let bookmarkId = store.findById(this.closest('li').id).id;
            api.updateBookmark(bookmarkId, {desc: newDesc}, function() {
                console.log('updated callback');
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
        sort();
        changeDesc();
        changeRating();
        render();
    }

    return {
        handleApp, displayForm, submitBookmark, detailedView, deleteBookmark, sort, changeDesc, changeRating, render
    }
})();