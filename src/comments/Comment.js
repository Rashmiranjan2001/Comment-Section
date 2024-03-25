import React from "react";
import CommentForm from "./CommentForm";
import bin from "../comments/bin.png";
const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt);

  const formattedDate = `${createdAt.getDate()}${ordinalSuffix(
    createdAt.getDate()
  )} ${monthNames[createdAt.getMonth()]} ${createdAt.getFullYear()}`;

  const handleReplyClick = () => {
    setActiveComment({ id: comment.id, type: "replying" });
  };

  return (
    <div key={comment.id} className="comment-wrapper">
      <div className="comment-box">
        <div className="comment">
          <div className="comment-image-container"></div>
          <div className="comment-right-part">
            <div className="comment-content">
              <div className="comment-author">{comment.username}</div>
            </div>
            {!isEditing && <div className="comment-text">{comment.body}</div>}{" "}
            {isEditing && (
              <CommentForm
                submitLabel="Update"
                hasCancelButton
                initialText={comment.body}
                handleSubmit={(text) => updateComment(text, comment.id)}
                handleCancel={() => {
                  setActiveComment(null);
                }}
              />
            )}
            <div className="comment-actions">
              {comment.parentId === null && (
                <div className="comment-action" onClick={handleReplyClick}>
                  Reply
                </div>
              )}
              <div
                className="comment-action"
                onClick={() =>
                  setActiveComment({ id: comment.id, type: "editing" })
                }
              >
                Edit
              </div>
            </div>
          </div>
          <div className="comment-createdAt">{formattedDate} </div>
          <div
            className="comment-action-delete"
            onClick={() => deleteComment(comment.id)}
          >
            <div className="delete-image-container">
              <img src={bin} alt="Delete" className="delete-image-button" />
            </div>
          </div>
        </div>
      </div>
      <div className="replies-box">
        {isReplying && (
          <div className="reply-box">
            <CommentForm
              submitLabel="Reply"
              handleSubmit={(text, username) =>
                addComment(text, username, replyId)
              }
            />
          </div>
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to add ordinal suffix to day
function ordinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Array of month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default Comment;
