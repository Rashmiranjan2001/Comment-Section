import { useState } from "react";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
}) => {
  const [text, setText] = useState(initialText);
  const [username, setUsername] = useState(""); 

  if (submitLabel === "Update") {
    var isTextareaDisabled = text.length === 0; 
  } else {
    var isTextareaDisabled = text.length === 0 || username.length === 0; 
  }

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text, username); 
    setText("");
    setUsername("");
  };

  return (
    <form
      className={`comment-section ${
        submitLabel === "Reply" ? "reply" : "new-comment"
      }`}
      onSubmit={onSubmit}
      style={{ width: submitLabel === "Update" ? "373px" : "" }}
    >
      <div className="comment-or-reply">
        {submitLabel === "Reply"
          ? "Reply"
          : submitLabel === "Update"
          ? null
          : "Comment"}
      </div>

      {submitLabel !== "Update" && (
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder={submitLabel === "Reply" ? "Reply" : "Comment"}
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="form-button-cancel">
        {hasCancelButton && (
          <button
            type="button"
            className="comment-form-button comment-form-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
        <button className="comment-form-button" disabled={isTextareaDisabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
