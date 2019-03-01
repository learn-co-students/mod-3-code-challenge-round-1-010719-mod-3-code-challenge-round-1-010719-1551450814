document.addEventListener('DOMContentLoaded', function() {

  let commentList = document.querySelector("#comment-list")
  let submitButton = document.querySelector("#submitbutton")
  let commentFormInput = document.querySelector("#add-comment-input")
  // let
  // your solution here

  fetchComments()

//fetches & renders existing comments
function fetchComments(){
  fetch("http://localhost:3000/comments")
    .then(function(response) {
      return response.json();
    })
    .then(function(allComments) {
      renderAllComments(allComments)
    });
}

function renderAllComments(allComments){
  allComments.forEach(comment =>  renderSingleComment(comment))
}

function renderSingleComment(comment){
  commentList.innerHTML += `
    <li class="list-group-item">
      <span> ${comment.content} </span>
      <button data-id="delete" class="btn btn-danger btn-sm pull-right">Delete</button>
    </li>
  `
}


// create new comment
function createNewComment(){
  debugger
  document.addEventListener("submit", function(event) {
    debugger
    event.preventDefault()
    console.log("firstsubmit")
    if (event.target.dataset.id === "submitbutton"){
      console.log("submitted")
    }
    let data = {
      content: document.commentFormInput.value
    }

    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r=> r.json())
    .then(function(newComment){
      return renderSingleComment(newComment)
    })
  })

}

function deleteComment(comment){
  document.addEventListener("click", function(event){
    console.log("clicked")
  })
  if (event.target.dataset.id === "delete"){
    fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: "DELETE"
    })
    .then(response =>  response.json())
    .then(comment => commment.delete)
  }
}

function editComment(comment){
  fetch(`http://localhost:3000/comments/${comment.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  }
  )
}

//filter function taken from docs == doesn't function
function filterComments() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("add-comment-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}



})
