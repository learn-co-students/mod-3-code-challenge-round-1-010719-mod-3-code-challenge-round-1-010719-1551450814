document.addEventListener('DOMContentLoaded', function() {
  // your solution here
  const commentList = document.querySelector('#comment-list')
  const commentForm = document.querySelector('#comment-form')
  const search = document.querySelector('#filter-comments-input')
  const url = 'http://localhost:3000/comments'
  let allComments = []

// get comments
  fetch(url)
    .then(res=>res.json())
    .then(function(comments){
      allComments = comments
      commentList.innerHTML = ""
      allComments.forEach(showComments)
    })

// search
  search.addEventListener("input", function(e){
    e.preventDefault()
    let input = search.value.toLowerCase()
    let filteredComment = allComments.filter(comment => {
      if (comment.content.toLowerCase().indexOf(input) >= 0) {
        return comment.content
      }
    })
    if (input.length === 0) {
      commentList.innerHTML = ""
      allComments.forEach(showComments)
    }
    if (input.length > 0) {
      commentList.innerHTML = ""
      filteredComment.forEach(showComments)
    }
  })
// create comment
  commentForm.addEventListener("submit", function(e){
    e.preventDefault()
    let newContent = commentForm.querySelector('#add-comment-input').value
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "content": newContent
      })
    })
      .then(res=>res.json())
      .then(function(newComment){
        allComments.push(newComment)
        commentList.innerHTML = ""
        allComments.forEach(showComments)
        commentForm.reset()
      })
  })
// delete or edit comment
  commentList.addEventListener("click", function(e){
    if (e.target.id === "delete-btn") {
      deleteComment(e)
    }
    if (e.target.id === "edit-btn") {
      createEditForm(e)
      editComment(e)
    }
  })

  function createForm(e){
    commentForm.innerHTML = `
    <form id="comment-form">
      <label for="add-comment-input"> <h4>Create a New Comment</h4> </label>
      <input class="form-control" type="text" id="add-comment-input" />
      <button class="btn btn-success buttons" type="submit" name="comment-button">Create comment</button>
    </form>
    `
  }

// create edit form
  function createEditForm(e){
    let id = parseInt(e.target.dataset.id)
    let editComment = allComments.find(comment => comment.id === id)
    commentForm.innerHTML = `
    <form id="edit-comment-form">
      <label for="edit-comment-input"> <h4>Edit Comment</h4> </label>
      <input class="form-control" type="text" id="edit-comment-input" value="${editComment.content}"/>
      <button id="submit-edit" class="btn btn-success buttons" type="submit" name="comment-button">Edit comment</button>
    </form>
    `
  }
// edit Comment
  function editComment(e){
    let submitEdit = commentForm.querySelector('#submit-edit')
    let id = parseInt(e.target.dataset.id)
    let editForm = commentForm.querySelector('#edit-comment-form')
    submitEdit.addEventListener("click", function(e){
      e.preventDefault()
      let editValue = commentForm.querySelector('#edit-comment-input').value
      fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "content": editValue
        })
      })
        .then(res=>res.json())
        .then(function(editedCom){
          let oldComment = allComments.find(comment => comment.id === id)
          let index = allComments.indexOf(oldComment)
          allComments[index] = editedCom
          commentList.innerHTML = ""
          allComments.forEach(showComments)
          createForm(e)
        })
    })
  }
// render comments
  function showComments(comment){
    commentList.innerHTML += `
    <li class="list-group-item">
      <span> ${comment.content} </span>
        <button id="edit-btn" data-id="${comment.id}" class="btn btn-danger btn-sm pull-right">Edit</button>
      <button id="delete-btn" data-id="${comment.id}" class="btn btn-danger btn-sm pull-right">Delete</button>
    </li>
    `
  }
// delete comments
  function deleteComment(e){
    let id = parseInt(e.target.dataset.id)
    fetch(`${url}/${id}`, {
      method: "DELETE"
    })
      .then(res=>res.json())
      .then(function(deletedComment){
        let oldComment = allComments.find(comment => comment.id === id)
        let index = allComments.indexOf(oldComment)
        allComments.splice(index, 1)
        commentList.innerHTML = ""
        allComments.forEach(showComments)
      })
  }

})
