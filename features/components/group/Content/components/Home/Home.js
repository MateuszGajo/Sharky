import React, { useState } from "react";
import MessageBox from "~common/MessageBox/MessageBox";
import Posts from "~components/Lists/Posts/Posts";

const Home = ({ groupId }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newPost, setNewPost] = useState({
    content: "",
    file: null,
    setContent: () => {},
    setFile: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, file, setContent, setFile });
  };
  return (
    <div className="group-home">
      <form onSubmit={handleSubmit}>
        <MessageBox
          btnSize="small"
          value={content}
          onChange={setContent}
          file={file}
          setFile={setFile}
        />
      </form>
      <div className="group-home__posts">
        {groupId && <Posts groupId={groupId} newPost={newPost} />}
      </div>
    </div>
  );
};

export default Home;
