document.addEventListener('DOMContentLoaded', function() {
commentList = document.querySelector('#comment-list')
commentForm = document.querySelector('#comment-form')
editCommentForm = document.querySelector('#edit-comment-form')
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
    return allComments
}

function renderSingleComment(comment){
  commentList.innerHTML += `
  <li class="list-group-item" data-id=${comment.id}>
  <span>${comment.content} </span>
  <button id="deleteButton" class="btn btn-danger btn-sm pull-right">Delete</button>
  <button id="editButton" class="btn btn-success btn-sm pull-right">Edit</button>
  </li>
  `}

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

function renderCommentToDom(comment){
  commentList.innerHTML += `
  <li class="list-group-item" data-id=${comment.id}>
  <span>${comment}</span>
  <button id="deleteButton" class="btn btn-danger btn-sm pull-right">Delete</button>
  <button id="editButton" class="btn btn-success btn-sm pull-right">Edit</button>

  </li>
  `
}


function deleteComment(commentId){
  fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "DELETE"
  })
}

function filterComments(e) {
  let input = e.target.value
  let filteredComments = allComments.filter(comment=>{
    return comment.content.toLowerCase().includes(input) || comment.content.toUpperCase().includes(input)
  });
  renderComments(filteredComments)
}

commentList.addEventListener("click", e=>{
  if (e.target.id === "deleteButton"){
  let commentId = e.target.parentElement.dataset.id
  deleteComment(commentId)
  e.target.parentElement.remove()
  console.log(commentId)
} if (e.target.id === "editButton") {
  let commentId = e.target.parentElement.dataset.id
  let comment = allComments.find(comment => comment.id == e.target.parentElement.dataset.id )
  editComment(comment)
}
})

function editComment(comment) {
  editCommentForm.innerHTML = `
  <input type="hidden" id="comment-id" value="${comment.id}" />
  <label for="add-comment-input"> <h4>Edit comment</h4> </label>
  <input class="form-control" type="text" id="new-comment-id" value ="${comment.content}"/>
  <button id="please" class="submit-edit" type="submit" name="comment-button">Edit comment</button>`

editCommentForm.addEventListener("click", e=>{
  if (e.target.id == "please"){
  handleEditComment(e)}

})}

function handleEditComment(e){
   // debugger
   e.preventDefault()
    let content = document.querySelector('#new-comment-id').value
    let id = document.querySelector('#comment-id').value

    fetch(`http://localhost:3000/comments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
  },
    body: JSON.stringify({
      content: content
    })
  })
  .then(r => r.json())
  .then(fetchComments)
  .then(editCommentForm.reset())
}

commentFilter.addEventListener("input", filterComments)

commentForm.addEventListener("submit", e=>{
  e.preventDefault()
  let newComment = document.querySelector('#add-comment-input').value
  postCommentToDB(newComment)
  renderCommentToDom(newComment)
  commentForm.reset();
})


fetchComments()


///edit does not work--it will populate the form with the current comment content but when trying to submit the update, it creates a new comment rather than edits the old one. i'm not 100% sure what is happening here as I am trying to run a PATCH request -- but i think the page is mistaking the edit and create event listeners, and maybe if i added some extra logic so it knows that once i change the content, it runs the patch request it would work. i tried doing this with adding an "editsubmit" id to the "submit" button that renders once "edit" is clicked, but ran out of time in getting this to work.



console.log("dom is loaded!")
})
