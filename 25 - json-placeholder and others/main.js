// Task 01 -- Option Object
function displayCourseInfo(courseName, courseDuration, courseOwner) {
    console.log("Course Information:");
    console.log("Course Name: " + courseName);
    console.log("Course Duration: " + courseDuration);
    console.log("Course Owner: " + courseOwner);
}

// Example usage:
displayCourseInfo("Web Development Fundamentals", "12 weeks", "John Smith");

let usersData = [];
let allComments = [];
let usersElementId = 0;

async function fetchingUsers() {
    let users = await fetch('https://jsonplaceholder.typicode.com/users');
    usersData = await users.json();
    usersContainer = document.querySelector('.users')

    for (let i = 0; i < usersData.length; i++) {
        usersLiElement = document.createElement('li');
        usersLiContent = document.createTextNode(usersData[i].name);
        usersLiElement.append(usersLiContent);
        usersLiElement.addEventListener('click', () => {
            fetchUserPosts(usersData[i].id);
        });

        usersContainer.append(usersLiElement);
    }
}

fetchingUsers()

async function fetchingPosts() {
    let posts = await fetch('https://jsonplaceholder.typicode.com/posts');
    let postsData = await posts.json();
    for (let i = 0; i < postsData.length; i++) {
        let postsDiv = document.querySelector('.postsDiv');
        let posts = document.createElement('div');
        posts.classList.add('posts');

        let postsHead = document.createElement('div');
        postsHead.classList.add('posts-head');

        let postsName = document.createElement('div');
        postsName.classList.add('posts-name');

        let postsContentDiv = document.createElement('div');
        postsContentDiv.classList.add('posts-content');

        let postsDetails = document.createElement('div');
        postsDetails.classList.add('posts-details');

        let user = usersData.find(user => user.id === postsData[i].userId);

        // Start postsName
        // Start postsName h3
        if (user) {
            let headingName = document.createElement('h3');
            let headingNameContent = document.createTextNode(user.name);
            headingName.appendChild(headingNameContent);
            postsName.appendChild(headingName);
        }
        // End postsName h3

        // Start postsName icon
        let iconEllipsis = document.createElement('i');
        iconEllipsis.setAttribute('class', 'fa-solid fa-ellipsis');
        postsName.appendChild(iconEllipsis);
        // End postsName icon
        // End postsName

        // Start postsContentDiv
        // Start postsContentDiv p
        let postsContentP = document.createElement('p');
        let postsParagraphContent = document.createTextNode(postsData[i].body);
        postsContentP.appendChild(postsParagraphContent);
        postsContentDiv.appendChild(postsContentP);
        // End postsContentDiv
        // End postsContentDiv p

        // Start postsDetails
        // Start postsDetails icons
        let thumbIcon = document.createElement('i');
        thumbIcon.setAttribute('class', 'fa-solid fa-thumbs-up');

        let commentIcon = document.createElement('i');
        commentIcon.setAttribute('class', 'fa-solid fa-comment');

        let shareIcon = document.createElement('i');
        shareIcon.setAttribute('class', 'fa-solid fa-share');

        postsDetails.appendChild(thumbIcon);
        postsDetails.appendChild(commentIcon);
        postsDetails.appendChild(shareIcon);
        // End postsDetails icons
        // End postsDetails

        postsHead.appendChild(postsName);
        postsHead.appendChild(postsContentDiv);
        posts.appendChild(postsHead);
        posts.appendChild(postsDetails);

        let postComment = await createCommentForEveryPost(postsData[i].id);
        posts.append(postComment)
        postsDiv.appendChild(posts);
    }
}

fetchingPosts(usersElementId)

