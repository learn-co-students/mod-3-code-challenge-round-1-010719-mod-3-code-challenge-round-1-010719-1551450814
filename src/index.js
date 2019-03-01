document.addEventListener('DOMContentLoaded', function() {
  const commentList = document.querySelector('#comment-list');
  const commentForm = document.querySelector('#comment-form');
  const newCommentField = commentForm.querySelector('#add-comment-input');
  const filterInput = document.querySelector('#filter-comments-input');
  const editHere = document.querySelector('#edit-comment-here');
  const commentsUrl = 'http://localhost:3000/comments';
  let allComments = [];
  let filteredComments = [];

  filterInput.addEventListener('keyup', e => {
    filterComments(e.target.value);
  });

  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    addComment(newCommentField.value);
  });

  commentList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-danger')) {
      let comment = allComments.find(c => {
        return c.id == e.target.dataset.id;
      });
      deleteComment(comment);
    } else if (e.target.classList.contains('btn-info')) {
      let comment = allComments.find(c => {
        return c.id == e.target.dataset.id;
      });
      editComment(comment);
    };
  });

  function editComment(comment) {
    const editHtml = `
    <form id="edit-form">
      <label for="edit-comment-input"> <h4>Edit Comment</h4> </label>
      <input class="form-control" type="text" id="edit-comment-input" />
      <button class="btn btn-success buttons" type="submit" name="comment-button">Edit comment</button>
    </form>
    `;
    editHere.innerHTML += editHtml;
    const editForm = editHere.querySelector('#edit-form');
    const newContent = editForm.querySelector('#edit-comment-input');
    editForm.addEventListener('submit', e => {
      e.preventDefault();
      let change = newContent.value;
      updateComment(comment, change);
    });
  };

  function updateComment(comment, change) {
    fetch(`${commentsUrl}/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        content: change
      })
    })
    .then(resp => resp.json())
    .then(comment => {
      let index = allComments.findIndex(c => {
        return c.id == comment.id;
      });
      allComments[index].content = comment.content;
      const editForm = editHere.querySelector('#edit-form');
      editHere.removeChild(editForm);
      loadComments(allComments);
    });
  };

  function filterComments(input) {
    filteredComments = allComments.filter(c => {
      return c.content.toUpperCase().includes(input.toUpperCase());
    });
    loadComments(filteredComments);
  };

  function deleteComment(comment) {
    fetch(`${commentsUrl}/${comment.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then(() => {
      let index = allComments.findIndex(c => {
        return c.id == comment.id;
      });
      allComments.splice(3, 1);
      let commentLi = commentList.querySelector(`#c${comment.id}`);
      commentList.removeChild(commentLi);
    });
  };

  function addComment(comment) {
    fetch(commentsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        content: comment
      })
    })
    .then(resp => resp.json())
    .then(comment => {
      allComments.push(comment);
      loadAComment(comment);
      newCommentField.value = '';
    });
  };

  function getComments() {
    fetch(commentsUrl)
    .then(resp => resp.json())
    .then(comments => {
      loadComments(comments);
      comments.forEach(c => {
        allComments.push(c);
      });
    });
  };

  function loadComments(comments) {
    commentList.innerHTML = '';
    comments.forEach(c => {
      loadAComment(c);
    });
  };

  function loadAComment(comment) {
    commentList.innerHTML += `
      <li id='c${comment.id}' class="list-group-item">
        <span>${comment.content}</span>
        <button data-id='${comment.id}' class="btn btn-danger btn-sm pull-right">Delete</button>
        <button data-id='${comment.id}' class="btn btn-info btn-sm pull-right">Edit</button>
      </li>
    `;
  };

  getComments();
});
