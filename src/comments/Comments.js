import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";

const COMMENTS_STORAGE_KEY = "comments";

const Comments = ({ commentsUrl, currentUserId }) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

const toggleSortOrder = () => {
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

  const saveCommentsToStorage = (comments) => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  };

  const loadCommentsFromStorage = () => {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return storedComments ? JSON.parse(storedComments) : [];
  };

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const getReplies = (commentId) =>
  backendComments
    .filter((backendComment) => backendComment.parentId === commentId)
    .sort((a, b) => {
      const timeDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? timeDifference : -timeDifference;
    });

  const addComment = (text, username, parentId) => {
    createCommentApi(text, username, parentId).then((comment) => {
      const updatedComments = [...backendComments, comment];
      setBackendComments(updatedComments);
      saveCommentsToStorage(updatedComments);
      setActiveComment(null);
    });
  };

  const updateComment = (text, commentId) => {
    updateCommentApi(text).then(() => {
      const updatedComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedComments);
      saveCommentsToStorage(updatedComments);
      setActiveComment(null);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      deleteCommentApi().then(() => {
        const updatedComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedComments);
        saveCommentsToStorage(updatedComments);
        setActiveComment(null);
      });
    }
  };

  useEffect(() => {
    const storedComments = loadCommentsFromStorage();
    const mergedComments = [...backendComments, ...storedComments];
  
    const sortedComments = mergedComments.sort((a, b) => {
      const timeDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? timeDifference : -timeDifference;
    });
  
    setBackendComments(sortedComments);
    saveCommentsToStorage(sortedComments);
  
    return () => localStorage.removeItem(COMMENTS_STORAGE_KEY);
  }, [sortOrder]);

  return (
    <div className="comments">
      <h3 className="comments-title">Comment Section project by Rashmiranjan Rout  </h3>
      <CommentForm
        submitLabel="Post"
        handleSubmit={(text, username) => addComment(text, username, null)}
      />
    {rootComments.length > 0 && (
      <div className="sort-button">
        <div onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Sort By: Date and Time" : "Sort By: Date and Time"}
        </div>
        <span className="sort-button-text">&#8595;</span>
      </div>
    )}
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
