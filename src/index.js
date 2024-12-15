document.addEventListener('DOMContentLoaded', function() {

  //VARIABLES===================================================================
  const commentsURL = "http://localhost:3000/comments"
  const commentList = document.querySelector("#comment-list")
  const form = document.querySelector("#comment-form")
  const newCommentValue = document.querySelector("#add-comment-input")
  const filter = document.querySelector("#filter-comments-input")
  const editForm = document.querySelector("#edit-form")
  const editCommentValue = document.querySelector("#edit-comment-input")

  let allComments = []

  //CALLS=======================================================================
  fetchComments()

  //EVENT LISTENERS=============================================================
  form.addEventListener("submit",(e)=>{
    // e.preventDefault()
    fetchPostNewComment()
  })

  commentList.addEventListener("click",(e)=> {
    //DELETE EVENT LISTENER
    if(e.target.id === "delete-comment"){
      fetchDeleteComment(commentsURL + "/" + e.target.dataset.id)
      commentList.removeChild(e.target.parentElement)
    }
    //EDIT EVENT LISTENER
    else if (e.target.id === "edit-button"){
      let editThisComment = allComments.find(comment => comment.id == e.target.dataset.id)
      editForm.addEventListener("submit",(e)=>{
        e.preventDefault()
        fetchPatchEditComment(commentsURL + "/" + editThisComment.id, allComments)

        // renderAllComments(allComments)
        // commentList.innerHTML = ''
        // renderAllComments(allComments)
        editCommentValue.value = ''

      })

    }
  })

  filter.addEventListener("keyup",(e)=>{
    //ugh event listener won't collapse without this line
    filterAllComments(allComments,filter.value)
  })

  //FUNCTIONS===================================================================
  function fetchComments(){
    fetch(commentsURL)
    .then(res => res.json())
    .then(parsedJSON => {
      allComments = parsedJSON
      // console.log(allComments)
      renderAllComments(parsedJSON)
    })
  }

  function fetchPostNewComment(){
    fetch(commentsURL,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "content": newCommentValue.value
      })
    })
  }

  function fetchDeleteComment(url){
    fetch(url, {
      method: "DELETE"
    })
  }

  function fetchPatchEditComment(url,comments){
    fetch(url,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        content: editCommentValue.value
      })
    })
    .then(res => res.json())
    .then(parsedJSON => {
      commentList.innerHTML = ''
      renderAllComments(comments.splice(0,comments.length -1))
      renderSingleComment(parsedJSON)
    })

  }

  function renderSingleComment(comment){
    commentList.innerHTML += `
      <li data-id=${comment.id} class="list-group-item">
        <span> ${comment.content} </span>
        <button id="delete-comment" data-id=${comment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
        <button id="edit-button" data-id=${comment.id} class="btn btn-warning btn-sm pull-right">Edit</button>
      </li>
    `
  }

  function renderAllComments(comments){
    comments.forEach(renderSingleComment)
  }

  function filterAllComments(comments,filterValue){
    let filteredComments = comments.filter(comment=> comment.content.includes(filterValue))
    commentList.innerHTML = ''
    renderAllComments(filteredComments)
  }
})
