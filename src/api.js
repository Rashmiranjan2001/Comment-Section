export const getComments = async () => {
  return [

  ];
};

export const createComment = async (text, username, parentId = null) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parentId,
    userId: "1", 
    username:username, 
    createdAt: new Date().toISOString(),
  };
};


export const updateComment = async (text) => {
  return { text };
};

export const deleteComment = async () => {
  return {};
};
