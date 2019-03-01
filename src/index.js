let commentList = document.querySelector(`#comment-list`)
let createButton = document.querySelector("#createButton")
let editButton = document.querySelector("#editButton")
let editFormPopulate = document.querySelector("#editFormPopulate")
let editInput = document.querySelector("#edit-comment-input")
let editForm = document.querySelector("#edit-form")

document.addEventListener('DOMContentLoaded', function(e) {
  getComments()

  document.addEventListener("click", function(e) {
    console.log(e.target)
    if (e.target.id == "createButton") {
      createButton.addEventListener("submit", function(e) {
        createComment(e.target.parentElement)
      })
    }
    if (e.target.id == `deleteBtn`) {
      deleteComment(e.target.parentElement)
    }
    if (e.target.id == `editFormPopulate`) {
      populateForm(e.target.parentElement)
    }
    if (e.target.id == `editButton`) {
      editComment(e.target.parentElement)
    }
  })

  createButton.addEventListener("click", function(e) {
    createComment(e.target.parentElement)
  })

}) //DOMContentLoaded


function filterComments() {
  let input = document.querySelector("#filter-comments-input")
  let filter = input.value.toUpperCase();
  ul = document.getElementById("comment-list");
  li = ul.getElementsByTagName('li');

  let yourComments = document.querySelector("#comments-filter-term")
  yourComments.innerHTML = `comments containing ${input.value}`

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    let span = li[i].getElementsByTagName("span")[0];
    let txtValue = span.textContent || span.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function populateForm(input) {
  let content = input.querySelector("span").innerText
  editForm.innerHTML = `
  <form id="edit-form">
    <label for="edit-comment-input"> <h4>Edit a Comment</h4> </label>
    <input data-id=${input.id} class="form-control" type="text" id="edit-comment-input" value="${content}" />
    <button id="editButton" class="btn btn-success buttons" type="submit" name="comment-button">Edit comment</button>
  </form>
  `
}

function editComment(comment) {
  let id = comment.querySelector("#edit-comment-input").dataset.id
  let content = comment.querySelector("#edit-comment-input").value
  fetch(`http://localhost:3000/comments/${id}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({content: content})
  })
  .then(r => r.json())
  .then(function(comment) {
    renderComment(comment)
  })
}


function createComment(comment) {
  let input = comment.querySelector("#add-comment-input").value
  fetch(`http://localhost:3000/comments`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({content: input})
  })
  .then(r => r.json())
  .then(function(parsed) {
    // debugger
    allComments.push(parsed)
    renderComment(parsed)
  })

}

function deleteComment(comment) {
  // debugger
  commentList.removeChild(comment)
  fetch(`http://localhost:3000/comments/${comment.id}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({id: comment.id})
  })
  .then(r => r.json())
  .then(function(comment) {
    // commentList.removeChild()
  })
}

function getComments() {
  fetch(`http://localhost:3000/comments`)
  .then(r => r.json())
  .then(function(parsed) {
    allComments = parsed
    renderComments(parsed)
  })
}

function renderComments(comments) {
  comments.forEach(function(comment) {
    renderComment(comment)
  })
}

function renderComment(comment) {
  commentList.innerHTML += `
  <li id=${comment.id} class="list-group-item">
  <span> ${comment.content} </span>
  <button id="deleteBtn" class="btn btn-danger btn-sm pull-right">Delete</button>
  <button id="editFormPopulate" class="btn btn-caution btn-sm pull-right">Edit</button>
</li>
  `
}
