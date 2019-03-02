const commentContainer = document.querySelector('#comment-list')
const commentForm = document.querySelector('#comment-form')
const searchBar = document.querySelector('#filter-comments-input')

commentForm.addEventListener('submit', masterSubmitListener)
commentContainer.addEventListener('click', masterClickListener)
searchBar.addEventListener('input', searchComments)

document.addEventListener('DOMContentLoaded', function() {
  fetchComments()
})

function fetchComments(){
  fetch(`http://localhost:3000/comments`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
    allComments = myJson
    renderAllComments(allComments)
  });
}

function renderSingleComment(comment){
  commentContainer.innerHTML += `<li class="list-group-item" data-id=${comment.id}>
  <span> ${comment.content} </span>
  <button class="btn btn-danger btn-sm pull-right" data-action="delete" data-id=${comment.id}>Delete</button>
  <button class="btn btn-info btn-sm pull-right" data-action="edit" data-id=${comment.id}>Edit</button>
  </li>`
}

function renderAllComments(comments){
  commentContainer.innerHTML = ""
  comments.forEach(function(e){
    renderSingleComment(e)
  })
}

function masterSubmitListener(e){
  if (e.target.querySelector('button').name == "comment-button"){
    addNewComment(e)
  }
  if (e.target.querySelector('button').name == "edit-button"){
    editComment(e)
  }
}

function addNewComment(e){
  e.preventDefault()
  let content = e.target.querySelector('#add-comment-input').value
  let data = {
    content: content
  }
  fetch(`http://localhost:3000/comments`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  }) // end of fetch
  .then(function(response) {
  return response.json();
  })
  .then(function(myJson) {
  console.log(JSON.stringify(myJson));
  newComment = myJson
  allComments.push(newComment)
  renderAllComments(allComments)
  commentForm.refresh()
  });
} // end of function

function masterClickListener(e){
  if (e.target.dataset.action == "delete"){
    deleteComment(e)
  }
  if (e.target.dataset.action == "edit"){
    displayEditForm(e)
  }
}

function deleteComment(e){
  let byeComment = allComments.find(comment => comment.id == e.target.dataset.id)
  fetch(`http://localhost:3000/comments/${byeComment.id}`, {
    method: "DELETE"
  })
  for(var i = 0; i < allComments.length; i++){
    if (allComments[i] === byeComment){
      allComments.splice(i,1)
    }
  }
  renderAllComments(allComments)
}

function searchComments(e){
  let input = e.target.value
  let lowerInput = input.toLowerCase()
  let searchedComments = []
  document.querySelector('#display-input').innerText = `Your Comments: Comments Containing ${input}`
  allComments.forEach(function(comment){
    let = lowerComment = comment.content.toLowerCase()
    if (lowerComment.includes(lowerInput)){
    searchedComments.push(comment)
    }
  })
  renderAllComments(searchedComments)
}

function editComment(e){
  e.preventDefault()
  let content = e.target.querySelector('#add-comment-input').value
  let findComment = allComments.find(comment => comment.id == e.target.querySelector('button').dataset.id)
  let data = {
    content: content
  }
  fetch(`http://localhost:3000/comments/${findComment.id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  }) // end of fetch
  .then(function(response) {
  return response.json();
  })
  .then(function(myJson) {
    let editedComment = allComments.find(comment => comment.id == myJson.id)
    editedComment.content = myJson.content
    renderAllComments(allComments)
    displayCreateForm(e)
  })
} // end of func

function displayEditForm(e){
  e.preventDefault()
  let findComment = allComments.find(comment => comment.id == e.target.dataset.id)
  commentForm.querySelector('h4').innerText = "Edit An Existing Comment"
  commentForm.querySelector('#add-comment-input').value = `${findComment.content}`
  commentForm.querySelector('button').name = "edit-button"
  commentForm.querySelector('button').innerText = "Edit Comment"
  commentForm.querySelector('button').dataset.id = `${findComment.id}`
}

function displayCreateForm(e){
  e.preventDefault()
  commentForm.querySelector('h4').innerText = "Create Comment"
  commentForm.querySelector('#add-comment-input').value = ""
  commentForm.querySelector('button').name = "comment-button"
  commentForm.querySelector('button').innerText = "Create Comment"
  commentForm.querySelector('button').dataset.id = ""
}
