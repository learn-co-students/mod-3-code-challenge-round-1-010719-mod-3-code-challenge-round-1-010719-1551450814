let allComments = []
const commentList = document.querySelector('#comment-list')
const newCommentForm = document.querySelector('#comment-form')
let commentsURL = `http://localhost:3000/comments`
let filterCommentForm = document.querySelector('#filter-comments-input')


document.addEventListener('DOMContentLoaded', function() {
  fetchComments()
}) //end of DOMContentLoaded

function fetchComments(){
  fetch(commentsURL)
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    allComments = data
    console.log(allComments);
    renderComments()
  })
}//end fetchComments

function renderComments(){
  allComments.map(renderSingleComment).join("")
}//end renderComments

function renderSingleComment(comment){
  commentList.innerHTML += `
  <li class="list-group-item">
    <span> ${comment.content} </span>
    <button data-id=${comment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
    <button data-id=${comment.id} class="btn btn-edit btn-sm pull-right">Edit</button>
  </li>`
} //end renderSingleComment

function commentFormEventListener(){
  newCommentForm.addEventListener('submit', e => {
    e.preventDefault()
    // console.log(e.target)
    let newComment = document.querySelector('#add-comment-input').value
    // console.log(newComment)
    createComment(newComment)
  })//end newCommentForm.addEventListener
} //end commentFormEventListener

function createComment(comment) {
  fetch (commentsURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      content: comment
    })
  })
  .then(res => res.json())
  .then(data => {
    // console.log(renderSingleComment(data))
    renderSingleComment(data)
  })
}//end of createComment

function commentEventListener(){
  commentList.addEventListener('click', e => {
    // console.log(e.target);
    if(e.target.className === 'btn btn-danger btn-sm pull-right'){
      deleteSingleComment(e.target)
    }
    if(e.target.className === 'btn btn-edit btn-sm pull-right'){
      editSingleComment(e.target.previousElementSibling.previousElementSibling.innerText)
    }
  }) //end commentList.addEventListener
}//end deleteCommentEventListener

function deleteSingleComment(comment){
  fetch(`${commentsURL}/${comment.dataset.id}`, {
    method: "DELETE"
  })
  .then(comment.parentElement.remove())
} //end deleteSingleComment

function filterCommentsEventListener(){
  filterCommentForm.addEventListener("input", e => {
    let filteredComments = allComments.filter(comment => comment.content.includes(e.target.value))
    // console.log(filteredComments);
    commentList.innerHTML = ''
    let newlyFilteredComments = filteredComments.map(comments => {
      // console.log(commentList)
      commentList.innerHTML+= `
      <li class="list-group-item">
        <span> ${comments.content} </span>
        <button data-id=${comments.id} class="btn btn-danger btn-sm pull-right">Delete</button>
      </li>
      `
    })
  }) //end of filterCommentForm.addEventListener
} //end filterCommentsEventListener

function editCommentForm(){
  newCommentForm.innerHTML += `
  <form id="edit-comment-form">
  <break>
    <label for="edit-comment-input"></label>
    <input class="form-control" type="text" id="edit-comment-input" />
    <button class="btn btn-success buttons" type="submit" name="edit-comment-button">edit comment</button>
  </form>
  `
}

function editSingleComment(comment){
  console.log(comment);
  document.querySelector('#edit-comment-input').innerText = comment
  //this is rendering the comment to the form in devtools, but not updating the form on the DOM
  //Next step would be rendering comment to the form, and creating a patch request for the comment so that it re-renders to the page as the updated comment
} //end editSingleComment



commentFormEventListener()
commentEventListener()
filterCommentsEventListener()
editCommentForm()