async function createCommentForEveryPost(postId) {

    let comments = await fetch('https://jsonplaceholder.typicode.com/comments');
    let allComments = await comments.json();

    let postsComment = document.createElement('div');
    postsComment.classList.add('posts-comment');


    // Start Icons Elements
    let writeComment = document.createElement('div');
    writeComment.classList.add('write-comment');

    let input = document.createElement('input');
    input.setAttribute('placeholder', 'write your Comment Here');

    let icons = document.createElement('div');
    icons.classList.add('icons');

    let stickyNote = document.createElement('i');
    stickyNote.setAttribute('class', 'fa-solid fa-note-sticky');

    let smileFace = document.createElement('i');
    smileFace.setAttribute('class', 'fa-regular fa-face-smile');

    let camera = document.createElement('i');
    camera.setAttribute('class', 'fa-solid fa-camera');

    icons.appendChild(stickyNote);
    icons.appendChild(smileFace);
    icons.appendChild(camera);

    writeComment.append(input);
    writeComment.append(icons);
    postsComment.append(writeComment)
    // End Icons Elements
    for (let i = 0; i < allComments.length; i++) {

        if (allComments[i].postId == postId) {
            // Start CommentSection
            let comment = document.createElement('div');
            comment.classList.add('comment');

            let commentDetails = document.createElement('div');
            commentDetails.classList.add('comment-details');

            let commentName = document.createElement('div');
            commentName.classList.add('comment-name');

            let hFourElement = document.createElement('h4');
            hFourElementContent = document.createTextNode(allComments[i].email);
            hFourElement.append(hFourElementContent);
            commentName.append(hFourElement);
            commentDetails.append(commentName)

            let commentContent = document.createElement('div');
            commentContent.classList.add('comments-content');


            let paragraph = document.createElement('p');
            let paragraphContent = document.createTextNode(allComments[i].body);
            paragraph.appendChild(paragraphContent);
            commentContent.append(paragraph)

            commentDetails.appendChild(commentContent);

            comment.append(commentDetails);
            // End CommentSection

            // Start CommentLikeReplaySection
            let commentLikeReplay = document.createElement('div');
            commentLikeReplay.classList.add('comment-like-replay');

            let pLike = document.createElement('p');
            let pLikeComment = document.createTextNode('Like');
            pLike.append(pLikeComment)

            let pReplay = document.createElement('p');
            let pReplayComment = document.createTextNode('Replay');
            pReplay.append(pReplayComment)

            commentLikeReplay.append(pLike)
            commentLikeReplay.append(pReplay)

            comment.append(commentLikeReplay)
            postsComment.append(comment)
            // End CommentLikeReplaySection
        }

    }
    return postsComment
}

async function fetchUserPosts(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await response.json();
    displayUserPosts(posts);
    // try {
    // } catch (error) {
    //     console.error('Error fetching user posts:', error);
    // }
}

// Define the displayUserPosts function
async function displayUserPosts(posts) {

    let postsDiv = document.querySelector('.postsDiv');
    postsDiv.innerHTML = '';
    if (posts.length === 0) {
        postsDiv.innerHTML = 'No Content Available Here😭'
    } else {
        for (let i = 0; i < posts.length; i++) {
            let posts = document.createElement('div');
            posts.classList.add('posts');

            let postsHead = document.createElement('div');
            postsHead.classList.add('posts-head');

            let postsName = document.createElement('div');
            postsName.classList.add('posts-name');

            let postsContentDiv = document.createElement('div');
            postsContentDiv.classList.add('posts-content');

            let postsDetails = document.createElement('div');
            postsDetails.classList.add('posts-details');

            let user = usersData.find(user => user.id === posts[i].userId);

            // Start postsName
            // Start postsName h3
            if (user) {
                let headingName = document.createElement('h3');
                let headingNameContent = document.createTextNode(user.name);
                headingName.appendChild(headingNameContent);
                postsName.appendChild(headingName);
            }
            // End postsName h3

            // Start postsName icon
            let iconEllipsis = document.createElement('i');
            iconEllipsis.setAttribute('class', 'fa-solid fa-ellipsis');
            postsName.appendChild(iconEllipsis);
            // End postsName icon
            // End postsName

            // Start postsContentDiv
            // Start postsContentDiv p
            let postsContentP = document.createElement('p');
            let postsParagraphContent = document.createTextNode(posts[i].body);
            postsContentP.appendChild(postsParagraphContent);
            postsContentDiv.appendChild(postsContentP);
            // End postsContentDiv
            // End postsContentDiv p

            // Start postsDetails
            // Start postsDetails icons
            let thumbIcon = document.createElement('i');
            thumbIcon.setAttribute('class', 'fa-solid fa-thumbs-up');

            let commentIcon = document.createElement('i');
            commentIcon.setAttribute('class', 'fa-solid fa-comment');

            let shareIcon = document.createElement('i');
            shareIcon.setAttribute('class', 'fa-solid fa-share');

            postsDetails.appendChild(thumbIcon);
            postsDetails.appendChild(commentIcon);
            postsDetails.appendChild(shareIcon);
            // End postsDetails icons
            // End postsDetails

            postsHead.appendChild(postsName);
            postsHead.appendChild(postsContentDiv);
            posts.appendChild(postsHead);
            posts.appendChild(postsDetails);

            let postComment = await createCommentForEveryPost(posts[i].id);
            posts.append(postComment)
            postsDiv.appendChild(posts);
        }
    }
}

