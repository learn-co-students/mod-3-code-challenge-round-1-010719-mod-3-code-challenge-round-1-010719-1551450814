
let allComments = []
const commentList = document.querySelector("#comment-list")
let url = "http://localhost:3000/comments"
let commentForm = document.querySelector("#comment-form")
let commentInput = document.querySelector("#add-comment-input")
let filter = document.querySelector("#filter-comments-input")


document.addEventListener('DOMContentLoaded', function() {


  fetchComments()
})

commentForm.addEventListener("submit", function(event){
  event.preventDefault()
  console.log(event.target)
  let commentContent = commentInput.value
  console.log(commentContent)
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      content: commentContent
    })
  })
  .then(r => r.json())
  .then(function(newComment){
    allComments.push(newComment)
    renderSingleComment(newComment)
    commentInput.value = ""
  })

})

commentList.addEventListener("click", function(event){
  event.preventDefault()
  if(event.target.dataset.action === "delete"){
    commentId = event.target.dataset.id
    comment = allComments.find(comment => comment.id === parseInt(commentId))
    console.log(allComments)
    allComments = allComments.filter(com => com.id != parseInt(commentId))
    renderAllComments(allComments)
    console.log(allComments)
    fetch(`${url}/${commentId}`, {
      method: 'DELETE'
    })
  }
  else if(event.target.dataset.action === "edit"){
    commentId = event.target.dataset.id
    comment = allComments.find(comment => comment.id === parseInt(commentId))
    console.log(comment)
    editCommentForm = document.createElement("form")
    editCommentForm.setAttribute("id", "edit-comment-form")
    // debugger
    editCommentForm.innerHTML = `
      <label for="edit-comment-input"> <h4>Edit Comment</h4> </label>
      <input class="form-control" type="text" id="edit-comment-input" value="${comment.content}"</input>
      <button class="btn btn-success buttons" type="submit" id="edit-comment-button">Edit comment</button>

    `
    commentList.appendChild(editCommentForm)
    console.log(editCommentForm)
    editCommentBtn = editCommentForm.querySelector("#edit-comment-button")
    editCommentBtn.addEventListener("click", function(event){
      newContent = document.querySelector("#edit-comment-input").value
      comment.content = newContent
      renderAllComments(allComments)
      console.log(event.target)
      fetch(`${url}/${commentId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          content: document.querySelector("#edit-comment-input").value
        })
      })
    })

    // would put a toggle in on the edit with more time. changeing from true to false. based on that value will render or not render edit comment form.
    // "hide and go seek"



  }
})

filter.addEventListener("keyup", function(event){
  console.log(filter.value)
  filteredComments = allComments.filter(com => com.content.includes(filter.value))
  renderAllComments(filteredComments)
  //can make not case sensitive, but right now is case sensitive
})

function fetchComments(){
  fetch(url)
  .then(r => r.json())
  .then(function(comments){
    // debugger
    allComments = comments
    console.log(allComments)
    renderAllComments(allComments)
  })
}

function renderSingleComment(comment){
  commentList.innerHTML += `
  <li class="list-group-item">
    <span>${comment.content}</span>
    <button data-action="delete" data-id=${comment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
    <button data-action="edit" data-id=${comment.id} class="btn-sm pull-right">Edit</button>
  </li>
`
}

function renderAllComments(comments){
  commentList.innerHTML = ""
  comments.forEach(comment => renderSingleComment(comment))
}
