let url = 'http://localhost:3000/comments'
let allComments = []
document.addEventListener('DOMContentLoaded', function() {
  let commentList = document.querySelector('#comment-list')
  let commentForm = document.querySelector('#comment-form')
  let filterInput = document.querySelector('#filter-comments-input')
  filterInput.addEventListener('keyup', handleFilter)
  commentForm.addEventListener('submit', handleSubmit)
  commentList.addEventListener('click', handle)



  function addSuccessMessage(e){
    commentList.innerHTML += `<p>You have successfully changed the content</p>`
  }
  function editComment(e){
    let newContent = (e.target.previousElementSibling.previousElementSibling.innerText)
    fetch(`${url}/${e.target.id}` ,{
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      content: newContent
    })
    })
    .then(r => r.json())
    .then(r => addSuccessMessage(r))
  }
  function handleFilter(e){
  let value = filterInput.value
  let arrOfComments = (allComments.filter(comment => {
    return comment.content.includes(value)
  }))
  commentList.innerHTML = ''
  arrOfComments.forEach(comment => {
    addSingleCommentToPage(comment)
  })
}
  function handleSubmit(e){
  let commentInput = document.querySelector('#add-comment-input').value
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      content: commentInput
    })
  })
  .then(r => r.json())
  .then(r => addSingleCommentToPage(r))
}
  function removeCommentFromPage(e){
    e.target.parentElement.remove()
  }
  function deleteComment(e){
    console.log(e);
    let pls = allComments.find(function(comment){
      return comment.id == e.target.id
    })
    fetch(`${url}/${pls.id}`, {
      method: "DELETE"
    })
    .then(r => r.json())
    .then(removeCommentFromPage(e))
  }
  function handle(e){
    if (e.target.dataset.id == 'delete'){
      deleteComment(e)
      }
      else if (e.target.dataset.id == 'edit') {
        editComment(e)
      }
  }
  function addSingleCommentToPage(comment){

  commentList.innerHTML += `
    <li class="list-group-item">
    <span CONTENTEDITABLE> ${comment.content} </span>
    <button data-id=delete id=${comment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
    <button data-id=edit id=${comment.id} class="btn btn-warning btn-sm pull-right">Edit</button>
  </li>
  `
}
  function loopThroughComments(comments){
    comments.forEach(comment => addSingleCommentToPage(comment))
  }
  function fetchComments(){
    fetch(url)
    .then(r => r.json())
    .then(r => {
      allComments = r
      loopThroughComments(r)
    })
  }

  fetchComments()

})