// // task 03 -- Using a Proxy Object

// const validator = {
//     set(target, prop, value) {
//         if (prop === 'name') {
//             if (typeof value !== 'string' || value.length !== 7) {
//                 throw new Error('Name must be a string of 7 characters.');
//             }
//         } else if (prop === 'address') {
//             if (typeof value !== 'string') {
//                 throw new Error('Address must be a string.');
//             }
//         } else if (prop === 'age') {
//             if (typeof value !== 'number' || value < 25 || value > 60) {
//                 throw new Error('Age must be a number between 25 and 60.');
//             }
//         }
//         target[prop] = value;
//         return true;
//     }
// };

// const person = new Proxy({}, validator);

// // Test the proxy object
// person.name = 'JohnDoe'; // Error: Name must be a string of 7 characters.
// person.name = 'John555'; // Error: Name must be a string of 7 characters.
// person.name = 'John777'; // Valid
// person.address = '123 Main St'; // Valid
// person.age = 30; // Valid

// // task 04 -- Generator for Fibonacci Series
// // Implementation 1: Generate a fixed number of elements from the series.
// function* fibonacci1(n) {
//     let a = 0, b = 1;
//     for (let i = 0; i < n; i++) {
//         yield a;
//         [a, b] = [b, a + b];
//     }
// }

// // Usage:
// for (const num of fibonacci1(10)) {
//     console.log(num);
// }

// // Implementation 2: Generate series up to a maximum value.
// function* fibonacci2(maxValue) {
//     let a = 0, b = 1;
//     while (a <= maxValue) {
//         yield a;
//         [a, b] = [b, a + b];
//     }
// }

// // Usage:
// for (const num of fibonacci2(100)) {
//     console.log(num);
// }

// // task 05 -- Iterable Object with Symbol.iterator
// const myObject = {
//     name: 'John',
//     age: 30,
//     country: 'USA',
//     [Symbol.iterator]() {
//         const properties = Object.keys(this);
//         let index = 0;
//         return {
//             next: () => {
//                 if (index < properties.length) {
//                     const key = properties[index++];
//                     return { value: { key, value: this[key] }, done: false };
//                 } else {
//                     return { done: true };
//                 }
//             },
//         };
//     },
// };

// for (const prop of myObject) {
//     console.log(`Property: ${prop.key}, Value: ${prop.value}`);
// }


// // task 06 -- Creating Shapes with ES6 Classes
// // shapes.js
// class Shape {
//     constructor() {
//         if (new.target === Shape) {
//             throw new Error("Shape class cannot be instantiated directly.");
//         }
//     }

//     area() {
//         throw new Error("Area calculation not implemented.");
//     }

//     perimeter() {
//         throw new Error("Perimeter calculation not implemented.");
//     }

//     toString() {
//         return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
//     }
// }

// class Rectangle extends Shape {
//     constructor(width, height) {
//         super();
//         this.width = width;
//         this.height = height;
//     }

//     area() {
//         return this.width * this.height;
//     }

//     perimeter() {
//         return 2 * (this.width + this.height);
//     }
// }

// class Square extends Shape {
//     constructor(side) {
//         super();
//         this.side = side;
//     }

//     area() {
//         return this.side ** 2;
//     }

//     perimeter() {
//         return 4 * this.side;
//     }
// }

// class Circle extends Shape {
//     constructor(radius) {
//         super();
//         this.radius = radius;
//     }

//     area() {
//         return Math.PI * this.radius ** 2;
//     }

//     perimeter() {
//         return 2 * Math.PI * this.radius;
//     }
// }

// export { Rectangle, Square, Circle };
