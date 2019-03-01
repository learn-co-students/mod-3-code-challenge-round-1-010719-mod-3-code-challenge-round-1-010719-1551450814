


document.addEventListener('DOMContentLoaded', function() {
  const commentList = document.querySelector("#comment-list")
  //console.log(commentList);
  const commentForm = document.querySelector("#comment-form")
  const commentUrl = "http://localhost:3000/comments"
  //console.log(commentForm);
  const filterInput = document.querySelector("#filter-comments-input")
  //console.log(filterInput);
  let allComments = []

  function getComments(){
    fetch(commentUrl)
    .then(r => r.json())
    .then(data => {
      allComments = data
      //console.log(data);
      renderAllComments(data)

    })
  }
  function renderAllComments(comments){
    allComments.map(comment => {
      renderSingleComment(comment)
    })
  }

  function renderSingleComment(comment){
    commentList.innerHTML += `
    <li class="list-group-item">
    <span>${comment.content}</span>
    <button data-id=${comment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
    <button data-id=${comment.id} class="btn btn-sm pull-right">Edit</button>

    </li>
    `
  }
  getComments()
  commentFormListener()
  filterComments()
  deleteComment()

  function commentFormListener(){
    commentForm.addEventListener('submit', e => {
      e.preventDefault()
      //console.log(e.target);
      let newComment = commentForm.querySelector("#add-comment-input").value

      commentList.innerHTML += `
      <li class="list-group-item">
      <span>${newComment}</span>
      <button data-id=${newComment.id} class="btn btn-danger btn-sm pull-right">Delete</button>
      <button data-id=${newComment.id} class="btn btn-sm pull-right">Edit</button>


      </li>
      `

      fetch(commentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accepts": "application/json"
        },
        body: JSON.stringify ({
            content: newComment
        })
      })
      .then(r => r.json())
      .then(data => {
        console.log(data);
      })
    })

  }

  function filterComments(){
    filterInput.addEventListener('input', e => {
      console.log(e.target.value);
      let filteredComments = allComments.filter(comment => comment.content.includes(e.target.value))
        //console.log(filteredComments);
       commentList.innerHTML = ''

       //console.log(filteredComments);
       let filteredContent = filteredComments.map(comment => {
         //console.log(comment.content);
         return commentList.innerHTML += `
         <li class="list-group-item">
         <span>${comment.content}</span>
         <button class="btn btn-danger btn-sm pull-right">Delete</button>
         </li>
         `
       })

      })
      }

  function deleteComment(){
    commentList.addEventListener('click', e => {
      //console.log(e.target);
      if(e.target.className === "btn btn-danger btn-sm pull-right"){
        let foundComment = allComments.find(comment => {
          if(comment.id === parseInt(e.target.dataset.id)){
            //console.log(comment.id);
            //console.log(e.target.parentElement);
            e.target.parentElement.remove()
            fetch(`${commentUrl}/${e.target.dataset.id}`, {
              method: "DELETE"
            })
          }
        })
      }
    })
  }






  // your solution here
})
