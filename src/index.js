document.addEventListener('DOMContentLoaded', function() {
commentList = document.querySelector('#comment-list')
commentForm = document.querySelector('#comment-form')
commentFilter = document.querySelector('#filter-comments-input')
let allComments = []

function fetchComments() {
  fetch('http://localhost:3000/comments')
  .then(r=>r.json())
  .then(comments => renderComments(comments))
}

function renderComments(comments){
  commentList.innerHTML = ""
  comments.forEach(c=>renderSingleComment(c))
  comments.forEach(c=>{
    if (!(allComments.includes(c)))
    allComments.push(c)})
}

function renderSingleComment(comment){
  commentList.innerHTML += `
  <li class="list-group-item" data-id=${comment.id}>
  <span>${comment.content} </span>
  <button id="deleteButton" class="btn btn-danger btn-sm pull-right">Delete</button>
  </li>
  `}

commentForm.addEventListener("submit", e=>{
  e.preventDefault()
  let newComment = document.querySelector('#add-comment-input').value
  postCommentToDB(newComment)
  renderCommentToDom(newComment)
  commentForm.reset();
})

function postCommentToDB(newComment){
  fetch('http://localhost:3000/comments', {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  },
  body: JSON.stringify({
    content: newComment
  })
})
.then(r => r.json())
.then(console.log)
// debugger
}

function renderCommentToDom(c){
  commentList.innerHTML += `
  <li class="list-group-item" data-id=${c.id}>
  <span>${c} </span>
  <button id="deleteButton" class="btn btn-danger btn-sm pull-right">Delete</button>
  </li>
  `
}

commentList.addEventListener("click", e=>{
  if (e.target.id === "deleteButton"){
  let commentId = e.target.parentElement.dataset.id
  deleteComment(commentId)
  e.target.parentElement.remove()
  console.log(commentId)
}
})

function deleteComment(commentId){
  fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "DELETE"
  })
}

commentFilter.addEventListener("input", filterComments)

function filterComments(e) {
  let input = e.target.value
  let filteredComments = allComments.filter(comment=>{
    return comment.content.toLowerCase().includes(input) || comment.content.toUpperCase().includes(input)
  });
  renderComments(filteredComments)
}


fetchComments()






console.log("dom is loaded!")
})
