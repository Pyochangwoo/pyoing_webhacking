module.exports.savepost = function(title, content, is_locked, author, connection, callback) {
    const sql = 'INSERT INTO pyoing_board (title, content, is_locked, writer) VALUES (?, ?, ?, ?)';
    connection.query(sql, [title, content, is_locked, author], (error, result) => {
    if (error) {
        console.error('Error saving post:', error);
        callback(false);
    } else {
        console.log('Post saved successfully:', result);
        callback('success');
    }
    });
}