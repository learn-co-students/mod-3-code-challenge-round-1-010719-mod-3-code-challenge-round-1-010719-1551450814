const commentList = document.querySelector("ul")
const newCommentForm = document.querySelector("#comment-form")
const form = document.querySelector(".form-group")

document.addEventListener('DOMContentLoaded', function() {
  // your solution here
  fetchComments()
})
let allComments = []
function fetchComments() {
  fetch('http://localhost:3000/comments')
  .then(r=>r.json())
  .then(comments=> {
    allComments = comments
    renderComments(allComments)
  })
}
newCommentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const commentContent = newCommentForm.querySelector("#add-comment-input").value;
  const data = {
    content: commentContent,
  }

  fetch('http://localhost:3000/comments', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data)
  })
    .then(r => r.json())
    .then(comment => {
      allComments.push(comment)
      commentList.innerHTML += `
      <li class="list-group-item">
        <input class="form-control" type="text" value="${comment.content}" style="width:75%;">
        <button id="delete-button" class="btn btn-danger btn-sm" data-id="${comment.id}">Delete</button>
      </li>
      `
    })
      newCommentForm.reset()
})
commentList.addEventListener("click", (e) => {
  if (e.target.id == "delete-button") {
    commentId = e.target.dataset.id
    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE"})
      .then(r=>r.json())
      .then(e=> {
      commentList.innerHTML = ``
      fetchComments()
    })
  }
})
form.addEventListener("input", (e) => {
  e.preventDefault()
  let textInput = document.querySelector('#filter-comments-input').value
  let filteredList = allComments.filter((comments) => {
    return comments.content.includes(textInput)
  })
  renderComments(filteredList)
})
function renderComments(comments) {
  commentList.innerHTML = ``
  for (const comment of comments) {
    commentList.innerHTML += `
    <li class="list-group-item">
      <input class="form-control" type="text" value="${comment.content}" style="width:75%;">
      <button id="delete-button" class="btn btn-danger btn-sm" data-id="${comment.id}">Delete</button>
    </li>
    `
  }
}
