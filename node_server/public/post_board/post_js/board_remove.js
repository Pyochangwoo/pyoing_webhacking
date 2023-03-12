
function deletePost() {
    const { title, writer, createdAt, id } = postInfo;
    

    $.ajax({
      url: '/posts_remove',
      type: 'post',
      data: {
        id: id,
        title: title,
        writer: writer,
        createdAt: createdAt,
      },
      success: function(result) {
        console.log(result);
        alert("글이 성공적으로 삭제 되었습니다.")
        location.href='../post.html'
      },
      error: function(err) {
        console.error(err);
        alert("자신의 글만 삭제할 수 있습니다.")
      }
    });
  }